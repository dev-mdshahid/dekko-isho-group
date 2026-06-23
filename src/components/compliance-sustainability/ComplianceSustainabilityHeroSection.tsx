import { complianceSustainabilityHero } from '../../data/compliance-sustainability/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const CS_HERO_VIDEO_ID = 'cs-hero-video'

export function ComplianceSustainabilityHeroSection() {
  const { title, description, ctaLabel, ctaHref, video, videoAlt } = complianceSustainabilityHero

  return (
    <section className="service-details-section section-spacing-top cs-hero-section">
      <div className="service-details-top container">
        <FadeIn id="cs-hero-main" className="service-detail-main">
          <h1 className="service-detail-name cs-hero-title">{title}</h1>
          <p className="service-detail-description cs-hero-subtitle">{description}</p>
          <div className="service-detail-button">
            <ButtonArrow to={ctaHref} label={ctaLabel} />
          </div>
        </FadeIn>
      </div>

      <FadeIn id="cs-hero-video-wrap" className="cs-hero-video-wrap">
        <div
          data-video-urls={video}
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
          className="w-background-video w-background-video-atom cs-hero-video"
        >
          <video
            id={CS_HERO_VIDEO_ID}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={videoAlt}
            data-wf-ignore="true"
            data-object-fit="cover"
            className="cs-hero-video-media"
          >
            <source src={video} type="video/mp4" data-wf-ignore="true" />
          </video>
        </div>
      </FadeIn>
    </section>
  )
}
