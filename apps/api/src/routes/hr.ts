import { randomUUID } from 'node:crypto'
import { Router } from 'express'
import multer from 'multer'
import { fileTypeFromBuffer } from 'file-type'
import { z } from 'zod'
import {
  applicationUpdate,
  customFieldInput,
  cvBankQuery,
  defaultApplicationForm,
  formTemplateInput,
  jobInput,
  LOOKUP_KINDS,
  lookupItemInput,
  noteInput,
  staffUserInput,
  staffUserUpdate,
  type LookupKind,
} from '@dekko-isho/shared'
import { config } from '../config.js'
import { audit } from '../lib/audit.js'
import { firestore, nowIso } from '../lib/firebase.js'
import { ah, badRequest, notFound, param, parse } from '../lib/http.js'
import { storage, storageKeys } from '../lib/storage.js'
import { adminOnly, anyStaff, canEdit } from '../middleware/auth.js'
import {
  addNote,
  cvDownloadUrl,
  exportCvBankCsv,
  getApplication,
  getCandidate,
  updateApplication,
  updateProfile,
} from '../services/applications.js'
import { allTags, indexStats, refreshLabels, searchCvBank } from '../services/cvbank.js'
import { sendDailyDigest } from '../services/cron.js'
import { changeStatus, createJob, deleteJob, duplicateJob, jobStore, lookupsInUse, statusCounts, updateJob, type JobAction } from '../services/jobs.js'
import { createLookup, deleteCustomField, deleteLookup, lookups, saveCustomField, updateLookup } from '../services/lookups.js'
import { createStaff, deleteStaff, listStaff, me, resendInvite, setDigestPreference, updateStaff } from '../services/staff.js'

const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } })
const IMAGE_EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }

const lookupKind = (raw: string): LookupKind => {
  if (!(LOOKUP_KINDS as readonly string[]).includes(raw)) throw notFound()
  return raw as LookupKind
}

export const hrRouter = Router()
hrRouter.use(anyStaff)

// ── Me & dashboard ───────────────────────────────────────────────────────────

hrRouter.get('/me', ah(async (req, res) => res.json(await me(req.staff!.uid))))

hrRouter.patch(
  '/me',
  ah(async (req, res) => {
    const { notifyDigest } = parse(z.object({ notifyDigest: z.boolean() }), req.body)
    await setDigestPreference(req.staff!.uid, notifyDigest)
    res.json(await me(req.staff!.uid))
  }),
)

hrRouter.get('/dashboard', (_req, res) => {
  const jobs = jobStore.all()
  const soon = Date.now() + 7 * 24 * 3600 * 1000
  res.json({
    jobs: statusCounts(),
    applications: indexStats(),
    recent: searchCvBank(parse(cvBankQuery, { pageSize: 8 })).rows,
    closingSoon: jobs
      .filter((j) => j.status === 'published' && j.deadline && Date.parse(j.deadline) < soon)
      .sort((a, b) => Date.parse(a.deadline!) - Date.parse(b.deadline!))
      .slice(0, 6)
      .map((j) => ({ id: j.id, title: j.title, deadline: j.deadline, applicationsCount: j.applicationsCount })),
    topCirculars: jobs
      .filter((j) => j.status === 'published')
      .sort((a, b) => b.newApplicationsCount - a.newApplicationsCount || b.applicationsCount - a.applicationsCount)
      .slice(0, 6)
      .map((j) => ({ id: j.id, title: j.title, applicationsCount: j.applicationsCount, newApplicationsCount: j.newApplicationsCount, isTalentPool: j.isTalentPool })),
  })
})

// ── Circulars ────────────────────────────────────────────────────────────────

hrRouter.get('/jobs', (_req, res) => {
  const rows = jobStore
    .all()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map(({ form: _f, descriptionHtml: _d, descriptionJson: _j, ...rest }) => ({
      ...rest,
      departmentName: lookups.get('departments', rest.departmentId)?.name ?? '',
      locationNames: rest.locationIds.map((id) => lookups.get('locations', id)?.name ?? '').filter(Boolean),
      jobTypeName: lookups.get('jobTypes', rest.jobTypeId)?.name ?? '',
    }))
  res.json({ jobs: rows })
})

hrRouter.get('/jobs/default-form', (_req, res) => res.json(defaultApplicationForm()))

hrRouter.get('/jobs/:id', (req, res) => {
  const job = jobStore.get(param(req, 'id'))
  if (!job) throw notFound('Circular not found')
  res.json(job)
})

hrRouter.post(
  '/jobs',
  canEdit,
  ah(async (req, res) => {
    const job = await createJob(parse(jobInput, req.body), req.staff!.uid)
    await audit(req, 'job.create', job.id, { title: job.title })
    res.status(201).json(job)
  }),
)

hrRouter.put(
  '/jobs/:id',
  canEdit,
  ah(async (req, res) => {
    const job = await updateJob(param(req, 'id'), parse(jobInput, req.body))
    await audit(req, 'job.update', job.id, { title: job.title })
    res.json(job)
  }),
)

