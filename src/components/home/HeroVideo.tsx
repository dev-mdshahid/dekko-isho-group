import { useEffect, useRef, useState } from 'react'

import { legacyImage } from '../../lib/assets'

const HERO_VIDEO = '/videos/hero-video-2.mp4'
const HERO_VIDEO_POSTER = '/legacy/videos/hero-video-poster-00001.jpg'
const HERO_VIDEO_ID = 'home-hero-video'

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video && video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      setIsReady(true)
    }
  }, [])

  return (
    <div className="hero-video-wrap">
      <div
        data-video-urls={HERO_VIDEO}
        data-autoplay="true"
        data-loop="true"
        data-wf-ignore="true"
        className={`hero-background-video w-background-video w-background-video-atom${isReady ? ' hero-background-video--ready' : ''}`}
      >
        {!isReady && (
          <div className="hero-video-placeholder" aria-hidden="true">
            <img src={HERO_VIDEO_POSTER} alt="" className="hero-video-poster" />
          </div>
        )}

        <video
          ref={videoRef}
          id={HERO_VIDEO_ID}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={HERO_VIDEO_POSTER}
          onLoadedMetadata={() => setIsReady(true)}
          data-wf-ignore="true"
          className="hero-video-media"
        >
          <source src={HERO_VIDEO} type="video/mp4" data-wf-ignore="true" />
        </video>

        <div aria-live="polite">
          <button
            type="button"
            data-w-bg-video-control="true"
            aria-controls={HERO_VIDEO_ID}
            className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control hero-video-control"
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
  )
}
