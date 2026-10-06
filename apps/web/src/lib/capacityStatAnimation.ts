export type CapacityCountValue = {
  target: number
  decimals: number
  suffix: string
  prefix: string
  grouped: boolean
}

/** Recognize a single number with an optional capacity suffix, preserving its formatting. */
export function parseCapacityCountValue(value: string): CapacityCountValue | null {
  const match = value.match(/^(\s*)((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)(\s*(?:(?:Billion|Million|B|M)\s*\+?|%|\+)?\s*)$/i)
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

/**
 * Whole-number targets under 10 (e.g. "1M+") only have one integer step with
 * Math.floor, so they look stuck at 0. Use one decimal during the tween so they
 * count like "3.5M+" / "2.5M+" (0.1, 0.2, …), then snap back to an integer at the end.
 */
function resolveCapacityCountDecimals(value: number, format: CapacityCountValue): number {
  if (format.decimals > 0) return format.decimals
  if (format.target > 0 && format.target < 10 && value < format.target) return 1
  return 0
}

export function formatCapacityCountNumber(value: number, format: CapacityCountValue): string {
  const decimals = resolveCapacityCountDecimals(value, format)
  const numeric = decimals > 0
    ? value.toFixed(decimals)
    : String(Math.floor(value))
  const [integer, fraction] = numeric.split('.')
  const groupedInteger = format.grouped
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : integer

  return `${groupedInteger}${fraction === undefined ? '' : `.${fraction}`}`
}

export function formatCapacityCount(value: number, format: CapacityCountValue): string {
  return `${format.prefix}${formatCapacityCountNumber(value, format)}${format.suffix}`
}

const LETTER_PATTERN = /[a-zA-Z]/

function randomLetter(char: string): string {
  if (char === char.toUpperCase() && char !== char.toLowerCase()) {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26))
  }
  if (char === char.toLowerCase()) {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26))
  }
  return char
}

/** Left-to-right “decoder” reveal; unresolved letters flicker with random same-case glyphs. */
export function scrambleCapacityText(value: string, progress: number): string {
  if (!value || progress >= 1) return value

  const resolvedCount = Math.floor(
    Math.max(0, Math.min(1, progress)) * [...value].filter((char) => LETTER_PATTERN.test(char)).length,
  )
  let seenLetters = 0

  return [...value]
    .map((char) => {
      if (!LETTER_PATTERN.test(char)) return char
      if (seenLetters < resolvedCount) {
        seenLetters += 1
        return char
      }
      seenLetters += 1
      return randomLetter(char)
    })
    .join('')
}
