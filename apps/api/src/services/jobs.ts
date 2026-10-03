import { randomUUID } from 'node:crypto'
import { FieldValue } from 'firebase-admin/firestore'
import {
  isJobOpen,
  slugify,
  type FormSchema,
  type Job,
  type JobInput,
  type JobStatus,
  type PublicJob,
  type PublicJobDetail,
} from '@dekko-isho/shared'
import { config } from '../config.js'
import { firestore, nowIso } from '../lib/firebase.js'
import { badRequest, notFound } from '../lib/http.js'
import { logger } from '../lib/logger.js'
import { sanitizeDescription } from '../lib/sanitize.js'
import { lookups } from './lookups.js'

type FormVersion = { id: string; jobId: string; version: number; schema: FormSchema; createdAt: string }

const jobs = new Map<string, Job>()
const forms = new Map<string, FormVersion>()

const col = () => firestore().collection('jobs')
const formCol = () => firestore().collection('formVersions')

export async function loadJobs() {
  const [jobSnap, formSnap] = await Promise.all([col().get(), formCol().get()])
  jobs.clear()
  forms.clear()
  for (const doc of formSnap.docs) forms.set(doc.id, { id: doc.id, ...(doc.data() as Omit<FormVersion, 'id'>) })
  for (const doc of jobSnap.docs) {
    const data = doc.data() as Omit<Job, 'id' | 'form'>
    const form = forms.get(data.formVersionId)?.schema ?? { fields: [] }
    jobs.set(doc.id, { ...data, id: doc.id, form } as Job)
  }
  logger.info({ jobs: jobs.size, formVersions: forms.size }, 'jobs loaded')
}

export const jobStore = {
  all: () => [...jobs.values()],
  get: (id: string) => jobs.get(id) ?? null,
  form: (formVersionId: string) => forms.get(formVersionId) ?? null,
  talentPool: () => [...jobs.values()].find((j) => j.isTalentPool && j.status === 'published') ?? null,
}

function uniqueSlug(base: string, exceptId?: string): string {
  const root = slugify(base) || 'role'
  let slug = root
  let n = 2
  while ([...jobs.values()].some((j) => j.slug === slug && j.id !== exceptId)) slug = `${root}-${n++}`
  return slug
}

function persistable(job: Job) {
  const { id: _id, form: _form, ...rest } = job
  return rest
}

/** Everything except the live counters, which only change through `bumpApplications`. */
function withoutCounts(job: Job) {
  const { applicationsCount: _a, newApplicationsCount: _n, ...rest } = persistable(job)
  return rest
}

function clean(input: JobInput) {
  return {
    ...input,
    descriptionHtml: sanitizeDescription(input.descriptionHtml, [config.apiPublicUrl]),
  }
}

async function saveFormVersion(jobId: string, schema: FormSchema, version: number): Promise<FormVersion> {
  const fv: FormVersion = { id: randomUUID(), jobId, version, schema, createdAt: nowIso() }
  await formCol().doc(fv.id).set({ jobId, version, schema, createdAt: fv.createdAt })
  forms.set(fv.id, fv)
  return fv
}

export async function createJob(input: JobInput, uid: string): Promise<Job> {
  const data = clean(input)
  const ref = col().doc()
  const fv = await saveFormVersion(ref.id, data.form, 1)
  const now = nowIso()
  const job: Job = {
    ...data,
    id: ref.id,
    slug: uniqueSlug(data.slug || data.title),
    status: 'draft',
    formVersionId: fv.id,
    applicationsCount: 0,
    newApplicationsCount: 0,
    createdBy: uid,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    closedAt: null,
  }
  await ref.set(persistable(job))
  jobs.set(job.id, job)
  return job
}

