import { useRef } from 'react'

import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionProductionNetworkUnit = {
  id: string
  title: string
  image: string
  imageAlt: string
  monthlyCapacity?: string
  productionLines?: string
}

export type SolutionProductionNetworkContent = {
  id?: string
  badge: string
  title: string
  description: string
  units: SolutionProductionNetworkUnit[]
  /** Override auto layout: 1=featured, 2=grid, 3+=gallery scroll. */
  layout?: 'gallery' | 'featured' | 'grid'
}

type SolutionProductionNetworkSectionProps = {
  idPrefix: string
  content: SolutionProductionNetworkContent
}

function resolveLayout(
  unitCount: number,
  layout?: SolutionProductionNetworkContent['layout'],
): 'gallery' | 'featured' | 'grid' {
  if (layout) return layout
  if (unitCount === 1) return 'featured'
  if (unitCount === 2) return 'grid'
  return 'gallery'
}

export function SolutionProductionNetworkSection({
  idPrefix,
  content,
}: SolutionProductionNetworkSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { id, badge, title, description, units, layout } = content
  const resolvedLayout = resolveLayout(units.length, layout)
  useHorizontalScroll(scrollRef, { enableWheel: false })

  const sectionClassName = [
    'service-inner-section',
    'solution-network-section',
    resolvedLayout === 'featured' ? 'solution-network-section--featured' : '',
    resolvedLayout === 'grid' ? 'solution-network-section--grid' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id ?? `${idPrefix}-production-network`} className={sectionClassName}>
      <div className="solution-network-main">
        <FadeIn id={`${idPrefix}-network-header`} className="solution-network-header">
          <PreSectionTitle title={badge} />
          <h2 className="section-title solution-network-title">{title}</h2>
          <p className="solution-network-description">{description}</p>
        </FadeIn>

        <div ref={scrollRef} className="solution-network-scroll">
          <div className="solution-network-track">
            {units.map((unit, index) => {
              const hasStats = Boolean(unit.monthlyCapacity || unit.productionLines)

              return (
                <FadeIn
                  key={unit.id}
                  id={`${idPrefix}-network-${unit.id}`}
                  className={`solution-network-card${hasStats ? ' solution-network-card--stats' : ''}`}
                  delay={index * 60}
                >
                  <img
                    src={unit.image}
                    loading="lazy"
                    alt={unit.imageAlt}
                    width={540}
                    height={640}
                    draggable={false}
                    className="solution-network-card-image"
                  />
                  <div className="solution-network-card-caption">
                    <div className="solution-network-card-panel">
                      <h3 className="solution-network-card-title">{unit.title}</h3>
                      {hasStats ? (
                        <>
                          <div className="solution-network-card-divider" aria-hidden="true" />
                          <div className="solution-network-card-stats">
                            {unit.monthlyCapacity ? (
                              <div className="solution-network-card-stat">
                                <span className="solution-network-card-stat-label">
                                  Production capacity
                                </span>
                                <p className="solution-network-card-stat-value">
                                  <span className="solution-network-card-stat-number">
                                    {unit.monthlyCapacity}
                                  </span>
                                  <span className="solution-network-card-stat-unit">PCS/month</span>
                                </p>
                              </div>
                            ) : null}
                            {unit.monthlyCapacity && unit.productionLines ? (
                              <div
                                className="solution-network-card-stat-separator"
                                aria-hidden="true"
                              />
                            ) : null}
                            {unit.productionLines ? (
                              <div className="solution-network-card-stat">
                                <span className="solution-network-card-stat-label">
                                  Production lines
                                </span>
                                <p className="solution-network-card-stat-value">
                                  <span className="solution-network-card-stat-number">
                                    {unit.productionLines}
                                  </span>
                                </p>
                              </div>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
