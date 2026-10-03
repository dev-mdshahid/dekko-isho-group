import { complianceSustainabilityImprovement } from '../../data/compliance-sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ComplianceImprovementSection() {
  const { badge, title, items } = complianceSustainabilityImprovement

  return (
    <section className="cs-improvement-section">
      <div className="cs-improvement-container">
        <div className="cs-improvement-layout">
          <FadeIn
            id="cs-improvement-header"
            className="cs-improvement-header"
            variant="slide-in-bottom"
          >
            <PreSectionTitle title={badge} />
            <h2 className="cs-improvement-title">{title}</h2>
          </FadeIn>

          <div className="cs-improvement-list" data-solution-animate-group>
            {items.map((item, index) => (
              <div
                key={item.id}
                id={`cs-improvement-${item.id}`}
                className={`cs-improvement-item${index === items.length - 1 ? ' last' : ''}`}
                data-solution-animate="card"
              >
                <div className="cs-improvement-number" aria-hidden="true">
                  {item.number}
                </div>
                <div className="cs-improvement-content">
                  <h3 className="cs-improvement-item-title">{item.title}</h3>
                  <p className="cs-improvement-item-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
