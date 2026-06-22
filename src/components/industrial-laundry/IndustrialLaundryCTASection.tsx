import { industrialLaundryCta } from '../../data/industrial-laundry/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function IndustrialLaundryCTASection() {
  const { eyebrow, heading, description, buttonLabel, buttonHref, email, emailHref } =
    industrialLaundryCta

  return (
    <section className="il-cta-section">
      <div className="container">
        <FadeIn id="il-cta-card" className="il-cta-card">
          <p className="il-cta-eyebrow">{eyebrow}</p>
          <h2 className="il-cta-heading">{heading}</h2>
          <p className="il-cta-description">{description}</p>
          <div className="il-cta-actions">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
            <a href={emailHref} className="il-cta-email">
              {email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
