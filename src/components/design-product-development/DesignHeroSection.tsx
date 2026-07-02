import { designProductDevelopmentHero } from '../../data/design-product-development/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const DPD_HERO_VIDEO_ID = 'dpd-hero-video'

export function DesignHeroSection() {
  const { title, description, ctaLabel, ctaHref, video, videoAlt } = designProductDevelopmentHero

  return (
    <section className="service-details-section section-spacing-top dpd-hero-section">
      <div className="service-details-top container">
        <FadeIn id="dpd-hero-main" className="service-detail-main">
          <h1 className="service-detail-name dpd-hero-title">{title}</h1>
          <p className="service-detail-description dpd-hero-subtitle">{description}</p>
          <div className="service-detail-button">
            <ButtonArrow to={ctaHref} label={ctaLabel} />
          </div>
        </FadeIn>
      </div>

      <FadeIn id="dpd-hero-video-wrap" className="dpd-hero-video-wrap">
        <div
          data-video-urls={video}
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
          className="w-background-video w-background-video-atom dpd-hero-video"
        >
          <video
            id={DPD_HERO_VIDEO_ID}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={videoAlt}
            data-wf-ignore="true"
            data-object-fit="cover"
            className="dpd-hero-video-media"
          >
            <source src={video} type="video/mp4" data-wf-ignore="true" />
          </video>
        </div>
      </FadeIn>
    </section>
  )
}
