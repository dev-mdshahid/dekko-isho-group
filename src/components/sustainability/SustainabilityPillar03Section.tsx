import { pillar03 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'

const maxMaterialPercentage = Math.max(...pillar03.materials.map((m) => m.percentage))
const conventionalPercentage = 100 - pillar03.sustainablePercentage

export function SustainabilityPillar03Section() {
  return (
    <section className="sustain-pillar-section sustain-pillar-section--dark">
      <div className="container-medium">
        <FadeIn id="sustain-pillar03-header" className="sustain-pillar-header">
          <span className="sustain-pillar-number sustain-pillar-number--dark" aria-hidden="true">
            {pillar03.number}
          </span>
          <div className="sustain-pillar-header-content">
            <SustainabilityBadge title={pillar03.badge} variant="dark" />
            <h2 className="sustain-section-title text-white">{pillar03.title}</h2>
            <p className="sustain-section-description sustain-section-description--dark">
              {pillar03.description}
            </p>
          </div>
        </FadeIn>

        <div className="sustain-materials-layout">
          <FadeIn id="sustain-materials-progress" className="sustain-materials-progress-card">
            <div className="sustain-materials-progress-header">
              <span className="sustain-materials-progress-value">{pillar03.sustainablePercentage}%</span>
              <span className="sustain-materials-progress-label">{pillar03.sustainableLabel}</span>
            </div>
            <div className="sustain-progress-bar">
              <div
                className="sustain-progress-bar-fill"
                style={{ width: `${pillar03.sustainablePercentage}%` }}
              />
            </div>
            <div className="sustain-progress-legend">
              <div className="sustain-progress-legend-item">
                <span className="sustain-progress-legend-swatch sustain-progress-legend-swatch--primary" />
                <span>{pillar03.sustainablePercentage}% Sustainable</span>
              </div>
              <div className="sustain-progress-legend-item">
                <span className="sustain-progress-legend-swatch sustain-progress-legend-swatch--muted" />
                <span>{conventionalPercentage}% Conventional</span>
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
