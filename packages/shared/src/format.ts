import type { Salary } from './schemas.js'

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

function compactAmount(value: number): string {
  if (value >= 100000 && value % 1000 === 0) return `${(value / 1000).toLocaleString('en-US')}k`
  return value.toLocaleString('en-US')
}

/** Returns null when the salary should not be shown. */
export function formatSalary(s: Salary): string | null {
  if (s.display === 'hidden') return null
  if (s.display === 'negotiable' || (s.min == null && s.max == null)) return 'Negotiable'
  const currency = s.currency === 'BDT' ? '৳' : `${s.currency} `
  const period = s.period === 'month' ? '/month' : '/year'
  if (s.min != null && s.max != null && s.min !== s.max) {
    return `${currency}${compactAmount(s.min)} – ${currency}${compactAmount(s.max)}${period}`
  }
  const single = (s.min ?? s.max) as number
  return `${s.min == null ? 'Up to ' : s.max == null ? 'From ' : ''}${currency}${compactAmount(single)}${period}`
}

export function isJobOpen(job: { deadline: string | null; status?: string }, now = Date.now()): boolean {
  if (job.status && job.status !== 'published') return false
  if (!job.deadline) return true
  return Date.parse(job.deadline) >= now
}

export function makeReferenceId(prefix: string, seq: number, year: number = new Date().getFullYear()): string {
  return `${prefix}-${year}-${String(seq).padStart(5, '0')}`
}

/** Epoch ms of local midnight for a `YYYY-MM-DD` date in the given IANA time zone. */
export function dayStartInZone(day: string, timeZone: string): number {
  const utcMidnight = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(utcMidnight)) return NaN
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(utcMidnight))
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const asLocal = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return utcMidnight - (asLocal - utcMidnight)
}

/** Calendar year in a given IANA time zone (reference numbers follow Dhaka time, not server UTC). */
export function yearInZone(timeZone: string, date = new Date()): number {
  return Number(new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric' }).format(date))
}
