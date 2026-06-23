import { strategyMetrics, strategySection } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'

export function SustainabilityStrategySection() {
  return (
    <section className="sustain-strategy-section section-spacing">
      <div className="container-medium sustain-strategy-container">
        <FadeIn id="sustain-strategy-header" className="sustain-strategy-header">
          <SustainabilityBadge title={strategySection.badge} />
          <h2 className="sustain-section-title sustain-strategy-title">{strategySection.title}</h2>
          <p className="sustain-section-description sustain-strategy-description">
            {strategySection.description}
          </p>
        </FadeIn>

        <div className="sustain-metrics-row">
          {strategyMetrics.map((metric, index) => (
            <FadeIn
              key={metric.id}
              id={`sustain-metric-${metric.id}`}
              className={`sustain-metric-card sustain-metric-card--${metric.id}`}
              delay={index * 60}
            >
              <div className="sustain-metric-card-media">
                <img
                  src={metric.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="sustain-metric-card-bg"
                />
                <div className="sustain-metric-card-body">
                  <div className="sustain-metric-value">{metric.value}</div>
                  <div className="sustain-metric-label">{metric.label}</div>
                </div>
              </div>
              <div className="sustain-metric-card-footer">by 2030</div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
