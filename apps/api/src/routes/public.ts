import { createHash } from 'node:crypto'
import { Router } from 'express'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { applicationSubmit, contactInput, CV_MAX_BYTES, subscribeInput } from '@dekko-isho/shared'
import { config } from '../config.js'
import { escapeHtml } from '../email/layout.js'
import { contactMessage } from '../email/templates.js'
import { firestore, nowIso } from '../lib/firebase.js'
import { ah, badRequest, notFound, param, parse } from '../lib/http.js'
import { plainText } from '../lib/sanitize.js'
import { APP_VERSION } from '../lib/version.js'
import { storage, verifyLocalToken } from '../lib/storage.js'
import { verifyTurnstile } from '../lib/turnstile.js'
import { submitApplication } from '../services/applications.js'
import { jobStore, publicJobBySlug, publicJobs, toPublicDetail } from '../services/jobs.js'
import { publicMeta } from '../services/lookups.js'
import { mailCtx, sendMail } from '../services/mail.js'
import { requestPasswordReset } from '../services/staff.js'
import { uploadAttachment, uploadCv } from '../services/uploads.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: CV_MAX_BYTES, files: 1, fields: 10 } })

const limiter = (windowMinutes: number, limit: number, message: string) =>
  rateLimit({ windowMs: windowMinutes * 60_000, limit, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: message } })

const uploadLimit = limiter(10, 15, 'Too many uploads. Please wait a few minutes and try again.')
const submitLimit = limiter(10, 10, 'Too many submissions. Please wait a few minutes and try again.')
const formLimit = limiter(10, 8, 'Too many messages. Please wait a few minutes and try again.')

export const publicRouter = Router()

publicRouter.get('/meta', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=60')
  res.json(publicMeta())
})

publicRouter.get('/jobs', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=30')
  res.json({ jobs: publicJobs() })
})

publicRouter.get('/jobs/:slug', (req, res) => {
  const job = publicJobBySlug(param(req, 'slug'))
  if (!job || job.isTalentPool) throw notFound('This role could not be found')
  res.set('Cache-Control', 'public, max-age=30')
  res.json(toPublicDetail(job))
})

publicRouter.get('/talent-pool', (_req, res) => {
  const job = jobStore.talentPool()
  if (!job) throw notFound('We are not collecting CVs for future roles right now')
  res.set('Cache-Control', 'public, max-age=30')
  res.json(toPublicDetail(job))
})

publicRouter.post(
  '/cv',
  uploadLimit,
  upload.single('file'),
  ah(async (req, res) => {
    if (!req.file) throw badRequest('Please choose your CV file')
    const jobId = typeof req.body.jobId === 'string' ? req.body.jobId : ''
    const job = jobId ? jobStore.get(jobId) : null
    if (jobId && (!job || job.status !== 'published')) throw badRequest('This role is no longer accepting applications')
    res.json(await uploadCv({ buffer: req.file.buffer, originalName: req.file.originalname, ip: req.ip, job }))
  }),
)

publicRouter.post(
  '/attachments',
  uploadLimit,
  upload.single('file'),
  ah(async (req, res) => {
    if (!req.file) throw badRequest('Please choose a file')
    const jobId = typeof req.body.jobId === 'string' ? req.body.jobId : null
    res.json(await uploadAttachment({ buffer: req.file.buffer, originalName: req.file.originalname, ip: req.ip, jobId }))
  }),
)

publicRouter.post(
  '/applications',
  submitLimit,
  ah(async (req, res) => {
    const input = parse(applicationSubmit, req.body)
    await verifyTurnstile(input.turnstileToken, req.ip)
    res.status(201).json(await submitApplication(input))
  }),
)

