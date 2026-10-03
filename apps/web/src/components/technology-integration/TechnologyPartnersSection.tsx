import { technologyIntegrationPartners } from '../../data/technology-integration/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function TechnologyPartnersSection() {
  const { badge, title, description, partners } = technologyIntegrationPartners

  return (
    <section className="ti-partners-section">
      <div className="ti-partners-glow" aria-hidden="true" />
      <div className="ti-partners-container">
        <FadeIn
          id="ti-partners-header"
          className="ti-partners-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} variant="bg-dark" />
          <h2 className="ti-partners-title">{title}</h2>
          <p className="ti-partners-description">{description}</p>
        </FadeIn>

        <div className="ti-partners-grid" data-solution-animate-group>
          {partners.map((partner) => (
            <div
              key={partner.id}
              id={`ti-partner-${partner.id}`}
              className="ti-partner-card"
              data-solution-animate="card"
            >
              <div className="ti-partner-logo">
                <img
                  src={partner.logo}
                  loading="lazy"
                  alt={partner.name}
                  className="ti-partner-logo-image"
                />
              </div>
              <div className="ti-partner-content">
                <h3 className="ti-partner-name">{partner.name}</h3>
                <p className="ti-partner-description">{partner.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
