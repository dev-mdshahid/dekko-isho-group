import { slugify } from '@dekko-isho/shared'
import type { PublicJob, PublicMeta } from '../../lib/careersApi'

export type FilterOption = { value: string; label: string; count: number }
export type FilterGroup = { param: string; label: string; options: FilterOption[] }

export type SortKey = 'newest' | 'closing'

const CUSTOM_PREFIX = 'f.'

function customValues(job: PublicJob, key: string): string[] {
  const field = job.customFields.find((f) => f.key === key)
  if (!field) return []
  const v = field.value
  if (Array.isArray(v)) return v.map(String)
  if (typeof v === 'boolean') return [v ? 'Yes' : 'No']
  return [String(v)]
}

type Extractor = (job: PublicJob) => { value: string; label: string }[]

function extractors(meta: PublicMeta | null): { param: string; label: string; get: Extractor; order?: string[] }[] {
  const base: { param: string; label: string; get: Extractor; order?: string[] }[] = [
    {
      param: 'dept',
      label: 'Department',
      get: (j) => (j.department ? [{ value: j.department.slug, label: j.department.name }] : []),
      order: meta?.departments.map((d) => d.slug),
    },
    {
      param: 'loc',
      label: 'Location',
      get: (j) => j.locations.map((l) => ({ value: l.slug, label: l.name })),
      order: meta?.locations.map((l) => l.slug),
    },
    {
      param: 'type',
      label: 'Job type',
      get: (j) => (j.jobType ? [{ value: j.jobType.slug, label: j.jobType.name }] : []),
      order: meta?.jobTypes.map((t) => t.slug),
    },
    {
      param: 'exp',
      label: 'Experience',
      get: (j) => (j.experienceLevel ? [{ value: slugify(j.experienceLevel), label: j.experienceLevel }] : []),
    },
  ]
  for (const cf of meta?.customFields ?? []) {
    base.push({
      param: `${CUSTOM_PREFIX}${cf.key}`,
      label: cf.label,
      get: (j) => customValues(j, cf.key).map((v) => ({ value: slugify(v) || v, label: v })),
      order: cf.options.length ? cf.options.map((o) => slugify(o) || o) : undefined,
    })
  }
  return base
}

const FILTER_PARAMS = new Set(['dept', 'loc', 'type', 'exp'])

/** Only known facets count as filters, so tracking params like `utm_source` or `fbclid` are ignored. */
export function isFilterParam(key: string): boolean {
  return FILTER_PARAMS.has(key) || (key.startsWith(CUSTOM_PREFIX) && key.length > CUSTOM_PREFIX.length)
}

export type Filters = { q: string; selected: Record<string, string[]>; sort: SortKey }

export function readFilters(params: URLSearchParams): Filters {
  const selected: Record<string, string[]> = {}
  for (const [key, value] of params.entries()) {
    if (!isFilterParam(key)) continue
    const values = value.split(',').filter(Boolean)
    if (values.length) selected[key] = values
  }
  return {
    q: params.get('q') ?? '',
    selected,
    sort: params.get('sort') === 'closing' ? 'closing' : 'newest',
  }
}

/** `keep` carries over unrelated params (e.g. campaign tracking) from the current URL. */
export function writeFilters(f: Filters, keep?: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of keep ?? []) if (key !== 'q' && key !== 'sort' && !isFilterParam(key)) params.append(key, value)
  if (f.q.trim()) params.set('q', f.q.trim())
  for (const [key, values] of Object.entries(f.selected)) if (values.length) params.set(key, values.join(','))
  if (f.sort !== 'newest') params.set('sort', f.sort)
  return params
}

function matchesQuery(job: PublicJob, q: string): boolean {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return true
  const hay = [
    job.title,
    job.summary,
    job.department?.name,
    job.jobType?.name,
    job.experienceLevel,
    ...job.locations.map((l) => l.name),
    ...job.customFields.flatMap((f) => (Array.isArray(f.value) ? f.value : [String(f.value)])),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return terms.every((t) => hay.includes(t))
}

export function applyFilters(jobs: PublicJob[], meta: PublicMeta | null, f: Filters, exceptParam?: string): PublicJob[] {
  const ex = extractors(meta)
  return jobs.filter((job) => {
    if (!matchesQuery(job, f.q)) return false
    for (const e of ex) {
      if (e.param === exceptParam) continue
      const wanted = f.selected[e.param]
      if (!wanted?.length) continue
      const have = e.get(job).map((x) => x.value)
      if (!wanted.some((w) => have.includes(w))) return false
    }
    return true
  })
}

export function sortJobs(jobs: PublicJob[], sort: SortKey): PublicJob[] {
  const copy = [...jobs]
  if (sort === 'closing') {
    copy.sort((a, b) => {
      const da = a.deadline ? Date.parse(a.deadline) : Number.POSITIVE_INFINITY
      const db = b.deadline ? Date.parse(b.deadline) : Number.POSITIVE_INFINITY
      return da - db
    })
  } else {
    copy.sort((a, b) => Date.parse(b.publishedAt ?? '') - Date.parse(a.publishedAt ?? ''))
  }
  return copy
}

/** Groups with live counts. Each group's counts respect every other active filter. */
export function buildGroups(jobs: PublicJob[], meta: PublicMeta | null, f: Filters): FilterGroup[] {
  return extractors(meta)
    .map((e) => {
      const pool = applyFilters(jobs, meta, f, e.param)
      const labels = new Map<string, string>()
      const counts = new Map<string, number>()
      for (const job of jobs) for (const o of e.get(job)) labels.set(o.value, o.label)
      for (const job of pool) for (const o of e.get(job)) counts.set(o.value, (counts.get(o.value) ?? 0) + 1)
      for (const v of f.selected[e.param] ?? []) if (!labels.has(v)) labels.set(v, v)
      let options = [...labels.entries()].map(([value, label]) => ({ value, label, count: counts.get(value) ?? 0 }))
      if (e.order) {
        const rank = new Map(e.order.map((v, i) => [v, i]))
        options.sort((a, b) => (rank.get(a.value) ?? 999) - (rank.get(b.value) ?? 999) || a.label.localeCompare(b.label))
      } else {
        options = options.sort((a, b) => a.label.localeCompare(b.label))
      }
      return { param: e.param, label: e.label, options }
    })
    .filter((g) => g.options.length > 1 || (g.options.length === 1 && (f.selected[g.param]?.length ?? 0) > 0))
}