publicRouter.post(
  '/contact',
  formLimit,
  ah(async (req, res) => {
    const input = parse(contactInput, req.body)
    await verifyTurnstile(input.turnstileToken, req.ip)
    const receivedAt = nowIso()
    await firestore().collection('messages').add({ name: input.name, email: input.email, phone: input.phone, message: input.message, source: input.source, receivedAt, ip: req.ip ?? null })
    sendMail(
      config.mail.contactInbox,
      contactMessage(mailCtx(), { ...input, phone: input.phone || undefined, receivedAt }),
      'contact-message',
    )
    res.status(201).json({ ok: true })
  }),
)

publicRouter.post(
  '/subscribe',
  formLimit,
  ah(async (req, res) => {
    const input = parse(subscribeInput, req.body)
    await verifyTurnstile(input.turnstileToken, req.ip)
    const email = input.email.toLowerCase()
    const id = createHash('sha256').update(email).digest('hex').slice(0, 32)
    await firestore().collection('subscribers').doc(id).set({ email, subscribedAt: nowIso(), active: true }, { merge: true })
    res.status(201).json({ ok: true })
  }),
)

publicRouter.post(
  '/password-reset',
  formLimit,
  ah(async (req, res) => {
    const { email } = parse(z.object({ email: z.string().trim().email() }), req.body)
    await requestPasswordReset(email)
    res.json({ ok: true })
  }),
)

/** Routes mounted at the root rather than under /api/public. */
export const rootRouter = Router()

rootRouter.get('/api/health', (_req, res) => {
  res.json({ ok: true, version: APP_VERSION, storage: storage().driver, turnstile: Boolean(config.turnstile.secret), time: nowIso() })
})

rootRouter.get(
  '/api/files/:token',
  ah(async (req, res) => {
    const data = verifyLocalToken(param(req, 'token'))
    if (!data) throw notFound('This link has expired')
    const file = await storage().get(data.key)
    res.set('Content-Type', file.contentType)
    res.set('Cache-Control', 'private, no-store')
    res.set('Content-Disposition', `inline; filename="${(data.downloadName ?? 'file').replace(/"/g, '')}"`)
    res.removeHeader('X-Frame-Options')
    res.set('Content-Security-Policy', `frame-ancestors 'self' ${config.corsOrigins.join(' ')}`)
    res.set('Cross-Origin-Resource-Policy', 'cross-origin')
    res.send(file.body)
  }),
)

rootRouter.get(
  '/api/media/circulars/:jobId/:file',
  ah(async (req, res) => {
    const jobId = param(req, 'jobId')
    const file = param(req, 'file')
    if (!/^[\w-]+$/.test(jobId) || !/^[\w-]+\.(png|jpe?g|webp|gif)$/.test(file)) throw notFound()
    const object = await storage()
      .get(`circulars/${jobId}/images/${file}`)
      .catch(() => null)
    if (!object) throw notFound()
    res.set('Content-Type', object.contentType)
    res.set('Cache-Control', 'public, max-age=31536000, immutable')
    res.set('Cross-Origin-Resource-Policy', 'cross-origin')
    res.send(object.body)
  }),
)

rootRouter.get('/share/jobs/:slug', (req, res) => {
  const slug = param(req, 'slug')
  const job = publicJobBySlug(slug)
  const target = `${config.siteUrl}/career/jobs/${encodeURIComponent(slug)}`
  const title = job ? `${job.title} | Careers at Dekko ISHO Group` : 'Careers at Dekko ISHO Group'
  const description = job ? job.summary || plainText(job.descriptionHtml).slice(0, 200) : 'Explore open roles at Dekko ISHO Group.'
  const image = `${config.siteUrl}/images/career/more-than-a-workplace.png`
  res.set('Cache-Control', 'public, max-age=300')
  res.type('html').send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(target)}">
<meta property="og:image" content="${escapeHtml(image)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="${escapeHtml(target)}">
<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
</head><body><script>location.replace(${JSON.stringify(target)})</script>
<p><a href="${escapeHtml(target)}">View this role</a></p></body></html>`)
})
