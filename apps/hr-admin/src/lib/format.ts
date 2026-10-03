const TZ = 'Asia/Dhaka'

export function formatDate(iso: string | null | undefined, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts }).format(new Date(iso))
}

export function formatDateTime(iso: string | null | undefined) {
  return formatDate(iso, { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function timeAgo(iso: string | null | undefined) {
  if (!iso) return '—'
  const s = Math.round((Date.now() - Date.parse(iso)) / 1000)
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.round(h / 24)
  if (d < 30) return `${d} day${d === 1 ? '' : 's'} ago`
  return formatDate(iso)
}

export function daysLeft(iso: string | null | undefined) {
  if (!iso) return null
  return Math.ceil((Date.parse(iso) - Date.now()) / (24 * 3600 * 1000))
}

/** `<input type="datetime-local">` value in Dhaka time ↔ ISO. */
export function toLocalInput(iso: string | null | undefined) {
  if (!iso) return ''
  const d = new Date(Date.parse(iso) + 6 * 3600 * 1000)
  return d.toISOString().slice(0, 16)
}

export function fromLocalInput(value: string) {
  if (!value) return null
  return new Date(`${value}:00+06:00`).toISOString()
}

export function plural(n: number, word: string, pluralWord = `${word}s`) {
  return `${n.toLocaleString()} ${n === 1 ? word : pluralWord}`
}
