import MiniSearch from 'minisearch'
import {
  dayStartInZone,
  EDUCATION_RANK,
  type ApplicationStatus,
  type CvBankQuery,
  type CvBankResponse,
  type CvBankRow,
  type CvProfile,
  type CustomFieldValue,
  type EducationLevel,
} from '@dekko-isho/shared'
import { config } from '../config.js'
import { firestore } from '../lib/firebase.js'
import { logger } from '../lib/logger.js'
import { phoneSearchDigits } from '../lib/phone.js'
import { jobStore } from './jobs.js'
import { lookups } from './lookups.js'

/** What we persist on each application document (subset used by the index). */
export type ApplicationDoc = {
  jobId: string
  jobTitle: string
  candidateId: string
  formVersionId: string
  uploadId: string
  referenceId: string
  answers: Record<string, unknown>
  cvFile: { key: string; fileId: string | null; contentType: string; size: number; originalName: string }
  attachments: Record<string, { key: string; fileId: string | null; contentType: string; size: number; originalName: string }>
  status: ApplicationStatus
  source: 'circular' | 'talent_pool'
  tags: string[]
  submittedAt: string
  updatedAt: string
  departmentId: string
  locationIds: string[]
  jobTypeId: string
  customFields: Record<string, CustomFieldValue>
  fullName: string
  email: string
  phoneE164: string | null
  phoneRaw: string
  city: string | null
  expYears: number | null
  eduLevel: EducationLevel | null
  skills: string[]
  currentTitle: string | null
  currentCompany: string | null
  profile: CvProfile
  profileEdited: boolean
}

type Entry = CvBankRow & {
  phoneDigits: string
  departmentId: string
  locationIds: string[]
  jobTypeId: string
  customFields: Record<string, CustomFieldValue>
  skillsLower: string[]
}

const entries = new Map<string, Entry>()

const people = new MiniSearch<{ id: string; fullName: string; email: string; jobTitle: string; currentTitle: string; currentCompany: string }>({
  fields: ['fullName', 'email', 'jobTitle', 'currentTitle', 'currentCompany'],
  storeFields: [],
  searchOptions: { prefix: true, fuzzy: 0.15, boost: { fullName: 3, email: 2 }, combineWith: 'AND' },
  tokenize: (text) => text.toLowerCase().split(/[\s@._\-,/]+/).filter(Boolean),
})

const content = new MiniSearch<{ id: string; cvText: string; skills: string; titles: string }>({
  fields: ['cvText', 'skills', 'titles'],
  storeFields: [],
  searchOptions: { prefix: true, fuzzy: 0.1, boost: { skills: 3, titles: 2 }, combineWith: 'AND' },
})

function toEntry(id: string, a: ApplicationDoc): Entry {
  return {
    applicationId: id,
    candidateId: a.candidateId,
    fullName: a.fullName,
    email: a.email,
    phone: a.phoneE164 ?? a.phoneRaw,
    jobId: a.jobId,
    jobTitle: a.jobTitle,
    departmentName: lookups.get('departments', a.departmentId)?.name ?? '',
    locationNames: a.locationIds.map((l) => lookups.get('locations', l)?.name ?? '').filter(Boolean),
    jobTypeName: lookups.get('jobTypes', a.jobTypeId)?.name ?? '',
    expYears: a.expYears,
    eduLevel: a.eduLevel,
    currentTitle: a.currentTitle,
    currentCompany: a.currentCompany,
    city: a.city,
    skills: a.skills,
    status: a.status,
    source: a.source,
    tags: a.tags ?? [],
    submittedAt: a.submittedAt,
    phoneDigits: phoneSearchDigits(a.phoneE164 ?? a.phoneRaw),
    departmentId: a.departmentId,
    locationIds: a.locationIds,
    jobTypeId: a.jobTypeId,
    customFields: a.customFields ?? {},
    skillsLower: a.skills.map((s) => s.toLowerCase()),
  }
}

