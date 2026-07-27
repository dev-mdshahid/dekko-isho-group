import { useEffect, useRef } from 'react'

import { setupImageInfoExpand } from '../../lib/animations/about/imageInfo'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PageHeroSection, type PageHeroTitleWord } from '../ui/PageHeroSection'

export type SolutionPageHeroContent = {
  badge?: string
  titleLines: PageHeroTitleWord[][]
  subtitle: string
  ctaLabel: string
  ctaHref: string
  video: string
  videoAlt: string
}

type SolutionPageHeroSectionProps = SolutionPageHeroContent & {
  idPrefix: string
  className?: string
}

export function SolutionPageHeroSection({
  idPrefix,
  className,
  badge,
  titleLines,
  subtitle,
  ctaLabel,
  ctaHref,
  video,
  videoAlt,
}: SolutionPageHeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)
  const videoId = `${idPrefix}-hero-video`

  useEffect(() => {
    const section = sectionRef.current
    const scaler = scalerRef.current
    if (!section || !scaler) return

    return setupImageInfoExpand({ section, scaler })
  }, [])

  const sectionClassName = ['solution-page-hero', className].filter(Boolean).join(' ')

  return (
    <PageHeroSection
      className={sectionClassName}
      badge={badge}
      titleLines={titleLines}
      subtitle={subtitle}
      actions={
        <FadeIn id={`${idPrefix}-hero-cta`} className="solution-page-hero-button">
          <ButtonArrow to={ctaHref} label={ctaLabel} />
        </FadeIn>
      }
    >
      <div className="solution-page-hero-media" ref={sectionRef}>
        <div className="solution-page-hero-media-stage">
          <div className="solution-page-hero-media-scaler" ref={scalerRef}>
            <div
              data-video-urls={video}
              data-autoplay="true"
              data-loop="true"
              data-wf-ignore="true"
              className="w-background-video w-background-video-atom solution-page-hero-video"
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
                className="solution-page-hero-video-media"
              >
                <source src={video} type="video/mp4" data-wf-ignore="true" />
              </video>
              <div aria-live="polite">
                <button
                  type="button"
                  data-w-bg-video-control="true"
                  aria-controls={videoId}
                  className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control solution-page-hero-video-control"
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
          </div>
        </div>
      </div>
    </PageHeroSection>
  )
}
