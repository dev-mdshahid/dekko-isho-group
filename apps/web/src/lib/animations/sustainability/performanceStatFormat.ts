export type ParsedPerformanceStat = {
  target: number
  decimals: number
  suffix: string
}

export function parsePerformanceStat(value: string): ParsedPerformanceStat {
  const trimmed = value.trim()

  if (trimmed.endsWith('%')) {
    const numeric = trimmed.slice(0, -1)
    const decimals = numeric.includes('.') ? numeric.split('.')[1]?.length ?? 0 : 0

    return {
      target: Number.parseFloat(numeric) || 0,
      decimals,
      suffix: '%',
    }
  }

  const normalized = trimmed.replace(/,/g, '')
  const decimals = normalized.includes('.') ? normalized.split('.')[1]?.length ?? 0 : 0

  return {
    target: Number.parseFloat(normalized) || 0,
    decimals,
    suffix: '',
  }
}

export function formatPerformanceStatValue(
  value: number,
  { decimals, suffix }: Pick<ParsedPerformanceStat, 'decimals' | 'suffix'>,
) {
  const formatted =
    decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()

  return `${formatted}${suffix}`
}

export function performanceStatDuration(target: number) {
  if (target <= 100) {
    return Math.max(1.5, Math.min(3, 1.2 + (target / 100) * 1.5))
  }

  return Math.max(1.8, Math.min(3.2, 1.5 + Math.log10(Math.max(target, 1)) * 0.65))
}
