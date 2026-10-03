import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import {
  globusGarmentsResponsibilityIntro,
  globusGarmentsResponsibilityItems,
} from '../data/industry/globusGarmentsResponsibility'

export function GlobusGarmentsResponsibilitySection() {
  return (
    <section className="globus-garments-responsibility">
      <div className="globus-garments-responsibility-container">
        <div className="globus-garments-responsibility-layout">
          <FadeIn id="globus-garments-responsibility-media" className="globus-garments-responsibility-media">
            <img
              src={globusGarmentsResponsibilityIntro.imageSrc}
              loading="lazy"
              alt={globusGarmentsResponsibilityIntro.imageAlt}
              className="globus-garments-responsibility-image"
            />
          </FadeIn>

          <div className="globus-garments-responsibility-content">
            <FadeIn id="globus-garments-responsibility-header" className="globus-garments-responsibility-header">
              <PreSectionTitle title={globusGarmentsResponsibilityIntro.badge} />
              <h2 className="globus-garments-responsibility-title">
                {globusGarmentsResponsibilityIntro.title}
              </h2>
              <p className="globus-garments-responsibility-description">
                {globusGarmentsResponsibilityIntro.description}
              </p>
            </FadeIn>

            <div className="globus-garments-responsibility-grid">
              {globusGarmentsResponsibilityItems.map((item, index) => (
                <FadeIn
                  key={item.id}
                  id={`globus-garments-responsibility-${item.id}`}
                  className="globus-garments-responsibility-card"
                  delay={index * 50}
                >
                  <div className="globus-garments-responsibility-card-icon" aria-hidden="true">
                    {item.icon}
                  </div>
                  <h3 className="globus-garments-responsibility-card-title">{item.title}</h3>
                  <p className="globus-garments-responsibility-card-description">{item.description}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
