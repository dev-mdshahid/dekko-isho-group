import { AwardsLogosGrid } from '../awards/AwardsLogosGrid'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { certificationLogos, type AffiliationLogo } from '../../data/certifications/content'

export type { AffiliationLogo } from '../../data/certifications/content'

type AffiliationsContent = {
  title: string
  description: string
  logos: readonly AffiliationLogo[]
}

type CertificationsSectionProps = {
  variant: 'sustainability' | 'awards'
  title: string
  description: string
  tag?: string
  affiliations?: AffiliationsContent
}

export function CertificationsSection({
  variant,
  title,
  description,
  tag,
  affiliations,
}: CertificationsSectionProps) {
  if (variant === 'awards') {
    return (
      <section className="awards-grid-section">
        <div className="awards-grid-section__bg" aria-hidden="true" />

        <div className="awards-grid-section__inner">
          <header className="awards-grid-section__header">
            {tag ? <PreSectionTitle title={tag} /> : null}
            <h2 className="awards-grid-section__title">{title}</h2>
            <p className="awards-grid-section__description">{description}</p>
          </header>

          <AwardsLogosGrid logos={certificationLogos} />
        </div>
      </section>
    )
  }

  return (
    <section className="sustain-certifications-section" aria-labelledby="sustain-certifications-title">
      <div className="container-medium sustain-certifications-container">
        <FadeIn id="sustain-certifications-header" className="sustain-certifications-header">
          <h2 id="sustain-certifications-title" className="sustain-certifications-title">
            {title}
          </h2>
          <p className="sustain-certifications-description">{description}</p>
        </FadeIn>

        <FadeIn id="sustain-certifications-logos" delay={80}>
          <AwardsLogosGrid logos={certificationLogos} />
        </FadeIn>

        {affiliations ? (
          <>
            <FadeIn id="sustain-affiliations-header" className="sustain-affiliations-header" delay={120}>
              <h2 id="sustain-affiliations-title" className="sustain-affiliations-title">
                {affiliations.title}
              </h2>
              <p className="sustain-affiliations-description">{affiliations.description}</p>
            </FadeIn>

            <FadeIn id="sustain-affiliations-logos" delay={160}>
              <ul className="sustain-affiliations-grid">
                {affiliations.logos.map((logo) => (
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
          </>
        ) : null}
      </div>
    </section>
  )
}
