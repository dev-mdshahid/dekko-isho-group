export type CapacityCountValue = {
  target: number
  decimals: number
  suffix: string
  prefix: string
  grouped: boolean
}

/** Recognize a single number with an optional capacity suffix, preserving its formatting. */
export function parseCapacityCountValue(value: string): CapacityCountValue | null {
  const match = value.match(/^(\s*)((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)(\s*(?:(?:Million|M)\s*\+?|%|\+)?\s*)$/i)
  if (!match) return null

  const numeric = match[2].replace(/,/g, '')
  const target = Number(numeric)
  const decimals = numeric.split('.')[1]?.length ?? 0
  if (!Number.isFinite(target) || decimals > 100) return null

  return {
    target,
    decimals,
    suffix: match[3],
    prefix: match[1],
    grouped: match[2].includes(','),
  }
}

export function formatCapacityCount(value: number, format: CapacityCountValue): string {
  const numeric = format.decimals > 0
    ? value.toFixed(format.decimals)
    : String(Math.floor(value))
  const [integer, fraction] = numeric.split('.')
  const groupedInteger = format.grouped
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : integer

  return `${format.prefix}${groupedInteger}${fraction === undefined ? '' : `.${fraction}`}${format.suffix}`
}

/** Resolve letters from left to right without scrambling whitespace, punctuation, or digits. */
export function scrambleCapacityText(value: string, progress: number): string {
  const letters = [...value].filter((character) => /[a-z]/i.test(character)).length
  const resolved = Math.floor(Math.max(0, Math.min(1, progress)) * letters)
  let index = 0

  return [...value].map((character) => {
    if (!/[a-z]/i.test(character) || index++ < resolved) return character
    const start = character === character.toUpperCase() ? 65 : 97
    return String.fromCharCode(start + Math.floor(Math.random() * 26))
  }).join('')
}