export async function updateJob(id: string, input: JobInput): Promise<Job> {
  const existing = jobs.get(id)
  if (!existing) throw notFound('Circular not found')
  const data = clean(input)
  let formVersionId = existing.formVersionId
  const formChanged = JSON.stringify(existing.form) !== JSON.stringify(data.form)
  if (formChanged) {
    const current = forms.get(existing.formVersionId)
    if (existing.applicationsCount > 0 || !current) {
      formVersionId = (await saveFormVersion(id, data.form, (current?.version ?? 0) + 1)).id
    } else {
      await formCol().doc(current.id).update({ schema: data.form })
      forms.set(current.id, { ...current, schema: data.form })
    }
  }
  const job: Job = {
    ...existing,
    ...data,
    slug: data.slug && data.slug !== existing.slug ? uniqueSlug(data.slug, id) : existing.slug,
    formVersionId,
    updatedAt: nowIso(),
  }
  const deadlineChanged = job.deadline !== existing.deadline
  if (deadlineChanged) delete (job as Job & { closingNotifiedAt?: string }).closingNotifiedAt
  if (job.status === 'scheduled' && job.publishAt && Date.parse(job.publishAt) <= Date.now()) {
    job.status = 'published'
    job.publishedAt ??= nowIso()
  }
  await col()
    .doc(id)
    .set({ ...withoutCounts(job), ...(deadlineChanged ? { closingNotifiedAt: FieldValue.delete() } : {}) }, { merge: true })
  // Mutate in place so application counts bumped during the await are kept.
  const { applicationsCount: _a, newApplicationsCount: _n, ...rest } = job
  Object.assign(existing, rest)
  if (deadlineChanged) delete (existing as Job & { closingNotifiedAt?: string }).closingNotifiedAt
  return existing
}

export type JobAction = 'publish' | 'unpublish' | 'close' | 'reopen' | 'archive' | 'unarchive'

export async function changeStatus(id: string, action: JobAction): Promise<Job> {
  const job = jobs.get(id)
  if (!job) throw notFound('Circular not found')
  const now = nowIso()
  let next: Partial<Job> = {}
  switch (action) {
    case 'publish': {
      if (job.deadline && Date.parse(job.deadline) < Date.now()) throw badRequest('The deadline has already passed. Change it before publishing.')
      if (job.publishAt && Date.parse(job.publishAt) > Date.now()) next = { status: 'scheduled' }
      else next = { status: 'published', publishedAt: job.publishedAt ?? now, closedAt: null }
      break
    }
    case 'unpublish':
      next = { status: 'draft' }
      break
    case 'close':
      next = { status: 'closed', closedAt: now }
      break
    case 'reopen':
      if (job.deadline && Date.parse(job.deadline) < Date.now()) throw badRequest('Extend the deadline before reopening this circular.')
      next = { status: 'published', closedAt: null, publishedAt: job.publishedAt ?? now }
      break
    case 'archive':
      next = { status: 'archived' }
      break
    case 'unarchive':
      next = { status: 'draft' }
      break
  }
  await col().doc(id).update({ ...next, updatedAt: now })
  Object.assign(job, next, { updatedAt: now })
  return job
}

export async function duplicateJob(id: string, uid: string): Promise<Job> {
  const job = jobs.get(id)
  if (!job) throw notFound('Circular not found')
  const {
    id: _i,
    status: _s,
    slug: _sl,
    formVersionId: _f,
    applicationsCount: _a,
    newApplicationsCount: _n,
    createdAt: _c,
    updatedAt: _u,
    publishedAt: _p,
    closedAt: _cl,
    createdBy: _cb,
    closingNotifiedAt: _cn,
    ...input
  } = job as Job & { closingNotifiedAt?: string }
  return createJob({ ...input, title: `${job.title} (copy)`, slug: undefined, publishAt: null, isTalentPool: false } as JobInput, uid)
}

export async function deleteJob(id: string) {
  const job = jobs.get(id)
  if (!job) throw notFound('Circular not found')
  if (job.applicationsCount > 0) throw badRequest('This circular has applications. Archive it instead.')
  await col().doc(id).delete()
  jobs.delete(id)
}