hrRouter.post(
  '/jobs/:id/duplicate',
  canEdit,
  ah(async (req, res) => {
    const job = await duplicateJob(param(req, 'id'), req.staff!.uid)
    await audit(req, 'job.duplicate', job.id, { from: param(req, 'id') })
    res.status(201).json(job)
  }),
)

const JOB_ACTIONS: JobAction[] = ['publish', 'unpublish', 'close', 'reopen', 'archive', 'unarchive']

hrRouter.post(
  '/jobs/:id/status',
  canEdit,
  ah(async (req, res) => {
    const { action } = parse(z.object({ action: z.enum(JOB_ACTIONS as [JobAction, ...JobAction[]]) }), req.body)
    const job = await changeStatus(param(req, 'id'), action)
    await audit(req, `job.${action}`, job.id)
    res.json(job)
  }),
)

hrRouter.delete(
  '/jobs/:id',
  adminOnly,
  ah(async (req, res) => {
    await deleteJob(param(req, 'id'))
    await audit(req, 'job.delete', param(req, 'id'))
    res.status(204).end()
  }),
)

hrRouter.post(
  '/images',
  canEdit,
  imageUpload.single('file'),
  ah(async (req, res) => {
    if (!req.file) throw badRequest('Please choose an image')
    const type = await fileTypeFromBuffer(req.file.buffer)
    const ext = type ? IMAGE_EXT[type.mime] : undefined
    if (!type || !ext) throw badRequest('Images must be PNG, JPG, WebP or GIF')
    const raw = typeof req.body.jobId === 'string' ? req.body.jobId : ''
    const folder = /^[\w-]{1,64}$/.test(raw) ? raw : 'library'
    const id = randomUUID()
    await storage().put(storageKeys.circularImage(folder, id, ext), req.file.buffer, type.mime)
    res.status(201).json({ url: `${config.apiPublicUrl}/api/media/circulars/${folder}/${id}.${ext}` })
  }),
)

// ── Form templates ───────────────────────────────────────────────────────────

const templates = () => firestore().collection('formTemplates')

hrRouter.get(
  '/form-templates',
  ah(async (_req, res) => {
    const snap = await templates().orderBy('name').get()
    res.json({ templates: snap.docs.map((d) => ({ id: d.id, ...d.data() })) })
  }),
)

hrRouter.post(
  '/form-templates',
  canEdit,
  ah(async (req, res) => {
    const input = parse(formTemplateInput, req.body)
    const ref = await templates().add({ ...input, updatedAt: nowIso() })
    await audit(req, 'template.create', ref.id, { name: input.name })
    res.status(201).json({ id: ref.id, ...input })
  }),
)

hrRouter.put(
  '/form-templates/:id',
  canEdit,
  ah(async (req, res) => {
    const input = parse(formTemplateInput, req.body)
    const ref = templates().doc(param(req, 'id'))
    if (!(await ref.get()).exists) throw notFound()
    await ref.set({ ...input, updatedAt: nowIso() })
    await audit(req, 'template.update', ref.id, { name: input.name })
    res.json({ id: ref.id, ...input })
  }),
)

hrRouter.delete(
  '/form-templates/:id',
  canEdit,
  ah(async (req, res) => {
    await templates().doc(param(req, 'id')).delete()
    await audit(req, 'template.delete', param(req, 'id'))
    res.status(204).end()
  }),
)

// ── Settings ─────────────────────────────────────────────────────────────────

hrRouter.get('/settings', (_req, res) => {
  res.json({
    departments: lookups.list('departments'),
    locations: lookups.list('locations'),
    jobTypes: lookups.list('jobTypes'),
    customFields: lookups.customFields(),
  })
})

hrRouter.post(
  '/settings/custom-fields',
  adminOnly,
  ah(async (req, res) => {
    const field = await saveCustomField(null, parse(customFieldInput, req.body))
    await audit(req, 'settings.customField.create', field.id, { key: field.key })
    res.status(201).json(field)
  }),
)

hrRouter.put(
  '/settings/custom-fields/:id',
  adminOnly,
  ah(async (req, res) => {
    const field = await saveCustomField(param(req, 'id'), parse(customFieldInput, req.body))
    await audit(req, 'settings.customField.update', field.id, { key: field.key })
    res.json(field)
  }),
)

hrRouter.delete(
  '/settings/custom-fields/:id',
  adminOnly,
  ah(async (req, res) => {
    await deleteCustomField(param(req, 'id'))
    await audit(req, 'settings.customField.delete', param(req, 'id'))
    res.status(204).end()
  }),
)

hrRouter.post(
  '/settings/:kind',
  adminOnly,
  ah(async (req, res) => {
    const kind = lookupKind(param(req, 'kind'))
    const item = await createLookup(kind, parse(lookupItemInput, req.body))
    await audit(req, `settings.${kind}.create`, item.id, { name: item.name })
    res.status(201).json(item)
  }),
)

hrRouter.put(
  '/settings/:kind/:id',
  adminOnly,
  ah(async (req, res) => {
    const kind = lookupKind(param(req, 'kind'))
    const item = await updateLookup(kind, param(req, 'id'), parse(lookupItemInput, req.body))
    refreshLabels()
    await audit(req, `settings.${kind}.update`, item.id, { name: item.name })
    res.json(item)
  }),
)

