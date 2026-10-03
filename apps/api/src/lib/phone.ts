import { parsePhoneNumberFromString } from 'libphonenumber-js'

/** Normalises to E.164, defaulting to Bangladesh. Returns null if it isn't a plausible number. */
export function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null
  const cleaned = raw.replace(/[^\d+]/g, '')
  if (cleaned.replace(/\D/g, '').length < 8) return null
  const parsed = parsePhoneNumberFromString(cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned, 'BD')
  if (!parsed || !parsed.isPossible()) return null
  return parsed.number
}

/** National significant digits, used for partial phone search (`01711…`, `+8801711…` → `1711…`). */
export function phoneSearchDigits(raw: string | null | undefined): string {
  if (!raw) return ''
  let digits = raw.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('880')) digits = digits.slice(3)
  if (digits.startsWith('0')) digits = digits.slice(1)
  return digits
}