export function bumpApplications(jobId: string, delta: { total?: number; fresh?: number }) {
  const job = jobs.get(jobId)
  if (!job) return
  const total = delta.total ?? 0
  const fresh = Math.max(-job.newApplicationsCount, delta.fresh ?? 0)
  job.applicationsCount += total
  job.newApplicationsCount += fresh
  col()
    .doc(jobId)
    .update({ applicationsCount: FieldValue.increment(total), newApplicationsCount: FieldValue.increment(fresh) })
    .catch((err) => logger.error({ err, jobId }, 'failed to update application counts'))
}

export function lookupsInUse(kind: 'departments' | 'locations' | 'jobTypes', id: string): boolean {
  return [...jobs.values()].some((j) =>
    kind === 'departments' ? j.departmentId === id : kind === 'jobTypes' ? j.jobTypeId === id : j.locationIds.includes(id),
  )
}

// ── Public views ─────────────────────────────────────────────────────────────

const pub = (x: { id: string; name: string; slug: string } | null) => (x ? { id: x.id, name: x.name, slug: x.slug } : null)

export function toPublic(job: Job): PublicJob {
  const defs = lookups.customFields()
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    department: pub(lookups.get('departments', job.departmentId)),
    locations: job.locationIds.map((id) => pub(lookups.get('locations', id))).filter((x) => x !== null),
    jobType: pub(lookups.get('jobTypes', job.jobTypeId)),
    experienceLevel: job.experienceLevel ?? '',
    salary: job.salary,
    summary: job.summary,
    customFields: defs
      .filter((d) => job.customFields[d.key] != null && job.customFields[d.key] !== '')
      .map((d) => ({ key: d.key, label: d.label, value: job.customFields[d.key], showOnCard: d.showOnCard })),
    deadline: job.deadline,
    publishedAt: job.publishedAt,
    isTalentPool: job.isTalentPool,
    isOpen: isJobOpen(job),
  }
}

export function toPublicDetail(job: Job): PublicJobDetail {
  return { ...toPublic(job), descriptionHtml: job.descriptionHtml, formVersionId: job.formVersionId, form: job.form }
}

export function publicJobs(): PublicJob[] {
  return [...jobs.values()]
    .filter((j) => j.status === 'published' && !j.isTalentPool && isJobOpen(j))
    .sort((a, b) => Date.parse(b.publishedAt ?? b.createdAt) - Date.parse(a.publishedAt ?? a.createdAt))
    .map(toPublic)
}

export function publicJobBySlug(slug: string): Job | null {
  const job = [...jobs.values()].find((j) => j.slug === slug)
  if (!job || !['published', 'closed'].includes(job.status)) return null
  return job
}

// ── Scheduler ────────────────────────────────────────────────────────────────

export async function tickJobs(): Promise<{ published: Job[]; closed: Job[] }> {
  const now = Date.now()
  const published: Job[] = []
  const closed: Job[] = []
  for (const job of [...jobs.values()]) {
    const pastDeadline = Boolean(job.deadline && Date.parse(job.deadline) < now)
    try {
      if (job.status === 'scheduled' && job.publishAt && Date.parse(job.publishAt) <= now) {
        if (pastDeadline) closed.push(await changeStatus(job.id, 'close'))
        else published.push(await changeStatus(job.id, 'publish'))
      } else if (job.status === 'published' && pastDeadline) {
        closed.push(await changeStatus(job.id, 'close'))
      }
    } catch (err) {
      logger.error({ err, jobId: job.id }, 'scheduled status change failed')
    }
  }
  return { published, closed }
}

export async function markClosingNotified(id: string) {
  const job = jobs.get(id)
  if (!job) return
  ;(job as Job & { closingNotifiedAt?: string }).closingNotifiedAt = nowIso()
  await col().doc(id).update({ closingNotifiedAt: nowIso() })
}

export function statusCounts(): Record<JobStatus, number> {
  const counts = { draft: 0, scheduled: 0, published: 0, closed: 0, archived: 0 }
  for (const j of jobs.values()) counts[j.status] += 1
  return counts
}
