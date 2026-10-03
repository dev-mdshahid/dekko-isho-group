/** camelCase key from a label; non-Latin labels fall back to `fallback`. Always starts with a lowercase letter. */
export function camelKey(label: string, taken: Set<string> = new Set(), fallback = 'question'): string {
  const words = label
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
  let base = words.map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join('') || fallback
  if (!/^[a-z]/.test(base)) base = `${fallback[0]}${base}`
  if (base.length < 2) base = `${base}${fallback[0].toUpperCase()}${fallback.slice(1)}`
  base = base.slice(0, 36)
  let key = base
  let n = 2
  while (taken.has(key)) key = `${base}${n++}`
  return key
}

/** Key for a custom job field: must match `^[a-z][a-zA-Z0-9]{1,39}$`. */
export const customFieldKey = (label: string, taken?: Set<string>) => camelKey(label, taken, 'field')
