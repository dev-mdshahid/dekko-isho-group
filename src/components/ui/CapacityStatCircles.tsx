import type { CSSProperties } from 'react'

export type CapacityStatVariant = 'blue' | 'sky' | 'navy' | 'white' | 'pink' | 'dark'

export type CapacityStat = {
  id: string
  value: string
  label: string
  variant: CapacityStatVariant
}

export type CapacityStatLayout = {
  x: number
  y: number
  z?: number
}

type CapacityStatCirclesProps = {
  stats: CapacityStat[]
  /** Absolute grid positions keyed by stat id. Defaults to a 3+2 touching grid. */
  layout?: Record<string, CapacityStatLayout>
  className?: string
  style?: CSSProperties
}

const DEFAULT_GRID_LAYOUT: Record<string, CapacityStatLayout> = {
  machining: { x: 0, y: 0, z: 1 },
  production: { x: 0, y: 0, z: 1 },
  'total-capacity': { x: 0, y: 0, z: 2 },
  'woven-tops': { x: 1, y: 0, z: 1 },
  'woven-bottoms': { x: 1, y: 1, z: 1 },
  units: { x: 0, y: 1, z: 1 },
  workforce: { x: 1, y: 1, z: 1 },
}

/** Parse countable values like "3.5 Million", "71%", "800+", "28". Returns null for complex labels. */
export function parseCapacityCountValue(value: string): {
  target: number
  decimals: number
  suffix: string
} | null {
  const trimmed = value.trim()
  const match = trimmed.match(/^([\d,]+(?:\.\d+)?)\s*(Million|M|%|\+)?$/i)
  if (!match) return null

  const numStr = match[1].replace(/,/g, '')
  const target = Number(numStr)
  if (!Number.isFinite(target)) return null

  const decimals = numStr.includes('.') ? (numStr.split('.')[1]?.length ?? 0) : 0
  const rawSuffix = match[2]
  let suffix = ''
  if (rawSuffix) {
    if (/^million$/i.test(rawSuffix)) suffix = ' Million'
    else if (/^m$/i.test(rawSuffix)) suffix = ' M'
    else suffix = rawSuffix
  }

  return { target, decimals, suffix }
}

function resolveLayout(
  stats: CapacityStat[],
  layout?: Record<string, CapacityStatLayout>,
): Record<string, CapacityStatLayout> {
  if (layout) return layout

  const hasDefaultIds = stats.every((stat) => stat.id in DEFAULT_GRID_LAYOUT)
  if (hasDefaultIds) return DEFAULT_GRID_LAYOUT

  // Generic 3-column grid fallback for arbitrary stat lists.
  return Object.fromEntries(
    stats.map((stat, index) => [
      stat.id,
      {
        x: index % 3,
        y: Math.floor(index / 3),
        z: 1,
      },
    ]),
  )
}

export function CapacityStatCircles({
  stats,
  layout,
  className,
  style,
}: CapacityStatCirclesProps) {
  const resolvedLayout = resolveLayout(stats, layout)
  const maxX = Math.max(...stats.map((stat) => resolvedLayout[stat.id]?.x ?? 0), 0)
  const maxY = Math.max(...stats.map((stat) => resolvedLayout[stat.id]?.y ?? 0), 0)

  const clusterStyle = {
    ...style,
    '--capacity-cols': String(maxX + 1),
    '--capacity-rows': String(maxY + 1),
  } as CSSProperties

  return (
    <div
      className={['capacity-stat-circles', className].filter(Boolean).join(' ')}
      style={clusterStyle}
    >
      {stats.map((stat) => {
        const position = resolvedLayout[stat.id] ?? { x: 0, y: 0, z: 1 }
        const counted = parseCapacityCountValue(stat.value)

        return (
          <div
            key={stat.id}
            className={`capacity-stat-circle capacity-stat-circle--${stat.variant}`}
            style={
              {
                '--circle-x': String(position.x),
                '--circle-y': String(position.y),
                zIndex: position.z ?? 1,
              } as CSSProperties
            }
          >
            <div className="capacity-stat-circle-inner">
              <div className="capacity-stat-value">
                {counted ? (
                  <span
                    className="count"
                    data-target={String(counted.target)}
                    data-decimals={counted.decimals > 0 ? String(counted.decimals) : undefined}
                    data-suffix={counted.suffix || undefined}
                  >
                    {stat.value}
                  </span>
                ) : (
                  stat.value
                )}
              </div>
              <div className="capacity-stat-label">{stat.label}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
