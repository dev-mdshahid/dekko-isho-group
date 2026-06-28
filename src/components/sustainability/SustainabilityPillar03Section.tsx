import { pillar03 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'

const maxMaterialPercentage = Math.max(...pillar03.materials.map((m) => m.percentage))
const conventionalPercentage = 100 - pillar03.sustainablePercentage

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

        <div className="sustain-materials-layout">
          <FadeIn id="sustain-materials-progress" className="sustain-materials-progress-card">
            <div className="sustain-materials-progress-copy">
              <span className="sustain-materials-progress-value">{pillar03.sustainablePercentage}%</span>
              <p className="sustain-materials-progress-label">{pillar03.sustainableLabel}</p>
            </div>
            <div className="sustain-materials-progress-metrics">
              <div className="sustain-progress-bar">
                <div
                  className="sustain-progress-bar-fill"
                  style={{ width: `${pillar03.sustainablePercentage}%` }}
                />
              </div>
              <div className="sustain-progress-legend">
                <div className="sustain-progress-legend-item sustain-progress-legend-item--primary">
                  <span className="sustain-progress-legend-swatch sustain-progress-legend-swatch--primary" />
                  <span>{pillar03.sustainablePercentage}% Sustainable</span>
                </div>
                <div className="sustain-progress-legend-item sustain-progress-legend-item--muted">
                  <span className="sustain-progress-legend-swatch sustain-progress-legend-swatch--muted" />
                  <span>{conventionalPercentage}% Conventional</span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn id="sustain-materials-chart" delay={80} className="sustain-materials-chart-card">
            <h3 className="sustain-materials-chart-title">{pillar03.materialsChartTitle}</h3>
            <div className="sustain-materials-bars">
              {pillar03.materials.map((material) => (
                <div key={material.id} className="sustain-material-bar-row">
                  <div className="sustain-material-bar-label">{material.name}</div>
                  <div className="sustain-material-bar-track">
                    <div
                      className="sustain-material-bar-fill"
                      style={{ width: `${(material.percentage / maxMaterialPercentage) * 100}%` }}
                    />
                  </div>
                  <div className="sustain-material-bar-value">{material.percentage}%</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <FadeIn id="sustain-pillar03-image" delay={100} className="sustain-materials-hero-wrap">
          <img
            src={pillar03.image}
            loading="lazy"
            alt={pillar03.imageAlt}
            className="sustain-materials-hero-image"
          />
        </FadeIn>

        <FadeIn id="sustain-traceability" delay={120} className="sustain-badges-section">
          <h3 className="sustain-badges-title">{pillar03.traceabilityTitle}</h3>
          <div className="sustain-badges-row">
            {pillar03.traceabilityPlatforms.map((platform) => (
              <span key={platform} className="sustain-platform-badge">
                {platform}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn id="sustain-standards" delay={160} className="sustain-badges-section">
          <h3 className="sustain-badges-title">{pillar03.standardsTitle}</h3>
          <div className="sustain-badges-row">
            {pillar03.standards.map((standard) => (
              <span key={standard} className="sustain-standard-badge">
                {standard}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
