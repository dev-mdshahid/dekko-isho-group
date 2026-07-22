import { useRef } from 'react'

import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionProductionNetworkUnit = {
  id: string
  title: string
  image: string
  imageAlt: string
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
            {units.map((unit, index) => (
              <FadeIn
                key={unit.id}
                id={`${idPrefix}-network-${unit.id}`}
                className="solution-network-card"
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
                  <h3 className="solution-network-card-title">{unit.title}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
