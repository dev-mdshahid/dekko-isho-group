import { industrialLaundryHero } from '../../data/industrial-laundry/content'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const IL_HERO_VIDEO_ID = 'il-hero-video'

export function IndustrialLaundryHeroSection() {
  const { title, description, ctaLabel, ctaHref, video, videoAlt } = industrialLaundryHero

  return (
    <section className="service-details-section section-spacing-top il-hero-section">
      <div className="service-details-top container">
        <FadeIn id="il-hero-main" className="service-detail-main">
          <h1 className="service-detail-name il-hero-title">{title}</h1>
          <p className="service-detail-description il-hero-subtitle">{description}</p>
          <div className="service-detail-button">
            <ButtonArrow to={ctaHref} label={ctaLabel} />
          </div>
        </FadeIn>
      </div>

      <FadeIn id="il-hero-video-wrap" className="il-hero-video-wrap">
        <div
          data-video-urls={video}
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
          className="w-background-video w-background-video-atom il-hero-video"
        >
          <video
            id={IL_HERO_VIDEO_ID}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            fetchPriority="high"
            aria-label={videoAlt}
            data-wf-ignore="true"
            data-object-fit="cover"
            className="il-hero-video-media"
          >
            <source src={video} type="video/mp4" data-wf-ignore="true" />
          </video>
          <div aria-live="polite">
            <button
              type="button"
              data-w-bg-video-control="true"
              aria-controls={IL_HERO_VIDEO_ID}
              className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control il-hero-video-control"
            >
              <span className="play-state">
                <img
                  src={legacyImage('video-Icon-Puse.svg')}
                  loading="lazy"
                  alt="Pause video"
                  className="video-button-image"
                />
              </span>
              <span hidden className="pause-state">
                <img
                  loading="lazy"
                  alt="Play video"
                  src={legacyImage('Video-Icon-Play.svg')}
                  className="video-button-image"
                />
              </span>
            </button>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
