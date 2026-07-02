import { technologyIntegrationHero } from '../../data/technology-integration/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const TI_HERO_VIDEO_ID = 'ti-hero-video'

export function TechnologyHeroSection() {
  const { title, description, ctaLabel, ctaHref, video, videoAlt } = technologyIntegrationHero

  return (
    <section className="service-details-section section-spacing-top ti-hero-section">
      <div className="service-details-top container">
        <FadeIn id="ti-hero-main" className="service-detail-main">
          <h1 className="service-detail-name ti-hero-title">{title}</h1>
          <p className="service-detail-description ti-hero-subtitle">{description}</p>
          <div className="service-detail-button">
            <ButtonArrow to={ctaHref} label={ctaLabel} />
          </div>
        </FadeIn>
      </div>

      <FadeIn id="ti-hero-video-wrap" className="ti-hero-video-wrap">
        <div
          data-video-urls={video}
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
          className="w-background-video w-background-video-atom ti-hero-video"
        >
          <video
            id={TI_HERO_VIDEO_ID}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={videoAlt}
            data-wf-ignore="true"
            data-object-fit="cover"
            className="ti-hero-video-media"
          >
            <source src={video} type="video/mp4" data-wf-ignore="true" />
          </video>
        </div>
      </FadeIn>
    </section>
  )
}
