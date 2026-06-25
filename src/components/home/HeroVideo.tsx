import { useCallback, useEffect, useRef, useState } from 'react'

const HERO_VIDEO = '/videos/hero-video-2.mp4'
const HERO_VIDEO_ID = 'home-hero-video'

function PauseIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="4" height="14" rx="1" />
      <rect x="8" y="0" width="4" height="14" rx="1" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
      <path d="M1 0.5L11 7L1 13.5V0.5Z" />
    </svg>
  )
}

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      setIsReady(true)
    }

    const syncPlaying = () => setIsPlaying(!video.paused)
    video.addEventListener('play', syncPlaying)
    video.addEventListener('pause', syncPlaying)

    return () => {
      video.removeEventListener('play', syncPlaying)
      video.removeEventListener('pause', syncPlaying)
    }
  }, [])

  const handleCanPlay = useCallback(() => {
    setIsReady(true)
  }, [])

  const togglePlayback = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      void video.play()
    } else {
      video.pause()
    }
  }, [])

  return (
    <div className="hero-video-wrap">
      <div className={`hero-video${isReady ? ' hero-video--ready' : ''}`}>
        {!isReady && (
          <div className="hero-video-loading" aria-hidden="true">
            <div className="hero-video-loader" role="status" aria-label="Loading video" />
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
          onCanPlay={handleCanPlay}
          className={`hero-video-media${isReady ? ' hero-video-media--visible' : ''}`}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>

        {isReady && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-controls={HERO_VIDEO_ID}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="hero-video-control"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
        )}
      </div>
    </div>
  )
}
