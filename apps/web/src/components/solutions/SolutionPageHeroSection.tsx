import { useCallback, useEffect, useRef, useState } from 'react'

import { setupImageInfoExpand } from '../../lib/animations/about/imageInfo'
import { PageHeroSection, type PageHeroTitleWord } from '../ui/PageHeroSection'
import { PauseIcon, PlayIcon } from '../ui/ButtonIcon'

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
  // ctaLabel,
  // ctaHref,
  video,
  videoAlt,
}: SolutionPageHeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoId = `${idPrefix}-hero-video`

  useEffect(() => {
    const section = sectionRef.current
    const scaler = scalerRef.current
    if (!section || !scaler) return

    return setupImageInfoExpand({ section, scaler })
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const syncPlaying = () => setIsPlaying(!el.paused)
    el.addEventListener('play', syncPlaying)
    el.addEventListener('pause', syncPlaying)

    return () => {
      el.removeEventListener('play', syncPlaying)
      el.removeEventListener('pause', syncPlaying)
    }
  }, [])

  const togglePlayback = useCallback(() => {
    const el = videoRef.current
    if (!el) return

    if (el.paused) {
      void el.play()
    } else {
      el.pause()
    }
  }, [])

  const sectionClassName = ['solution-page-hero', className].filter(Boolean).join(' ')

  return (
    <PageHeroSection
      className={sectionClassName}
      badge={badge}
      titleLines={titleLines}
      subtitle={subtitle}
      // actions={
      //   <FadeIn id={`${idPrefix}-hero-cta`} className="solution-page-hero-button">
      //     <ButtonArrow to={ctaHref} label={ctaLabel} />
      //   </FadeIn>
      // }
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
                ref={videoRef}
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
                  onClick={togglePlayback}
                  aria-controls={videoId}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control solution-page-hero-video-control"
                >
                  <span className="play-state" hidden={!isPlaying}>
                    <PauseIcon />
                  </span>
                  <span className="pause-state" hidden={isPlaying}>
                    <PlayIcon />
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
