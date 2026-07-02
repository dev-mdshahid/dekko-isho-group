import { technologyIntegrationIntro } from '../../data/technology-integration/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function TechnologyIntroSection() {
  const { id, badge, title, description, features } = technologyIntegrationIntro

  return (
    <section id={id} className="service-more-info section-spacing ti-intro-section">
      <div className="container">
        <div className="more-info-inner ti-intro-inner">
          <div className="ti-intro-block">
            <FadeIn id="ti-intro-badge" className="ti-intro-badge">
              <PreSectionTitle title={badge} />
            </FadeIn>

            <FadeIn id="ti-intro-title" className="ti-intro-title-wrap">
              <h2 className="section-title ti-intro-title">{title}</h2>
            </FadeIn>

            <FadeIn id="ti-intro-copy" className="ti-intro-copy" delay={60}>
              <p className="ti-intro-description">{description}</p>
            </FadeIn>
          </div>

          <div className="service-feature-info ti-feature-info">
            <div className="w-layout-grid grid-feature ti-feature-grid">
              {features.map((feature, index) => (
                <FadeIn
                  key={feature.id}
                  id={`ti-feature-${feature.id}`}
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
