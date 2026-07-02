import { designProductDevelopmentCta } from '../../data/design-product-development/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function DesignCTASection() {
  const { eyebrow, heading, description, buttonLabel, buttonHref, email, emailHref } =
    designProductDevelopmentCta

  return (
    <section className="dpd-cta-section">
      <div className="container">
        <FadeIn id="dpd-cta-card" className="dpd-cta-card">
          <p className="dpd-cta-eyebrow">{eyebrow}</p>
          <h2 className="dpd-cta-heading">{heading}</h2>
          <p className="dpd-cta-description">{description}</p>
          <div className="dpd-cta-actions">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
            <a href={emailHref} className="dpd-cta-email">
              {email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
