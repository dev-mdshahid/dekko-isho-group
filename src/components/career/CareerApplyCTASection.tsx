import { careerApplyCta } from '../../data/career/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function CareerApplyCTASection() {
  return (
    <section className="career-cta-section section-spacing">
      <div className="career-content-container">
        <FadeIn id="career-cta-card" className="career-cta-card">
          <div className="career-cta-content">
            <PreSectionTitle title={careerApplyCta.badge} variant="bg-dark" />
            <h2 className="career-cta-heading">{careerApplyCta.heading}</h2>
            <p className="career-cta-description">{careerApplyCta.description}</p>
          </div>
          <div className="career-cta-actions">
            <ButtonArrow
              to={careerApplyCta.buttonHref}
              label={careerApplyCta.buttonLabel}
              variant="button-white-bg"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
