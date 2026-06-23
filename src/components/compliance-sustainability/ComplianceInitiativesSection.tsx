import { complianceSustainabilityInitiatives } from '../../data/compliance-sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ComplianceInitiativesSection() {
  const { id, badge, title, description, features } = complianceSustainabilityInitiatives

  return (
    <section id={id} className="service-more-info section-spacing cs-initiatives-section">
      <div className="container">
        <div className="more-info-inner cs-initiatives-inner">
          <div className="cs-initiatives-block">
            <FadeIn id="cs-initiatives-badge" className="cs-initiatives-badge">
              <PreSectionTitle title={badge} />
            </FadeIn>

            <FadeIn id="cs-initiatives-title" className="cs-initiatives-title-wrap">
              <h2 className="section-title cs-initiatives-title">{title}</h2>
            </FadeIn>

            <FadeIn id="cs-initiatives-copy" className="cs-initiatives-copy" delay={60}>
              <p className="cs-initiatives-description">{description}</p>
            </FadeIn>
          </div>

          <div className="service-feature-info cs-feature-info">
            <div className="w-layout-grid grid-feature cs-feature-grid">
              {features.map((feature, index) => (
                <FadeIn
                  key={feature.id}
                  id={`cs-feature-${feature.id}`}
                  className="feature-main"
                  delay={index * 60}
                >
                  <div className="feature-icon-wrap">
                    <img src={feature.icon} loading="lazy" alt="" className="feature-icon" />
                  </div>
                  <h2 className="feature-name">{feature.title}</h2>
                  <p className="feature-description">{feature.description}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
