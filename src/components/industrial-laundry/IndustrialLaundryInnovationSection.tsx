import { industrialLaundryInnovation } from '../../data/industrial-laundry/content'
import { FadeIn } from '../ui/FadeIn'

export function IndustrialLaundryInnovationSection() {
  const { id, title, description, features } = industrialLaundryInnovation

  return (
    <section id={id} className="service-more-info section-spacing il-innovation-section">
      <div className="container">
        <div className="more-info-inner il-innovation-inner">
          <div className="il-innovation-block">
            <FadeIn id="il-innovation-title" className="il-innovation-title-wrap">
              <h2 className="section-title il-innovation-title">{title}</h2>
            </FadeIn>

            <FadeIn id="il-innovation-copy" className="il-innovation-copy" delay={60}>
              <p className="il-innovation-description">{description}</p>
            </FadeIn>
          </div>

          <div className="service-feature-info il-feature-info">
            <div className="w-layout-grid grid-feature il-feature-grid">
              {features.map((feature, index) => (
                <FadeIn
                  key={feature.id}
                  id={`il-feature-${feature.id}`}
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