hrRouter.delete(
  '/settings/:kind/:id',
  adminOnly,
  ah(async (req, res) => {
    const kind = lookupKind(param(req, 'kind'))
    const id = param(req, 'id')
    await deleteLookup(kind, id, lookupsInUse(kind, id))
    await audit(req, `settings.${kind}.delete`, id)
    res.status(204).end()
  }),
)

// ── Users ────────────────────────────────────────────────────────────────────

hrRouter.get('/users', adminOnly, ah(async (_req, res) => res.json({ users: await listStaff() })))

hrRouter.post(
  '/users',
  adminOnly,
  ah(async (req, res) => {
    const input = parse(staffUserInput, req.body)
    const { uid } = await createStaff(input, { uid: req.staff!.uid, name: req.staff!.name })
    await audit(req, 'user.invite', uid, { email: input.email, role: input.role })
    res.status(201).json({ uid })
  }),
)

hrRouter.patch(
  '/users/:uid',
  adminOnly,
  ah(async (req, res) => {
    const uid = param(req, 'uid')
    const patch = parse(staffUserUpdate, req.body)
    const user = await updateStaff(uid, patch, req.staff!.uid)
    await audit(req, 'user.update', uid, patch)
    res.json(user)
  }),
)

hrRouter.post(
  '/users/:uid/resend-invite',
  adminOnly,
  ah(async (req, res) => {
    await resendInvite(param(req, 'uid'), { name: req.staff!.name })
    await audit(req, 'user.resendInvite', param(req, 'uid'))
    res.json({ ok: true })
  }),
)

hrRouter.delete(
  '/users/:uid',
  adminOnly,
  ah(async (req, res) => {
    await deleteStaff(param(req, 'uid'), req.staff!.uid)
    await audit(req, 'user.delete', param(req, 'uid'))
    res.status(204).end()
  }),
)

// ── CV Bank & applications ───────────────────────────────────────────────────

hrRouter.get('/cv-bank', (req, res) => {
  res.json(searchCvBank(parse(cvBankQuery, req.query)))
})

hrRouter.get('/cv-bank/tags', (_req, res) => res.json({ tags: allTags() }))

hrRouter.get(
  '/cv-bank/export',
  canEdit,
  ah(async (req, res) => {
    const query = parse(cvBankQuery, req.query)
    const csv = exportCvBankCsv(query)
    await audit(req, 'cvbank.export', 'cv-bank', { query: req.query })
    res.set('Content-Type', 'text/csv; charset=utf-8')
    res.set('Content-Disposition', `attachment; filename="cv-bank-${new Date().toISOString().slice(0, 10)}.csv"`)
    res.set('Cache-Control', 'no-store')
    res.send(csv)
  }),
)

hrRouter.get('/applications/:id', ah(async (req, res) => res.json(await getApplication(param(req, 'id')))))

hrRouter.patch(
  '/applications/:id',
  canEdit,
  ah(async (req, res) => {
    const patch = parse(applicationUpdate, req.body)
    const result = await updateApplication(param(req, 'id'), patch, { uid: req.staff!.uid, name: req.staff!.name })
    if (patch.status) await audit(req, 'application.status', param(req, 'id'), { status: patch.status })
    res.json({ status: result.status, tags: result.tags })
  }),
)

hrRouter.post(
  '/applications/:id/notes',
  canEdit,
  ah(async (req, res) => {
    const { body } = parse(noteInput, req.body)
    res.status(201).json(await addNote(param(req, 'id'), body, { uid: req.staff!.uid, name: req.staff!.name }))
  }),
)

hrRouter.put(
  '/applications/:id/profile',
  canEdit,
  ah(async (req, res) => {
    const result = await updateProfile(param(req, 'id'), req.body)
    await audit(req, 'application.profile', param(req, 'id'))
    res.json({ profile: result.profile })
  }),
)

hrRouter.get(
  '/applications/:id/file',
  ah(async (req, res) => {
    const attachment = typeof req.query.attachment === 'string' ? req.query.attachment : undefined
    const file = await cvDownloadUrl(param(req, 'id'), attachment)
    await audit(req, attachment ? 'application.attachment.view' : 'application.cv.view', param(req, 'id'), attachment ? { attachment } : {})
    res.json(file)
  }),
)

hrRouter.get('/candidates/:id', ah(async (req, res) => res.json(await getCandidate(param(req, 'id')))))

// ── Admin tools ──────────────────────────────────────────────────────────────

hrRouter.get(
  '/audit',
  adminOnly,
  ah(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 500)
    const snap = await firestore().collection('auditLog').orderBy('at', 'desc').limit(limit).get()
    res.json({ entries: snap.docs.map((d) => ({ id: d.id, ...d.data() })) })
  }),
)

hrRouter.post(
  '/digest/send',
  adminOnly,
  ah(async (_req, res) => {
    await sendDailyDigest(true)
    res.json({ ok: true })
  }),
)
