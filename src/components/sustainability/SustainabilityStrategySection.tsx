import { strategyMetrics, strategySection } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
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
              className="sustain-metric-item"
              delay={index * 60}
            >
              <div className="sustain-metric-value">{metric.value}</div>
              <div className="sustain-metric-label">{metric.label}</div>
              <div className="sustain-metric-deadline">By 2030</div>
            </FadeIn>
          ))}
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
