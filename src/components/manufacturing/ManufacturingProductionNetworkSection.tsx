import { useRef } from 'react'

import { manufacturingProductionNetwork } from '../../data/manufacturing/content'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingProductionNetworkSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  useHorizontalScroll(scrollRef)

  const { badge, title, description, units } = manufacturingProductionNetwork

  return (
    <section className="service-inner-section mfg-network-section">
      <div className="container">
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
                  <div className="mfg-network-card-media" aria-hidden="true">
                    <img
                      src={unit.image}
                      loading="lazy"
                      alt=""
                      className="mfg-network-card-bg"
                    />
                    <div className="mfg-network-card-shade" />
                  </div>
                  <div className="mfg-network-card-glass">
                    <h3 className="mfg-network-card-title">{unit.title}</h3>

                    <div className="mfg-network-stat">
                      <span className="mfg-network-stat-value">{unit.productionLines}</span>
                      <span className="mfg-network-stat-label">Production lines</span>
                    </div>

                    <div className="mfg-network-stat">
                      <span className="mfg-network-stat-value mfg-network-stat-value--lg">
                        {unit.monthlyCapacity}
                      </span>
                      <span className="mfg-network-stat-label">PCS/month production capacity</span>
                    </div>

                    <div className="mfg-network-stat">
                      <span className="mfg-network-stat-value">{unit.manpower}</span>
                      <span className="mfg-network-stat-label">Manpower</span>
                    </div>

                    <div className="mfg-network-stat mfg-network-stat--products">
                      <span className="mfg-network-stat-value">{unit.products}</span>
                      <span className="mfg-network-stat-label">Products</span>
                    </div>

                    <div className="mfg-network-stat">
                      <span className="mfg-network-stat-value">{unit.higgFfm}</span>
                      <span className="mfg-network-stat-label">HIGG FFM</span>
                    </div>

                    <div className="mfg-network-stat">
                      <span className="mfg-network-stat-value">{unit.rscProgress}</span>
                      <span className="mfg-network-stat-label">RSC progress rate</span>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
