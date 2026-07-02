import { designProductDevelopmentTeam } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'

export function DesignTeamSection() {
  const { id, title, description, features } = designProductDevelopmentTeam

  return (
    <section id={id} className="service-more-info section-spacing dpd-team-section">
      <div className="container">
        <div className="more-info-inner dpd-team-inner">
          <div className="dpd-team-block">
            <FadeIn id="dpd-team-title" className="dpd-team-title-wrap">
              <h2 className="section-title dpd-team-title">{title}</h2>
            </FadeIn>

            <FadeIn id="dpd-team-copy" className="dpd-team-copy" delay={60}>
              <p className="dpd-team-description">{description}</p>
            </FadeIn>
          </div>

          <div className="service-feature-info dpd-feature-info">
            <div className="w-layout-grid grid-feature dpd-feature-grid">
              {features.map((feature, index) => (
                <FadeIn
                  key={feature.id}
                  id={`dpd-team-feature-${feature.id}`}
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
