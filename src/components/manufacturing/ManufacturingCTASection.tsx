import { manufacturingCta } from '../../data/manufacturing/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function ManufacturingCTASection() {
  const { eyebrow, heading, description, buttonLabel, buttonHref, email, emailHref } =
    manufacturingCta

  return (
    <section className="mfg-cta-section">
      <div className="container">
        <FadeIn id="mfg-cta-card" className="mfg-cta-card">
          <p className="mfg-cta-eyebrow">{eyebrow}</p>
          <h2 className="mfg-cta-heading">{heading}</h2>
          <p className="mfg-cta-description">{description}</p>
          <div className="mfg-cta-actions">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
            <a href={emailHref} className="mfg-cta-email">
              {email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