export function indexApplication(id: string, a: ApplicationDoc, cvText: string) {
  removeFromIndex(id)
  const entry = toEntry(id, a)
  entries.set(id, entry)
  people.add({
    id,
    fullName: entry.fullName,
    email: entry.email,
    jobTitle: entry.jobTitle,
    currentTitle: entry.currentTitle ?? '',
    currentCompany: entry.currentCompany ?? '',
  })
  content.add({
    id,
    cvText: cvText.slice(0, 60_000),
    skills: entry.skills.join(' '),
    titles: [entry.currentTitle, entry.currentCompany, ...a.profile.experience.map((e) => `${e.title ?? ''} ${e.company ?? ''}`)].join(' '),
  })
}

/** Updates fields that don't change searchable CV text (status, tags). */
export function patchIndex(id: string, patch: Partial<Pick<Entry, 'status' | 'tags'>>) {
  const entry = entries.get(id)
  if (entry) Object.assign(entry, patch)
}

export function removeFromIndex(id: string) {
  if (!entries.has(id)) return
  entries.delete(id)
  if (people.has(id)) people.discard(id)
  if (content.has(id)) content.discard(id)
}

export async function buildIndex() {
  const started = Date.now()
  entries.clear()
  people.removeAll()
  content.removeAll()
  const db = firestore()
  const snap = await db.collection('applications').get()
  const extractionIds = [...new Set(snap.docs.map((d) => (d.data() as ApplicationDoc).uploadId).filter(Boolean))]
  const texts = new Map<string, string>()
  for (let i = 0; i < extractionIds.length; i += 300) {
    const refs = extractionIds.slice(i, i + 300).map((id) => db.collection('cvExtractions').doc(id))
    const docs = await db.getAll(...refs, { fieldMask: ['rawText'] })
    for (const d of docs) if (d.exists) texts.set(d.id, String(d.get('rawText') ?? ''))
  }
  for (const doc of snap.docs) {
    const a = doc.data() as ApplicationDoc
    indexApplication(doc.id, a, texts.get(a.uploadId) ?? '')
  }
  logger.info({ applications: entries.size, ms: Date.now() - started }, 'cv bank index built')
}

/** Lookup names can change after indexing; refresh the denormalised labels. */
export function refreshLabels() {
  for (const e of entries.values()) {
    e.departmentName = lookups.get('departments', e.departmentId)?.name ?? ''
    e.locationNames = e.locationIds.map((l) => lookups.get('locations', l)?.name ?? '').filter(Boolean)
    e.jobTypeName = lookups.get('jobTypes', e.jobTypeId)?.name ?? ''
    e.jobTitle = jobStore.get(e.jobId)?.title ?? e.jobTitle
  }
}

const csv = (v?: string) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : [])

