import { technologyIntegrationCta } from '../../data/technology-integration/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function TechnologyCTASection() {
  const { eyebrow, heading, description, buttonLabel, buttonHref, email, emailHref } =
    technologyIntegrationCta

  return (
    <section className="ti-cta-section">
      <div className="container">
        <FadeIn id="ti-cta-card" className="ti-cta-card">
          <p className="ti-cta-eyebrow">{eyebrow}</p>
          <h2 className="ti-cta-heading">{heading}</h2>
          <p className="ti-cta-description">{description}</p>
          <div className="ti-cta-actions">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
            <a href={emailHref} className="ti-cta-email">
              {email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
