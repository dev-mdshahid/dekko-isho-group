import { AwardsLogosGrid } from '../awards/AwardsLogosGrid'
import { certificationLogos, certifications, externalAffiliations } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'

export function SustainabilityCertificationsSection() {
  return (
    <section className="sustain-certifications-section" aria-labelledby="sustain-certifications-title">
      <div className="container-medium sustain-certifications-container">
        <FadeIn id="sustain-certifications-header" className="sustain-certifications-header">
          <h2 id="sustain-certifications-title" className="sustain-certifications-title">
            {certifications.title}
          </h2>
          <p className="sustain-certifications-description">{certifications.description}</p>
        </FadeIn>

        <FadeIn id="sustain-certifications-logos" delay={80}>
          <AwardsLogosGrid logos={certificationLogos} />
        </FadeIn>

        <FadeIn id="sustain-affiliations-header" className="sustain-affiliations-header" delay={120}>
          <h2 id="sustain-affiliations-title" className="sustain-affiliations-title">
            {externalAffiliations.title}
          </h2>
          <p className="sustain-affiliations-description">{externalAffiliations.description}</p>
        </FadeIn>

        <FadeIn id="sustain-affiliations-logos" delay={160}>
          <ul className="sustain-affiliations-grid">
            {externalAffiliations.logos.map((logo) => (
              <li key={logo.id} className="sustain-affiliations-item">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="sustain-affiliations-image"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  )
}
