import { gsap } from 'gsap'

import { type AnimationCleanup, prefersReducedMotion } from './prefersReducedMotion'

/**
 * Smooth ease-in-out with a soft landing — reads more fluid than linear Material
 * standard for long shared-element logo flights.
 */
export const LOGO_MOVE_EASE = 'power3.inOut'

const LOGO_APPEAR_DURATION = 0.55
const PROGRESS_DURATION = 1
/** Slightly snappy shared-element flight to the navbar. */
const LOGO_MOVE_DURATION = 0.55
const PROGRESS_HIDE_DURATION = 0.16
/** Quick veil clear after the logo has seated. */
const BACKDROP_FADE_DURATION = 0.22

export type SplashAnimationElements = {
  overlay: HTMLElement
  backdrop: HTMLElement
  stage: HTMLElement
  logo: HTMLElement
  progressTrack: HTMLElement
  progressFill: HTMLElement
  getLogoTarget: () => HTMLElement | null
}

export type SplashAnimationCallbacks = {
  onTransitionStart?: () => void
  /** Fired when the flying logo reaches the navbar slot (swap to real logo). */
  onHandoff?: () => void
  onComplete?: () => void
}

type LogoFlight = {
  x: number
  y: number
  scale: number
}

function measureLogoFlight(logo: HTMLElement, target: HTMLElement | null): LogoFlight | null {
  if (!target) return null

  const first = logo.getBoundingClientRect()
  const last = target.getBoundingClientRect()
  if (last.width < 1 || last.height < 1 || first.width < 1 || first.height < 1) {
    return null
  }

  const scale = last.height / first.height
  const firstCx = first.left + first.width / 2
  const firstCy = first.top + first.height / 2
  const lastCx = last.left + last.width / 2
  const lastCy = last.top + last.height / 2

  return {
    x: lastCx - firstCx,
    y: lastCy - firstCy,
    scale,
  }
}

/**
 * Run the full splash sequence:
 * 1) logo appear (fade + scale)
 * 2) progress 0→100 (~1s ease-in-out)
 * 3) FLIP logo from center → navbar target while backdrop fades
 * 4) complete
 */
export function runSplashAnimation(
  els: SplashAnimationElements,
  callbacks: SplashAnimationCallbacks = {},
): AnimationCleanup {
  const { overlay, backdrop, stage, logo, progressTrack, progressFill, getLogoTarget } = els

  if (prefersReducedMotion()) {
    callbacks.onComplete?.()
    return () => {}
  }

  let disposed = false
  let resizeHandler: (() => void) | null = null
  let moveTween: gsap.core.Tween | null = null

  gsap.set(progressFill, { scaleX: 0, transformOrigin: 'left center' })
  gsap.set(progressTrack, { opacity: 0 })
  gsap.set(logo, {
    x: 0,
    y: 0,
    scale: 0.88,
    opacity: 0,
    transformOrigin: 'center center',
    force3D: true,
  })
  gsap.set(backdrop, { opacity: 1, force3D: true })
  gsap.set([overlay, stage], { force3D: true })

  const tl = gsap.timeline({
    defaults: { force3D: true },
    onComplete: () => {
      if (disposed) return
      callbacks.onComplete?.()
    },
  })

  // ── 1. Logo appear ───────────────────────────────────────────────
  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: LOGO_APPEAR_DURATION,
    ease: 'power3.out',
  })

  // Progress track fades in just as the logo settles.
  tl.to(
    progressTrack,
    {
      opacity: 1,
      duration: 0.28,
      ease: 'power2.out',
    },
    '-=0.25',
  )

  // ── 2. Loading progress ──────────────────────────────────────────
  tl.to(progressFill, {
    scaleX: 1,
    duration: PROGRESS_DURATION,
    ease: 'power2.inOut',
  })

  // ── 3. Hide progress quickly so the logo flight starts cleanly ───
  tl.to(
    progressTrack,
    {
      opacity: 0,
      duration: PROGRESS_HIDE_DURATION,
      ease: 'power2.out',
    },
    '>-0.08',
  )

  tl.add(() => {
    if (disposed) return
    callbacks.onTransitionStart?.()
  })

  // ── 4. FLIP logo + fade splash backdrop in parallel ──────────────
  tl.add(() => {
    if (disposed) return

    const flight = measureLogoFlight(logo, getLogoTarget()) ?? {
      x: 0,
      y: 0,
      scale: 0.35,
    }

    // Re-baseline so the tween always starts from the current visual pose.
    gsap.set(logo, {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      transformOrigin: 'center center',
      force3D: true,
    })

    moveTween = gsap.to(logo, {
      x: flight.x,
      y: flight.y,
      scale: flight.scale,
      duration: LOGO_MOVE_DURATION,
      ease: LOGO_MOVE_EASE,
      overwrite: 'auto',
      force3D: true,
      onComplete: () => {
        if (disposed) return
        // Instant seat: navbar logo appears under the flyer, then flyer is removed.
        callbacks.onHandoff?.()
        gsap.set(logo, { opacity: 0, visibility: 'hidden' })
      },
    })

    resizeHandler = () => {
      if (disposed || !moveTween) return
      const next = measureLogoFlight(logo, getLogoTarget())
      if (!next) return

      const progress = moveTween.progress()
      if (progress >= 1) return

      const f = logo.getBoundingClientRect()
      const curX = gsap.getProperty(logo, 'x') as number
      const curY = gsap.getProperty(logo, 'y') as number
      const currentScale = Math.max(gsap.getProperty(logo, 'scale') as number, 0.001)
      const originCx = f.left + f.width / 2 - curX
      const originCy = f.top + f.height / 2 - curY

      const t = getLogoTarget()
      if (!t) return
      const l = t.getBoundingClientRect()
      const unscaledH = f.height / currentScale

      moveTween.vars.x = l.left + l.width / 2 - originCx
      moveTween.vars.y = l.top + l.height / 2 - originCy
      moveTween.vars.scale = l.height / Math.max(unscaledH, 1)
      moveTween.invalidate().progress(progress)
    }

    window.addEventListener('resize', resizeHandler)
  })

  // Keep the splash fully opaque while the logo flies.
  tl.to({}, { duration: LOGO_MOVE_DURATION })

  // After the logo seats, fade the veil out quickly.
  tl.to(backdrop, {
    opacity: 0,
    duration: BACKDROP_FADE_DURATION,
    ease: 'power2.out',
  })

  tl.set(overlay, { pointerEvents: 'none' })

  return () => {
    disposed = true
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
    tl.kill()
    moveTween?.kill()
    gsap.killTweensOf([overlay, backdrop, stage, logo, progressTrack, progressFill])
  }
}
