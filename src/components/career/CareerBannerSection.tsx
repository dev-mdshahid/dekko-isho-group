import { careerBanner } from '../../data/career/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const BANNER_IMAGE = '/images/career-bg.png'

export function CareerBannerSection() {
  return (
    <div className="career-banner">
      <div className="w-layout-grid career-banner-grid">
        <div className="career-banner-panel">
          <FadeIn id="career-banner-content" className="career-banner-content">
            <div className="career-banner-inner">
              <h2 className="career-banner-headline">{careerBanner.headline}</h2>
              <p className="career-banner-description">{careerBanner.description}</p>
              <div className="career-banner-button">
                <ButtonArrow to={careerBanner.ctaHref} label={careerBanner.ctaLabel} />
              </div>
            </div>
          </FadeIn>
          <div className="career-banner-marquee" aria-hidden="true">
            <h2 className="marquee-text">{careerBanner.watermark}</h2>
          </div>
        </div>
        <div className="career-banner-image-wrap">
          <img
            src={BANNER_IMAGE}
            loading="eager"
            alt="Renewable innovation manufacturing facility"
            className="career-banner-image"
          />
        </div>
      </div>
    </div>
  )
}
