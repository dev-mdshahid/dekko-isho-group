import { manufacturingExpertise, manufacturingHero } from '../../data/manufacturing/content'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

const MFG_HERO_VIDEO_ID = 'mfg-hero-video'

export function ManufacturingHeroSection() {
  const { title, description, ctaLabel, ctaHref, video, videoPoster, videoAlt } = manufacturingHero
  const { id: expertiseId, badge, title: expertiseTitle, paragraphs, features } = manufacturingExpertise

  return (
    <section className="service-details-section section-spacing-top mfg-hero-section">
      <div className="service-details-top container">
        <FadeIn id="mfg-hero-main" className="service-detail-main">
          <h1 className="service-detail-name mfg-hero-title">{title}</h1>
          <p className="service-detail-description mfg-hero-subtitle">{description}</p>
          <div className="service-detail-button">
            <ButtonArrow to={ctaHref} label={ctaLabel} />
          </div>
        </FadeIn>
      </div>

      <FadeIn id="mfg-hero-video-wrap" className="mfg-hero-video-wrap">
        <div
          data-video-urls={video}
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
          className="w-background-video w-background-video-atom mfg-hero-video"
        >
          <video
            id={MFG_HERO_VIDEO_ID}
            autoPlay
            loop
            muted
            playsInline
            aria-label={videoAlt}
            data-wf-ignore="true"
            data-object-fit="cover"
            poster={videoPoster}
            className="mfg-hero-video-media"
          >
            <source src={video} type="video/mp4" data-wf-ignore="true" />
          </video>
          <div aria-live="polite">
            <button
              type="button"
              data-w-bg-video-control="true"
              aria-controls={MFG_HERO_VIDEO_ID}
              className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control mfg-hero-video-control"
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

      <div id={expertiseId} className="service-more-info section-spacing-bottom">
        <div className="container">
          <div className="more-info-inner mfg-expertise-inner">
            <div className="mfg-expertise-block">
              <FadeIn id="mfg-expertise-badge" className="mfg-expertise-badge">
                <PreSectionTitle title={badge} />
              </FadeIn>

              <FadeIn id="mfg-expertise-title" className="mfg-expertise-title-wrap">
                <h2 className="section-title mfg-expertise-title">{expertiseTitle}</h2>
              </FadeIn>

              <FadeIn id="mfg-expertise-copy" className="mfg-expertise-copy" delay={80}>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="mfg-expertise-description">
                    {paragraph}
                  </p>
                ))}
              </FadeIn>
            </div>

            <div className="service-feature-info mfg-feature-info">
              <div className="w-layout-grid grid-feature mfg-feature-grid">
                {features.map((feature, index) => (
                  <FadeIn
                    key={feature.id}
                    id={`mfg-feature-${feature.id}`}
                    className="feature-main"
                    delay={index * 60}
                  >
                    <div className="feature-icon-wrap">
                      <img src={feature.icon} loading="lazy" alt="" className="feature-icon" />
                    </div>
                    <h2 className="feature-name">{feature.title}</h2>
                    <p className="feature-description">{feature.description}</p>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
