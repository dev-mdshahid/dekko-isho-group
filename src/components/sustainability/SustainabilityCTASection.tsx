import { sustainabilityCta } from '../../data/sustainability/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function SustainabilityCTASection() {
  return (
    <section className="sustain-cta-section section-spacing-bottom">
      <div className="container-medium">
        <FadeIn id="sustain-cta-card" className="sustain-cta-card">
          <p className="sustain-cta-eyebrow">{sustainabilityCta.eyebrow}</p>
          <h2 className="sustain-cta-heading">{sustainabilityCta.heading}</h2>
          <p className="sustain-cta-description">{sustainabilityCta.description}</p>
          <div className="sustain-cta-actions">
            <ButtonArrow
              to={sustainabilityCta.buttonHref}
              label={sustainabilityCta.buttonLabel}
              variant="button-white-bg"
            />
            <a href={sustainabilityCta.emailHref} className="sustain-cta-email">
              {sustainabilityCta.email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
