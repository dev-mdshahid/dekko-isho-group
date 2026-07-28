import { complianceSustainabilityRisk } from '../../data/compliance-sustainability/content'
import { FadeIn } from '../ui/FadeIn'

export function ComplianceRiskSection() {
  const { title, items } = complianceSustainabilityRisk

  return (
    <section className="cs-risk-section">
      <div className="cs-risk-glow" aria-hidden="true" />
      <div className="cs-risk-container">
        <FadeIn
          id="cs-risk-header"
          className="cs-risk-header"
          variant="slide-in-bottom"
        >
          <h2 className="cs-risk-title">{title}</h2>
        </FadeIn>

        <div className="cs-risk-grid" data-solution-animate-group>
          {items.map((item) => (
            <div
              key={item.id}
              id={`cs-risk-${item.id}`}
              className="cs-risk-card"
              data-solution-animate="card"
            >
              <span
                className="cs-risk-card-accent"
                style={{ backgroundColor: item.accent }}
                aria-hidden="true"
              />
              <h3 className="cs-risk-card-title">{item.title}</h3>
              <p className="cs-risk-card-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
