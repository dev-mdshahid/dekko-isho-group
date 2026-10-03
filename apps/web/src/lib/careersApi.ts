import type {
  ApplicationSubmitResponse,
  CvUploadResponse,
  FileRef,
  PublicJob,
  PublicJobDetail,
  PublicMeta,
} from '@dekko-isho/shared'
import { apiGet, apiPost, apiUpload } from './api'

export type { PublicJob, PublicJobDetail, PublicMeta }

let jobsCache: { at: number; promise: Promise<PublicJob[]> } | null = null
const JOBS_TTL_MS = 60_000

/** Open roles, newest first. Shared between the careers page and the roles list. */
export function fetchJobs(): Promise<PublicJob[]> {
  if (jobsCache && Date.now() - jobsCache.at < JOBS_TTL_MS) return jobsCache.promise
  const promise = apiGet<{ jobs: PublicJob[] }>('/api/public/jobs').then((r) => r.jobs)
  jobsCache = { at: Date.now(), promise }
  promise.catch(() => {
    jobsCache = null
  })
  return promise
}

let metaPromise: Promise<PublicMeta> | null = null
export function fetchMeta(): Promise<PublicMeta> {
  metaPromise ??= apiGet<PublicMeta>('/api/public/meta').catch((error) => {
    metaPromise = null
    throw error
  })
  return metaPromise
}

export function fetchJob(slug: string, signal?: AbortSignal): Promise<PublicJobDetail> {
  return apiGet<PublicJobDetail>(`/api/public/jobs/${encodeURIComponent(slug)}`, { signal })
}

export function fetchTalentPool(signal?: AbortSignal): Promise<PublicJobDetail> {
  return apiGet<PublicJobDetail>('/api/public/talent-pool', { signal })
}

export function uploadCv(file: File, jobId: string, onProgress?: (fraction: number) => void) {
  const data = new FormData()
  data.append('jobId', jobId)
  data.append('file', file)
  return apiUpload<CvUploadResponse>('/api/public/cv', data, onProgress)
}

export function uploadAttachment(file: File, jobId: string, onProgress?: (fraction: number) => void) {
  const data = new FormData()
  data.append('jobId', jobId)
  data.append('file', file)
  return apiUpload<FileRef>('/api/public/attachments', data, onProgress)
}

export function submitApplication(input: {
  jobId: string
  formVersionId: string
  uploadId: string
  answers: Record<string, unknown>
  turnstileToken?: string
}) {
  return apiPost<ApplicationSubmitResponse>('/api/public/applications', input)
}

export type { FileRef }

export const SHARE_BASE = (import.meta.env.VITE_SHARE_BASE_URL ?? 'https://hr.dekkoai.online').replace(/\/$/, '')

export function shareUrl(slug: string): string {
  return `${SHARE_BASE}/share/jobs/${slug}`
}

const DAY = 86_400_000

export function postedAgo(iso: string | null, now = Date.now()): string {
  if (!iso) return ''
  const days = Math.floor((now - Date.parse(iso)) / DAY)
  if (days <= 0) return 'Posted today'
  if (days === 1) return 'Posted yesterday'
  if (days < 7) return `Posted ${days} days ago`
  if (days < 14) return 'Posted last week'
  if (days < 31) return `Posted ${Math.floor(days / 7)} weeks ago`
  const months = Math.floor(days / 30)
  return months <= 1 ? 'Posted last month' : `Posted ${months} months ago`
}

export function isNew(iso: string | null, now = Date.now()): boolean {
  return Boolean(iso) && now - Date.parse(iso as string) < 7 * DAY
}

export function formatDeadline(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function closingSoon(iso: string | null, now = Date.now()): boolean {
  if (!iso) return false
  const left = Date.parse(iso) - now
  return left > 0 && left < 5 * DAY
}

export function locationsLabel(job: Pick<PublicJob, 'locations'>): string {
  return job.locations.map((l) => l.name).join(', ')
}

export function customFieldText(value: PublicJob['customFields'][number]['value']): string {
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value)
}
