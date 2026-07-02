import { technologyIntegrationUnified } from '../../data/technology-integration/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function TechnologyUnifiedSection() {
  const { badge, title, description, items } = technologyIntegrationUnified

  return (
    <section className="ti-unified-section">
      <div className="ti-unified-glow" aria-hidden="true" />
      <div className="ti-unified-container">
        <FadeIn id="ti-unified-header" className="ti-unified-header">
          <PreSectionTitle title={badge} variant="bg-dark" />
          <h2 className="ti-unified-title">{title}</h2>
          <p className="ti-unified-description">{description}</p>
        </FadeIn>

        <div className="ti-unified-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`ti-unified-${item.id}`}
              className="ti-unified-card"
              delay={index * 50}
            >
              <span
                className="ti-unified-card-accent"
                style={{ backgroundColor: item.accent }}
                aria-hidden="true"
              />
              <span className="ti-unified-card-number" style={{ color: item.accent }}>
                {item.number}
              </span>
              <h3 className="ti-unified-card-title">{item.title}</h3>
              <p className="ti-unified-card-description">{item.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
