import { useRef } from 'react'

import { useJourneyRoadmapAnimation } from '../../hooks/useJourneyRoadmapAnimation'
import { FadeIn } from './FadeIn'
import { PreSectionTitle } from './PreSectionTitle'

export type JourneyRoadmapStage = {
  id: string
  label: string
  row: 'top' | 'bottom'
  column: number
  /** Optional step icon (shown below the timeline node). */
  icon?: string
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
  /** Distance past the last column where the U-turn starts, in viewBox units (default 80). */
  curveOffset?: number
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

function buildPathD(
  columnCount: number,
  xPadLeft: number,
  xPadRight: number,
  curveOffset: number,
) {
  const lastColumn = columnCount - 1
  const x0 = columnCenterX(0, columnCount, xPadLeft, xPadRight)
  const xLast = columnCenterX(lastColumn, columnCount, xPadLeft, xPadRight)
  const x1 = columnCenterX(1, columnCount, xPadLeft, xPadRight)
  const curveX = Math.min(xLast + curveOffset, VB.w - 4)

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
  curveOffset = CURVE_R,
}: JourneyRoadmapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const pathD = buildPathD(columnCount, xPadLeft, xPadRight, curveOffset)

  useJourneyRoadmapAnimation(sectionRef)

  return (
    <section id={id} ref={sectionRef} className={`${classPrefix}-section`}>
      <div className={`${classPrefix}-container`}>
        <FadeIn id={`${id}-header`} className={`${classPrefix}-header`}>
          <PreSectionTitle title={badge} />
          <h2 className={`${classPrefix}-title`}>{title}</h2>
          {description ? <p className={`${classPrefix}-description`}>{description}</p> : null}
        </FadeIn>

        <div className={`${classPrefix}-roadmap`} data-journey-roadmap>
          <svg
            className={`${classPrefix}-path`}
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <mask id={`${id}-path-mask`} maskUnits="userSpaceOnUse">
                <path
                  data-journey-path-mask
                  d={pathD}
                  pathLength={1}
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </mask>
            </defs>
            {/* Ghost route — shows the full journey faintly before ink draws. */}
            <path
              data-journey-path-ghost
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0"
            />
            <path
              data-journey-path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="8 10"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              mask={`url(#${id}-path-mask)`}
            />
          </svg>

          <ol className={`${classPrefix}-nodes`} aria-label={title}>
            {stages.map((stage, index) => (
              <li
                key={stage.id}
                className={`${classPrefix}-node ${classPrefix}-node--${stage.row}`}
                style={nodeStyle(stage.column, stage.row, columnCount, xPadLeft, xPadRight)}
                data-journey-node
                data-journey-step={index}
                data-journey-row={stage.row}
                data-journey-column={stage.column}
              >
                <span className={`${classPrefix}-dot`} data-journey-dot aria-hidden="true" />
                {stage.icon ? (
                  <img
                    className={`${classPrefix}-icon`}
                    src={stage.icon}
                    alt=""
                    width={64}
                    height={64}
                    data-journey-icon
                    aria-hidden="true"
                  />
                ) : null}
                <span className={`${classPrefix}-label`} data-journey-label>
                  {stage.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`${classPrefix}-mobile`} data-journey-mobile>
          <ol className={`${classPrefix}-mobile-list`} aria-label={title}>
            {stages.map((stage, index) => (
              <li
                key={stage.id}
                className={`${classPrefix}-mobile-item`}
                data-journey-mobile-item
                data-journey-step={index}
                data-journey-row={stage.row}
              >
                <span
                  className={`${classPrefix}-dot`}
                  data-journey-mobile-dot
                  aria-hidden="true"
                />
                {stage.icon ? (
                  <img
                    className={`${classPrefix}-icon`}
                    src={stage.icon}
                    alt=""
                    width={64}
                    height={64}
                    data-journey-mobile-icon
                    aria-hidden="true"
                  />
                ) : null}
                <span className={`${classPrefix}-label`} data-journey-mobile-label>
                  {stage.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
