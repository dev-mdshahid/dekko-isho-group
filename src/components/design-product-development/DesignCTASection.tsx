import { designProductDevelopmentCta } from '../../data/design-product-development/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignCTASection() {
  const { badge, heading, description, buttonLabel, buttonHref } = designProductDevelopmentCta

  return (
    <section className="dpd-cta-section">
      <div className="container">
        <FadeIn id="dpd-cta-card" className="dpd-cta-card">
          <div className="dpd-cta-content">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="dpd-cta-heading">{heading}</h2>
            <p className="dpd-cta-description">{description}</p>
          </div>
          <div className="dpd-cta-action">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
