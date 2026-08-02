import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useSplash } from '../../context/SplashContext'
import { runSplashAnimation } from '../../lib/animations/splash'

const LOGO_SRC = '/dekko-logo.svg'
const BOOT_SPLASH_ID = 'boot-splash'

// ── Video splash (commented out — logo animation restored per client request) ──
// const SPLASH_VIDEO_SRC = '/videos/splash-intro.mp4'
// const FADE_OUT_MS = 320

function removeBootSplash() {
  document.getElementById(BOOT_SPLASH_ID)?.remove()
  document.documentElement.classList.remove('splash-boot')
}

/**
 * Full-viewport splash: centered brand logo → progress → FLIP into navbar logo.
 * A matching #boot-splash in index.html covers first paint; this component takes over
 * in useLayoutEffect so the page never flashes underneath.
 */
export function SplashScreen() {
  const { phase, setPhase, isActive, logoTargetRef, completeSplash } = useSplash()
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const progressTrackRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const [logoReady, setLogoReady] = useState(false)
  const startedRef = useRef(false)
  const finishedRef = useRef(false)
  const setPhaseRef = useRef(setPhase)
  const completeSplashRef = useRef(completeSplash)

  setPhaseRef.current = setPhase
  completeSplashRef.current = completeSplash

  // ── Video splash refs/state (commented out) ──
  // const videoRef = useRef<HTMLVideoElement>(null)
  // const [videoReady, setVideoReady] = useState(false)
  // const completedRef = useRef(false)

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

  // Cached images may skip the load event.
  useLayoutEffect(() => {
    if (phase === 'skipped' || phase === 'complete') return
    const logo = logoRef.current
    if (logo?.complete) setLogoReady(true)
  }, [phase])

  // ── Video splash: cached media ready check (commented out) ──
  // useLayoutEffect(() => {
  //   if (phase === 'skipped' || phase === 'complete') return
  //   const video = videoRef.current
  //   if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
  //     setVideoReady(true)
  //   }
  // }, [phase])

  useEffect(() => {
    if (phase === 'skipped' || phase === 'complete') {
      document.documentElement.classList.add('splash-done')
    }
  }, [phase])

  useEffect(() => {
    if (!isActive) return
    if (!logoReady) return
    if (startedRef.current || finishedRef.current) return

    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const stage = stageRef.current
    const logo = logoRef.current
    const progressTrack = progressTrackRef.current
    const progressFill = progressFillRef.current

    if (!overlay || !backdrop || !stage || !logo || !progressTrack || !progressFill) return

    startedRef.current = true
    setPhaseRef.current('loading')

    const cleanup = runSplashAnimation(
      {
        overlay,
        backdrop,
        stage,
        logo,
        progressTrack,
        progressFill,
        getLogoTarget: () => logoTargetRef.current,
      },
      {
        onTransitionStart: () => {
          setPhaseRef.current('transitioning')
          // Reveal page under the fading backdrop while the logo flies.
          document.documentElement.classList.add('splash-revealing')
        },
        onHandoff: () => {
          document.documentElement.classList.add('splash-handoff')
        },
        onComplete: () => {
          finishedRef.current = true
          document.documentElement.classList.add('splash-done')
          document.documentElement.classList.remove(
            'splash-handoff',
            'splash-active',
            'splash-boot',
            'splash-revealing',
          )
          completeSplashRef.current()
        },
      },
    )

    return () => {
      cleanup()
      if (!finishedRef.current) {
        startedRef.current = false
      }
    }
  }, [isActive, logoReady, logoTargetRef])

  // ── Video splash playback effect (commented out) ──
  // useEffect(() => {
  //   if (!isActive || !videoReady || startedRef.current || completedRef.current) return
  //
  //   const overlay = overlayRef.current
  //   const video = videoRef.current
  //   if (!overlay || !video) return
  //
  //   startedRef.current = true
  //   setPhase('loading')
  //
  //   const finishSplash = () => {
  //     if (completedRef.current) return
  //     completedRef.current = true
  //     setPhase('transitioning')
  //
  //     document.documentElement.classList.add('splash-revealing')
  //     overlay.classList.add('is-fading')
  //
  //     window.setTimeout(() => {
  //       document.documentElement.classList.add('splash-done')
  //       document.documentElement.classList.remove(
  //         'splash-handoff',
  //         'splash-active',
  //         'splash-boot',
  //         'splash-revealing',
  //       )
  //       completeSplash()
  //     }, FADE_OUT_MS)
  //   }
  //
  //   const onEnded = () => finishSplash()
  //   const onError = () => finishSplash()
  //
  //   video.muted = true
  //   video.playsInline = true
  //   video.currentTime = 0
  //
  //   void video.play().catch(() => {
  //     finishSplash()
  //   })
  //
  //   video.addEventListener('ended', onEnded)
  //   video.addEventListener('error', onError)
  //
  //   return () => {
  //     video.removeEventListener('ended', onEnded)
  //     video.removeEventListener('error', onError)
  //     if (!completedRef.current) {
  //       startedRef.current = false
  //     }
  //   }
  // }, [completeSplash, isActive, setPhase, videoReady])

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
      <div ref={stageRef} className="splash-stage">
        <img
          ref={logoRef}
          src={LOGO_SRC}
          alt="Dekko Isho Group"
          className="splash-logo"
          width={320}
          height={128}
          decoding="async"
          fetchPriority="high"
          onLoad={() => setLogoReady(true)}
          onError={() => setLogoReady(true)}
        />
        <div ref={progressTrackRef} className="splash-progress" aria-hidden="true">
          <div ref={progressFillRef} className="splash-progress-fill" />
        </div>
      </div>
      {/* ── Video splash markup (commented out) ──
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
      */}
    </div>,
    document.body,
  )
}
