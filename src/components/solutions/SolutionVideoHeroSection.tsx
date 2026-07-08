import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export type SolutionVideoHeroContent = {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  video: string
  videoAlt: string
}

type SolutionVideoHeroSectionProps = SolutionVideoHeroContent & {
  idPrefix: string
}

export function SolutionVideoHeroSection({
  idPrefix,
  title,
  description,
  ctaLabel,
  ctaHref,
  video,
  videoAlt,
}: SolutionVideoHeroSectionProps) {
  const videoId = `${idPrefix}-hero-video`

  return (
    <>
      <div className="service-details-top container">
        <FadeIn id={`${idPrefix}-hero-main`} className="service-detail-main">
          <h1 className="service-detail-name solution-hero-title">{title}</h1>
          <p className="service-detail-description solution-hero-subtitle">{description}</p>
          <div className="service-detail-button">
            <ButtonArrow to={ctaHref} label={ctaLabel} />
          </div>
        </FadeIn>
      </div>

      <FadeIn id={`${idPrefix}-hero-video-wrap`} className="solution-hero-video-wrap">
        <div
          data-video-urls={video}
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
          className="w-background-video w-background-video-atom solution-hero-video"
        >
          <video
            id={videoId}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-label={videoAlt}
            data-wf-ignore="true"
            data-object-fit="cover"
            className="solution-hero-video-media"
          >
            <source src={video} type="video/mp4" data-wf-ignore="true" />
          </video>
          <div aria-live="polite">
            <button
              type="button"
              data-w-bg-video-control="true"
              aria-controls={videoId}
              className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control solution-hero-video-control"
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
    </>
  )
}
