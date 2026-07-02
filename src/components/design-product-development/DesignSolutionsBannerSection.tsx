import { designProductDevelopmentSolutionsBanner } from '../../data/design-product-development/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignSolutionsBannerSection() {
  const { badge, title, descriptions, buttonLabel, buttonHref, backgroundImage, backgroundAlt } =
    designProductDevelopmentSolutionsBanner

  return (
    <section className="dpd-solutions-banner-section">
      <img
        src={backgroundImage}
        loading="lazy"
        alt={backgroundAlt}
        className="dpd-solutions-banner-bg"
      />
      <div className="dpd-solutions-banner-overlay" aria-hidden="true" />
      <div className="container">
        <FadeIn id="dpd-solutions-banner-card" className="dpd-solutions-banner-card">
          <div className="dpd-solutions-banner-content">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="dpd-solutions-banner-title">{title}</h2>
            <div className="dpd-solutions-banner-copy">
              {descriptions.map((paragraph) => (
                <p key={paragraph} className="dpd-solutions-banner-description">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="dpd-solutions-banner-action">
            <ButtonArrow to={buttonHref} label={buttonLabel} variant="button-white-bg" />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
