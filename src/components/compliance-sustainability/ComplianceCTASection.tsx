import { complianceSustainabilityCta } from '../../data/compliance-sustainability/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function ComplianceCTASection() {
  const { eyebrow, heading, description, buttonLabel, buttonHref, email, emailHref } =
    complianceSustainabilityCta

  return (
    <section className="cs-cta-section">
      <div className="container">
        <FadeIn id="cs-cta-card" className="cs-cta-card">
          <p className="cs-cta-eyebrow">{eyebrow}</p>
          <h2 className="cs-cta-heading">{heading}</h2>
          <p className="cs-cta-description">{description}</p>
          <div className="cs-cta-actions">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
            <a href={emailHref} className="cs-cta-email">
              {email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
