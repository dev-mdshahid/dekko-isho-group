import { useEffect, useRef } from 'react'

import { manufacturingHero } from '../../data/manufacturing/content'
import { setupImageInfoExpand } from '../../lib/animations/about/imageInfo'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PageHeroSection } from '../ui/PageHeroSection'

const VIDEO_ID = 'mfg-hero-video'

export function ManufacturingHeroSection() {
  const { titleLines, subtitle, ctaLabel, ctaHref, video, videoAlt } = manufacturingHero
  const sectionRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scaler = scalerRef.current
    if (!section || !scaler) return

    return setupImageInfoExpand({ section, scaler })
  }, [])

  return (
    <PageHeroSection
      className="mfg-hero-section"
      titleLines={titleLines}
      subtitle={subtitle}
      actions={
        <FadeIn id="mfg-hero-cta" className="mfg-hero-button">
          <ButtonArrow to={ctaHref} label={ctaLabel} />
        </FadeIn>
      }
    >
      <div className="mfg-hero-media" ref={sectionRef}>
        <div className="mfg-hero-media-stage">
          <div className="mfg-hero-media-scaler" ref={scalerRef}>
            <div
              data-video-urls={video}
              data-autoplay="true"
              data-loop="true"
              data-wf-ignore="true"
              className="w-background-video w-background-video-atom mfg-hero-video"
            >
              <video
                id={VIDEO_ID}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label={videoAlt}
                data-wf-ignore="true"
                data-object-fit="cover"
                className="mfg-hero-video-media"
              >
                <source src={video} type="video/mp4" data-wf-ignore="true" />
              </video>
              <div aria-live="polite">
                <button
                  type="button"
                  data-w-bg-video-control="true"
                  aria-controls={VIDEO_ID}
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
          </div>
        </div>
      </div>
    </PageHeroSection>
  )
}
