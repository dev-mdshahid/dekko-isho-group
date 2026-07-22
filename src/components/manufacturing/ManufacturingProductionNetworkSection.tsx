import { useRef } from 'react'

import { manufacturingProductionNetwork } from '../../data/manufacturing/content'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingProductionNetworkSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalScroll(scrollRef, { enableWheel: false })

  const { badge, title, description, units } = manufacturingProductionNetwork

  return (
    <section id="mfg-production-network" className="service-inner-section mfg-network-section">
      <div className="mfg-network-main">
        <FadeIn id="mfg-network-header" className="mfg-network-header">
          <PreSectionTitle title={badge} />
          <h2 className="section-title mfg-network-title">{title}</h2>
          <p className="mfg-network-description">{description}</p>
        </FadeIn>

        <div ref={scrollRef} className="mfg-network-scroll">
          <div className="mfg-network-track">
            {units.map((unit, index) => (
              <FadeIn
                key={unit.id}
                id={`mfg-network-${unit.id}`}
                className="mfg-network-card"
                delay={index * 60}
              >
                <img
                  src={unit.image}
                  loading="lazy"
                  alt={unit.imageAlt}
                  width={540}
                  height={640}
                  draggable={false}
                  className="mfg-network-card-image"
                />
                <div className="mfg-network-card-caption">
                  <h3 className="mfg-network-card-title">{unit.title}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
