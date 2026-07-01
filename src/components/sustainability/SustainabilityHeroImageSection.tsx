import {
  strategyMetrics,
  strategySection,
  sustainabilityHeroImage,
} from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'

export function SustainabilityHeroImageSection() {
  return (
    <section className="sustain-hero-image-section">
      <div className="sustain-hero-image-content">
        <div className="sustain-hero-image-inner">
          <div className="sustain-hero-image-top">
            <FadeIn id="sustain-hero-image-quote" className="sustain-hero-image-quote-wrap">
              <span className="sustain-hero-image-eyebrow">{sustainabilityHeroImage.strategy}</span>
              <div className="sustain-hero-image-quote-row">
                <span className="sustain-accent-line" aria-hidden="true" />
                <p className="sustain-hero-image-quote">
                  {sustainabilityHeroImage.quoteLines[0]}
                  <br />
                  {sustainabilityHeroImage.quoteLines[1]}
                </p>
              </div>
            </FadeIn>
          </div>

          <div className="sustain-hero-image-middle">
            <FadeIn id="sustain-hero-image-brand" delay={80} className="sustain-hero-image-brand">
              <div className="sustain-hero-image-company">{sustainabilityHeroImage.company}</div>
            </FadeIn>
          </div>

          <FadeIn id="sustain-impact-framework" delay={120} className="sustain-impact-framework">
            <h2 className="sustain-impact-framework-title">
              {strategySection.titlePrefix}{' '}
              <span className="sustain-impact-framework-title-accent">{strategySection.titleHighlight}</span>{' '}
              {strategySection.titleSuffix}
            </h2>
            <p className="sustain-impact-framework-description">{strategySection.description}</p>

            <div className="sustain-impact-metrics">
              {strategyMetrics.map((metric) => (
                <div key={metric.id} className="sustain-impact-metric">
                  <div className="sustain-impact-metric-top">
                    <div className="sustain-impact-metric-value">{metric.value}</div>
                    <div className="sustain-impact-metric-label">{metric.label}</div>
                  </div>
                  <div className="sustain-impact-metric-bar" aria-hidden="true">
                    <span
                      className="sustain-impact-metric-bar-fill"
                      style={{ width: metric.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
