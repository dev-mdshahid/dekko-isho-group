import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useSplash } from '../../context/SplashContext'

const SPLASH_VIDEO_SRC = '/videos/splash-intro.mp4'
const BOOT_SPLASH_ID = 'boot-splash'
const FADE_OUT_MS = 320

function removeBootSplash() {
  document.getElementById(BOOT_SPLASH_ID)?.remove()
  document.documentElement.classList.remove('splash-boot')
}

/**
 * Full-viewport splash video that takes over from #boot-splash on first paint.
 */
export function SplashScreen() {
  const { phase, setPhase, isActive, completeSplash } = useSplash()
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const startedRef = useRef(false)
  const completedRef = useRef(false)

  // Take over from the HTML boot splash before the browser paints React's first frame.
  useLayoutEffect(() => {
    if (phase === 'skipped' || phase === 'complete') {
      removeBootSplash()
      document.documentElement.classList.add('splash-done')
      return
    }

    document.documentElement.classList.add('splash-active')
    removeBootSplash()
  }, [phase])

  // Cached media may skip early load events.
  useLayoutEffect(() => {
    if (phase === 'skipped' || phase === 'complete') return
    const video = videoRef.current
    if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setVideoReady(true)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'skipped' || phase === 'complete') {
      document.documentElement.classList.add('splash-done')
    }
  }, [phase])

  useEffect(() => {
    if (!isActive || !videoReady || startedRef.current || completedRef.current) return

    const overlay = overlayRef.current
    const video = videoRef.current
    if (!overlay || !video) return

    startedRef.current = true
    setPhase('loading')

    const finishSplash = () => {
      if (completedRef.current) return
      completedRef.current = true
      setPhase('transitioning')

      // Reveal the page under the fading white veil.
      document.documentElement.classList.add('splash-revealing')
      overlay.classList.add('is-fading')

      window.setTimeout(() => {
        document.documentElement.classList.add('splash-done')
        document.documentElement.classList.remove(
          'splash-handoff',
          'splash-active',
          'splash-boot',
          'splash-revealing',
        )
        completeSplash()
      }, FADE_OUT_MS)
    }

    const onEnded = () => finishSplash()
    const onError = () => finishSplash()

    video.muted = true
    video.playsInline = true
    video.currentTime = 0

    void video.play().catch(() => {
      finishSplash()
    })

    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    return () => {
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      if (!completedRef.current) {
        startedRef.current = false
      }
    }
  }, [completeSplash, isActive, setPhase, videoReady])

  if (phase === 'skipped' || phase === 'complete') {
    return null
  }

  return createPortal(
    <div
      ref={overlayRef}
      className="splash-overlay"
      role="status"
      aria-live="polite"
      aria-busy={isActive}
      aria-label="Loading Dekko Isho Group"
    >
      <div ref={backdropRef} className="splash-backdrop" aria-hidden="true" />
      <div className={`splash-video-frame${videoReady ? ' is-ready' : ''}`}>
        <video
          ref={videoRef}
          className="splash-video"
          src={SPLASH_VIDEO_SRC}
          autoPlay
          muted
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onError={() => {
            setVideoReady(true)
            if (!completedRef.current) {
              completedRef.current = true
              document.documentElement.classList.add('splash-done')
              document.documentElement.classList.remove(
                'splash-active',
                'splash-boot',
                'splash-revealing',
              )
              completeSplash()
            }
          }}
        />
      </div>
    </div>,
    document.body,
  )
}
