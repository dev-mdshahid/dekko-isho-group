import { designProductDevelopmentJourney } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

const COLUMNS = 5

/** SVG viewBox — node centers sit on the dashed path. */
const VB = { w: 1000, h: 280 }
const TOP_Y = 40
const BOTTOM_Y = 200
const CURVE_R = 80
const X_PAD = 100

function columnCenterX(column: number) {
  return X_PAD + (column / (COLUMNS - 1)) * (VB.w - X_PAD * 2)
}

function buildPathD() {
  const x0 = columnCenterX(0)
  const x4 = columnCenterX(4)
  const x1 = columnCenterX(1)
  const curveX = x4 + CURVE_R

  return [
    `M ${x0} ${TOP_Y}`,
    `L ${curveX} ${TOP_Y}`,
    `A ${CURVE_R} ${CURVE_R} 0 0 1 ${curveX} ${BOTTOM_Y}`,
    `L ${x1} ${BOTTOM_Y}`,
  ].join(' ')
}

function nodeStyle(column: number, row: 'top' | 'bottom') {
  const x = columnCenterX(column)
  const y = row === 'top' ? TOP_Y : BOTTOM_Y
  return {
    left: `${(x / VB.w) * 100}%`,
    top: `${(y / VB.h) * 100}%`,
  }
}

export function DesignJourneySection() {
  const { id, badge, title, stages } = designProductDevelopmentJourney
  const pathD = buildPathD()

  return (
    <section id={id} className="dpd-journey-section">
      <div className="dpd-journey-container">
        <FadeIn id="dpd-journey-header" className="dpd-journey-header">
          <PreSectionTitle title={badge} />
          <h2 className="dpd-journey-title">{title}</h2>
        </FadeIn>

        <FadeIn id="dpd-journey-roadmap" className="dpd-journey-roadmap" delay={40}>
          <svg
            className="dpd-journey-path"
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

          <ol className="dpd-journey-nodes" aria-label={title}>
            {stages.map((stage) => (
              <li
                key={stage.id}
                className={`dpd-journey-node dpd-journey-node--${stage.row}`}
                style={nodeStyle(stage.column, stage.row)}
              >
                <span className="dpd-journey-dot" aria-hidden="true" />
                <span className="dpd-journey-label">{stage.label}</span>
              </li>
            ))}
          </ol>
        </FadeIn>

        <FadeIn id="dpd-journey-mobile" className="dpd-journey-mobile" delay={40}>
          <ol className="dpd-journey-mobile-list" aria-label={title}>
            {stages.map((stage) => (
              <li key={stage.id} className="dpd-journey-mobile-item">
                <span className="dpd-journey-dot" aria-hidden="true" />
                <span className="dpd-journey-label">{stage.label}</span>
              </li>
            ))}
          </ol>
        </FadeIn>
      </div>
    </section>
  )
}