function facet(values: string[][], limit = 30) {
  const counts = new Map<string, { value: string; count: number }>()
  for (const list of values) {
    for (const raw of new Set(list)) {
      const k = raw.toLowerCase()
      const cur = counts.get(k)
      if (cur) cur.count += 1
      else counts.set(k, { value: raw, count: 1 })
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, limit)
}

export function searchCvBank(q: CvBankQuery, opts: { all?: boolean } = {}): CvBankResponse {
  let ids: Set<string> | null = null

  const term = q.q?.trim()
  if (term) {
    const digits = term.replace(/\D/g, '')
    if (term.includes('@')) {
      const needle = term.toLowerCase()
      ids = new Set([...entries.values()].filter((e) => e.email.toLowerCase().includes(needle)).map((e) => e.applicationId))
    } else if (digits.length >= 4 && digits.length >= term.replace(/\s/g, '').length - 2) {
      const needle = phoneSearchDigits(digits) || digits
      ids = new Set([...entries.values()].filter((e) => e.phoneDigits.includes(needle)).map((e) => e.applicationId))
    } else {
      ids = new Set(people.search(term).map((r) => String(r.id)))
      const lower = term.toLowerCase()
      for (const e of entries.values()) if (e.fullName.toLowerCase().includes(lower)) ids.add(e.applicationId)
    }
  }

  if (q.text?.trim()) {
    const hits = new Set(content.search(q.text.trim()).map((r) => String(r.id)))
    ids = ids ? new Set([...ids].filter((id) => hits.has(id))) : hits
  }

  const statuses = csv(q.status)
  const education = csv(q.education)
  const skills = csv(q.skills).map((s) => s.toLowerCase())
  const cities = csv(q.city).map((s) => s.toLowerCase())
  const custom: Record<string, string[]> = {}
  for (const pair of csv(q.custom)) {
    const [k, v] = pair.split(':')
    if (k && v) (custom[k] ??= []).push(v.toLowerCase())
  }
  const fromTs = q.from ? dayStartInZone(q.from, config.timezone) : null
  const toTs = q.to ? dayStartInZone(q.to, config.timezone) + 24 * 3600 * 1000 - 1 : null

  const pool = ids ? [...ids].map((id) => entries.get(id)).filter((e): e is Entry => Boolean(e)) : [...entries.values()]

  const matched = pool.filter((e) => {
    if (q.jobId && e.jobId !== q.jobId) return false
    if (q.departmentId && e.departmentId !== q.departmentId) return false
    if (q.locationId && !e.locationIds.includes(q.locationId)) return false
    if (q.jobTypeId && e.jobTypeId !== q.jobTypeId) return false
    if (q.source && e.source !== q.source) return false
    if (statuses.length && !statuses.includes(e.status)) return false
    if (q.minExp != null && (e.expYears ?? -1) < q.minExp) return false
    if (q.maxExp != null && (e.expYears ?? Infinity) > q.maxExp) return false
    if (education.length) {
      const minRank = Math.min(...education.map((l) => EDUCATION_RANK[l as EducationLevel] ?? 99))
      if (!e.eduLevel || (EDUCATION_RANK[e.eduLevel as EducationLevel] ?? 0) < minRank) return false
    }
    if (skills.length && !skills.every((s) => e.skillsLower.some((x) => x.includes(s)))) return false
    if (cities.length && !(e.city && cities.includes(e.city.toLowerCase()))) return false
    if (q.tag && !e.tags.includes(q.tag)) return false
    if (fromTs && Date.parse(e.submittedAt) < fromTs) return false
    if (toTs && Date.parse(e.submittedAt) > toTs) return false
    for (const [key, wanted] of Object.entries(custom)) {
      const v = e.customFields[key]
      const values = (Array.isArray(v) ? v : v == null ? [] : [String(v)]).map((x) => String(x).toLowerCase())
      if (!wanted.some((w) => values.includes(w))) return false
    }
    return true
  })

  const sorters: Record<CvBankQuery['sort'], (a: Entry, b: Entry) => number> = {
    newest: (a, b) => b.submittedAt.localeCompare(a.submittedAt),
    oldest: (a, b) => a.submittedAt.localeCompare(b.submittedAt),
    experience: (a, b) => (b.expYears ?? -1) - (a.expYears ?? -1),
    name: (a, b) => a.fullName.localeCompare(b.fullName),
  }
  matched.sort(sorters[q.sort])

  const start = (q.page - 1) * q.pageSize
  const slice = opts.all ? matched : matched.slice(start, start + q.pageSize)
  const strip = ({ phoneDigits: _p, departmentId: _d, locationIds: _l, jobTypeId: _j, customFields: _c, skillsLower: _s, ...row }: Entry): CvBankRow => row

  return {
    rows: slice.map(strip),
    total: matched.length,
    page: q.page,
    pageSize: q.pageSize,
    facets: {
      skills: facet(matched.map((e) => e.skills)),
      cities: facet(matched.map((e) => (e.city ? [e.city] : []))),
      tags: facet(matched.map((e) => e.tags)),
    },
  }
}

export function applicationsForCandidate(candidateId: string): CvBankRow[] {
  return [...entries.values()]
    .filter((e) => e.candidateId === candidateId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .map((e) => ({ ...e }))
}

export function indexStats() {
  const byStatus: Record<string, number> = {}
  let last7 = 0
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000
  for (const e of entries.values()) {
    byStatus[e.status] = (byStatus[e.status] ?? 0) + 1
    if (Date.parse(e.submittedAt) >= weekAgo) last7 += 1
  }
  return { total: entries.size, byStatus, last7 }
}

export function newSince(sinceIso: string) {
  return [...entries.values()].filter((e) => e.submittedAt >= sinceIso)
}

export function allTags(): string[] {
  return [...new Set([...entries.values()].flatMap((e) => e.tags))].sort()
}
