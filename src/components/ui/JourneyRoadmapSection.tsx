import { FadeIn } from './FadeIn'
import { PreSectionTitle } from './PreSectionTitle'

export type JourneyRoadmapStage = {
  id: string
  label: string
  row: 'top' | 'bottom'
  column: number
}

export type JourneyRoadmapSectionProps = {
  id: string
  badge: string
  title: string
  description?: string
  stages: JourneyRoadmapStage[]
  columnCount: number
  classPrefix: string
  /** Left inset for the first node in SVG viewBox units (default 100). */
  xPadLeft?: number
  /** Right inset so the U-turn curve fits (default 100). */
  xPadRight?: number
}

const VB = { w: 1000, h: 280 }
const TOP_Y = 40
const BOTTOM_Y = 200
const CURVE_R = 80
const DEFAULT_X_PAD = 100

function columnCenterX(
  column: number,
  columnCount: number,
  xPadLeft: number,
  xPadRight: number,
) {
  const lastColumn = columnCount - 1
  const usable = VB.w - xPadLeft - xPadRight
  return xPadLeft + (column / lastColumn) * usable
}

function buildPathD(columnCount: number, xPadLeft: number, xPadRight: number) {
  const lastColumn = columnCount - 1
  const x0 = columnCenterX(0, columnCount, xPadLeft, xPadRight)
  const xLast = columnCenterX(lastColumn, columnCount, xPadLeft, xPadRight)
  const x1 = columnCenterX(1, columnCount, xPadLeft, xPadRight)
  const curveX = Math.min(xLast + CURVE_R, VB.w - 4)

  return [
    `M ${x0} ${TOP_Y}`,
    `L ${curveX} ${TOP_Y}`,
    `A ${CURVE_R} ${CURVE_R} 0 0 1 ${curveX} ${BOTTOM_Y}`,
    `L ${x1} ${BOTTOM_Y}`,
  ].join(' ')
}

function nodeStyle(
  column: number,
  row: 'top' | 'bottom',
  columnCount: number,
  xPadLeft: number,
  xPadRight: number,
) {
  const x = columnCenterX(column, columnCount, xPadLeft, xPadRight)
  const y = row === 'top' ? TOP_Y : BOTTOM_Y

  return {
    left: `${(x / VB.w) * 100}%`,
    top: `${(y / VB.h) * 100}%`,
  }
}

export function JourneyRoadmapSection({
  id,
  badge,
  title,
  description,
  stages,
  columnCount,
  classPrefix,
  xPadLeft = DEFAULT_X_PAD,
  xPadRight = DEFAULT_X_PAD,
}: JourneyRoadmapSectionProps) {
  const pathD = buildPathD(columnCount, xPadLeft, xPadRight)

  return (
    <section id={id} className={`${classPrefix}-section`}>
      <div className={`${classPrefix}-container`}>
        <FadeIn id={`${id}-header`} className={`${classPrefix}-header`}>
          <PreSectionTitle title={badge} />
          <h2 className={`${classPrefix}-title`}>{title}</h2>
          {description ? <p className={`${classPrefix}-description`}>{description}</p> : null}
        </FadeIn>

        <FadeIn id={`${id}-roadmap`} className={`${classPrefix}-roadmap`} delay={40}>
          <svg
            className={`${classPrefix}-path`}
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className={`${classPrefix}-nodes`} aria-label={title}>
            {stages.map((stage) => (
              <li
                key={stage.id}
                className={`${classPrefix}-node ${classPrefix}-node--${stage.row}`}
                style={nodeStyle(stage.column, stage.row, columnCount, xPadLeft, xPadRight)}
              >
                <span className={`${classPrefix}-dot`} aria-hidden="true" />
                <span className={`${classPrefix}-label`}>{stage.label}</span>
              </li>
            ))}
          </ol>
        </FadeIn>

        <FadeIn id={`${id}-mobile`} className={`${classPrefix}-mobile`} delay={40}>
          <ol className={`${classPrefix}-mobile-list`} aria-label={title}>
            {stages.map((stage) => (
              <li key={stage.id} className={`${classPrefix}-mobile-item`}>
                <span className={`${classPrefix}-dot`} aria-hidden="true" />
                <span className={`${classPrefix}-label`}>{stage.label}</span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  )
}
