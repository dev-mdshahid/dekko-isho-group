import { pillar03 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'
import { SustainabilityMaterialsChart } from './SustainabilityMaterialsChart'
import { SustainabilityMaterialsProgressCard } from './SustainabilityMaterialsProgressCard'

const maxMaterialPercentage = Math.max(...pillar03.materials.map((m) => m.percentage))

export function SustainabilityPillar03Section() {
  return (
    <section className="sustain-pillar-section sustain-pillar-section--material">
      <div className="container-medium sustain-pillar03-container">
        <FadeIn id="sustain-pillar03-header" className="sustain-pillar-header">
          <span className="sustain-pillar-number" aria-hidden="true">
            {pillar03.number}
          </span>
          <div className="sustain-pillar-header-content">
            <SustainabilityBadge title={pillar03.badge} />
            <h2 className="sustain-section-title">{pillar03.title}</h2>
            <p className="sustain-section-description">{pillar03.description}</p>
          </div>
        </FadeIn>

        <FadeIn id="sustain-pillar03-image" delay={60} className="sustain-materials-hero-wrap">
          <img
            src={pillar03.image}
            loading="lazy"
            alt={pillar03.imageAlt}
            className="sustain-materials-hero-image"
          />
        </FadeIn>

        <div className="sustain-materials-layout">
          <FadeIn id="sustain-materials-progress" delay={80}>
            <SustainabilityMaterialsProgressCard
              sustainablePercentage={pillar03.sustainablePercentage}
              sustainableLabel={pillar03.sustainableLabel}
            />
          </FadeIn>

          <FadeIn id="sustain-materials-chart" delay={100}>
            <SustainabilityMaterialsChart
              title={pillar03.materialsChartTitle}
              materials={pillar03.materials}
              maxPercentage={maxMaterialPercentage}
            />
          </FadeIn>
        </div>

        <FadeIn id="sustain-traceability" delay={120} className="sustain-badges-section">
          <h3 className="sustain-badges-title">{pillar03.traceabilityTitle}</h3>
          <div className="sustain-badges-row">
            {pillar03.traceabilityLogos.map((logo) => (
              <img
                key={logo.id}
                src={logo.src}
                loading="lazy"
                alt={logo.alt}
                className="sustain-badge-logo"
              />
            ))}
          </div>
        </FadeIn>

        <FadeIn id="sustain-standards" delay={160} className="sustain-badges-section">
          <h3 className="sustain-badges-title">{pillar03.standardsTitle}</h3>
          <div className="sustain-badges-row">
            {pillar03.standardsLogos.map((logo) => (
              <img
                key={logo.id}
                src={logo.src}
                loading="lazy"
                alt={logo.alt}
                className="sustain-badge-logo"
              />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
