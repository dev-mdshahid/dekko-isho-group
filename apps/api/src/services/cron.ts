import { config } from '../config.js'
import { circularClosing, newApplicationsDigest } from '../email/templates.js'
import { firestore, nowIso } from '../lib/firebase.js'
import { logger } from '../lib/logger.js'
import { newSince } from './cvbank.js'
import { jobStore, markClosingNotified, tickJobs } from './jobs.js'
import { lookups } from './lookups.js'
import { mailCtx, sendMail } from './mail.js'
import { staffName, staffRecipients } from './staff.js'
import { cleanupPendingUploads } from './uploads.js'

const MINUTE = 60_000
const DIGEST_HOUR = 9
const timers: NodeJS.Timeout[] = []

function localParts(d = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: config.timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) % 24 }
}

const stateRef = () => firestore().collection('system').doc('cron')

async function guard(name: string, fn: () => Promise<unknown>) {
  try {
    await fn()
  } catch (err) {
    logger.error({ err, task: name }, 'scheduled task failed')
  }
}

async function jobTick() {
  const { published, closed } = await tickJobs()
  if (published.length || closed.length) logger.info({ published: published.length, closed: closed.length }, 'circular schedule applied')
}

export async function sendDailyDigest(force = false) {
  const { date, hour } = localParts()
  if (!force && hour < DIGEST_HOUR) return
  const state = await stateRef().get()
  if (!force && state.get('lastDigestDate') === date) return
  await stateRef().set({ lastDigestDate: date, lastDigestAt: nowIso() }, { merge: true })

  const since = (state.get('lastDigestAt') as string | undefined) ?? new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  const fresh = newSince(since)
  if (!fresh.length) return

  const byJob = new Map<string, number>()
  for (const e of fresh) byJob.set(e.jobId, (byJob.get(e.jobId) ?? 0) + 1)
  const open = jobStore.all().filter((j) => j.status === 'published' && !j.isTalentPool)
  const soon = open.filter((j) => j.deadline && Date.parse(j.deadline) - Date.now() < 3 * 24 * 3600 * 1000).length

  const recipients = await staffRecipients()
  const dateLabel = new Intl.DateTimeFormat('en-GB', { timeZone: config.timezone, day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
  for (const r of recipients) {
    sendMail(
      r.email,
      newApplicationsDigest(mailCtx(), {
        recipientName: r.name,
        dateLabel,
        totalNew: fresh.length,
        openCirculars: open.length,
        closingSoon: soon,
        byCircular: [...byJob.entries()]
          .sort((a, b) => b[1] - a[1])
          .map(([jobId, count]) => {
            const job = jobStore.get(jobId)
            return {
              jobTitle: job?.title ?? 'Removed circular',
              department: job ? (lookups.get('departments', job.departmentId)?.name ?? '') : '',
              newCount: count,
              url: `${config.hrPortalUrl}/cv-bank?jobId=${encodeURIComponent(jobId)}&status=new`,
            }
          }),
      }),
      'daily-digest',
    )
  }
  logger.info({ recipients: recipients.length, newApplications: fresh.length }, 'daily digest sent')
}

export async function closingSoon() {
  const now = Date.now()
  for (const job of jobStore.all()) {
    if (job.status !== 'published' || !job.deadline || job.isTalentPool) continue
    if ((job as { closingNotifiedAt?: string }).closingNotifiedAt) continue
    const left = Date.parse(job.deadline) - now
    if (left <= 0 || left > 48 * 3600 * 1000) continue
    const owner = await staffName(job.createdBy)
    const to = owner ? [owner.email] : (await staffRecipients(['hr_admin'])).map((s) => s.email)
    if (!to.length) continue
    const shortlisted = (await firestore().collection('applications').where('jobId', '==', job.id).where('status', 'in', ['shortlisted', 'interview', 'offer']).count().get()).data().count
    sendMail(
      to,
      circularClosing(mailCtx(), {
        ownerName: owner?.name,
        jobTitle: job.title,
        deadline: new Intl.DateTimeFormat('en-GB', { timeZone: config.timezone, dateStyle: 'long', timeStyle: 'short' }).format(new Date(job.deadline)),
        applications: job.applicationsCount,
        shortlisted,
        state: 'closing_soon',
        manageUrl: `${config.hrPortalUrl}/circulars/${job.id}`,
      }),
      'circular-closing',
    )
    await markClosingNotified(job.id)
  }
}

export function startCron() {
  if (!config.cronEnabled) {
    logger.info('scheduled tasks disabled')
    return
  }
  const every = (ms: number, name: string, fn: () => Promise<unknown>) => {
    timers.push(setInterval(() => void guard(name, fn), ms))
    setTimeout(() => void guard(name, fn), 5_000).unref()
  }
  every(MINUTE, 'jobs', jobTick)
  every(15 * MINUTE, 'digest', () => sendDailyDigest())
  every(60 * MINUTE, 'closing-soon', closingSoon)
  every(60 * MINUTE, 'cleanup', cleanupPendingUploads)
  for (const t of timers) t.unref()
  logger.info('scheduled tasks started')
}

export function stopCron() {
  for (const t of timers.splice(0)) clearInterval(t)
}
