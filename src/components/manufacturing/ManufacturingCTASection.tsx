import { manufacturingCta } from '../../data/manufacturing/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingCTASection() {
  const { badge, heading, buttonLabel, buttonHref } = manufacturingCta

  return (
    <section className="cta-section mfg-cta-section">
      <div className="cta-info">
        <FadeIn id="mfg-cta-content" className="section-title-center _02">
          <PreSectionTitle title={badge} variant="bg-dark" />
          <h2 className="section-title title-center text-white">{heading}</h2>
          <div className="mfg-cta-button">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
