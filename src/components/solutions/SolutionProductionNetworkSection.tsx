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
}

type SolutionProductionNetworkSectionProps = {
  idPrefix: string
  content: SolutionProductionNetworkContent
}

export function SolutionProductionNetworkSection({
  idPrefix,
  content,
}: SolutionProductionNetworkSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalScroll(scrollRef, { enableWheel: false })

  const { id, badge, title, description, units } = content
  const isFeatured = units.length === 1
  const sectionClassName = [
    'service-inner-section',
    'solution-network-section',
    isFeatured ? 'solution-network-section--featured' : '',
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
