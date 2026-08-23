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

type RoadmapPoint = {
  x: number
  y: number
}

type RoadmapConnector = {
  id: string
  d: string
  isTurn: boolean
}

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

function orderDesktopStages(stages: JourneyRoadmapStage[]) {
  const top = stages
    .filter((stage) => stage.row !== 'bottom')
    .sort((a, b) => a.column - b.column)
  const bottom = stages
    .filter((stage) => stage.row === 'bottom')
    .sort((a, b) => b.column - a.column)

  return [...top, ...bottom]
}

function stagePoint(
  stage: JourneyRoadmapStage,
  columnCount: number,
  xPadLeft: number,
  xPadRight: number,
): RoadmapPoint {
  return {
    x: columnCenterX(stage.column, columnCount, xPadLeft, xPadRight),
    y: stage.row === 'top' ? TOP_Y : BOTTOM_Y,
  }
}

function buildConnectorD(
  from: JourneyRoadmapStage,
  to: JourneyRoadmapStage,
  columnCount: number,
  xPadLeft: number,
  xPadRight: number,
  curveOffset: number,
) {
  const start = stagePoint(from, columnCount, xPadLeft, xPadRight)
  const end = stagePoint(to, columnCount, xPadLeft, xPadRight)

  if (from.row === 'top' && to.row === 'bottom') {
    const curveX = Math.min(Math.max(start.x, end.x) + curveOffset, VB.w - 4)

    return [
      `M ${start.x} ${start.y}`,
      `L ${curveX} ${start.y}`,
      `A ${CURVE_R} ${CURVE_R} 0 0 1 ${curveX} ${end.y}`,
      `L ${end.x} ${end.y}`,
    ].join(' ')
  }

  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`
}

function buildConnectors(
  stages: JourneyRoadmapStage[],
  columnCount: number,
  xPadLeft: number,
  xPadRight: number,
  curveOffset: number,
): RoadmapConnector[] {
  const orderedStages = orderDesktopStages(stages)

  return orderedStages.slice(0, -1).map((stage, index) => {
    const nextStage = orderedStages[index + 1]
    const isTurn = stage.row === 'top' && nextStage.row === 'bottom'

    return {
      id: `${stage.id}-to-${nextStage.id}`,
      d: buildConnectorD(stage, nextStage, columnCount, xPadLeft, xPadRight, curveOffset),
      isTurn,
    }
  })
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
  const connectors = buildConnectors(stages, columnCount, xPadLeft, xPadRight, curveOffset)

  useJourneyRoadmapAnimation(sectionRef)

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`journey-roadmap-section ${classPrefix}-section`}
    >
      <div className={`journey-roadmap-container ${classPrefix}-container`}>
        <FadeIn id={`${id}-header`} className={`journey-roadmap-header ${classPrefix}-header`}>
          <PreSectionTitle title={badge} />
          <h2 className={`journey-roadmap-title ${classPrefix}-title`}>{title}</h2>
          {description ? (
            <p className={`journey-roadmap-description ${classPrefix}-description`}>
              {description}
            </p>
          ) : null}
        </FadeIn>

        <div className={`journey-roadmap-roadmap ${classPrefix}-roadmap`} data-journey-roadmap>
          <svg
            className={`journey-roadmap-path ${classPrefix}-path`}
            viewBox={`0 0 ${VB.w} ${VB.h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {connectors.map((connector) => (
                <mask
                  key={`${connector.id}-mask`}
                  id={`${id}-${connector.id}-mask`}
                  maskUnits="userSpaceOnUse"
                >
                  <path
                    data-journey-path-mask
                    d={connector.d}
                    pathLength={1}
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </mask>
              ))}
            </defs>
            {connectors.map((connector) => (
              <path
                key={connector.id}
                data-journey-path
                data-journey-turn={connector.isTurn ? 'true' : undefined}
                d={connector.d}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="8 10"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                mask={`url(#${id}-${connector.id}-mask)`}
              />
            ))}
          </svg>

          <ol
            className={`journey-roadmap-nodes ${classPrefix}-nodes`}
            aria-label={title}
          >
            {stages.map((stage, index) => (
              <li
                key={stage.id}
                className={[
                  'journey-roadmap-node',
                  `journey-roadmap-node--${stage.row}`,
                  `${classPrefix}-node`,
                  `${classPrefix}-node--${stage.row}`,
                ].join(' ')}
                style={nodeStyle(stage.column, stage.row, columnCount, xPadLeft, xPadRight)}
                data-journey-node
                data-journey-step={index}
                data-journey-row={stage.row}
                data-journey-column={stage.column}
              >
                <span
                  className={`journey-roadmap-dot ${classPrefix}-dot`}
                  data-journey-dot
                  aria-hidden="true"
                />
                {stage.icon ? (
                  <img
                    className={`journey-roadmap-icon ${classPrefix}-icon`}
                    src={stage.icon}
                    alt=""
                    width={64}
                    height={64}
                    data-journey-icon
                    aria-hidden="true"
                  />
                ) : null}
                <span className={`journey-roadmap-label ${classPrefix}-label`} data-journey-label>
                  {stage.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className={`journey-roadmap-mobile ${classPrefix}-mobile`} data-journey-mobile>
          <ol
            className={`journey-roadmap-mobile-list ${classPrefix}-mobile-list`}
            aria-label={title}
          >
            {stages.map((stage, index) => (
              <li
                key={stage.id}
                className={`journey-roadmap-mobile-item ${classPrefix}-mobile-item`}
                data-journey-mobile-item
                data-journey-step={index}
                data-journey-row={stage.row}
              >
                <span
                  className={`journey-roadmap-dot ${classPrefix}-dot`}
                  data-journey-mobile-dot
                  aria-hidden="true"
                />
                {stage.icon ? (
                  <img
                    className={`journey-roadmap-icon ${classPrefix}-icon`}
                    src={stage.icon}
                    alt=""
                    width={64}
                    height={64}
                    data-journey-mobile-icon
                    aria-hidden="true"
                  />
                ) : null}
                <span
                  className={`journey-roadmap-label ${classPrefix}-label`}
                  data-journey-mobile-label
                >
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
