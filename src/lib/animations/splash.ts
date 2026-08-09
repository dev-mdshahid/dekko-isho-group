import { gsap } from 'gsap'

import { type AnimationCleanup, prefersReducedMotion } from './prefersReducedMotion'

/**
 * Soft decelerating ease for the shared-element logo flight —
 * gentle lift-off, fluid mid-path, cushioned seat into the navbar.
 */
export const LOGO_MOVE_EASE = 'expo.inOut'

/** Zoom-in appear: starts small, blooms to full size. */
const LOGO_APPEAR_DURATION = 0.9
const LOGO_APPEAR_FROM_SCALE = 0.62
/** Diagonal light sweep across the logo mark. */
const SHINE_DURATION = 1.1
/** Brief settle after shine before the exit flight. */
const POST_SHINE_HOLD = 0.28
/** Shared-element flight to the navbar. */
const LOGO_MOVE_DURATION = 0.78
/** Veil clear after the logo has seated. */
const BACKDROP_FADE_DURATION = 0.42

export type SplashAnimationElements = {
  overlay: HTMLElement
  backdrop: HTMLElement
  stage: HTMLElement
  logo: HTMLElement
  logoWrap?: HTMLElement | null
  shine?: HTMLElement | null
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
 * 1) logo zoom-in appear
 * 2) premium shine / shimmer sweep
 * 3) eased FLIP logo from center → navbar while backdrop fades
 * 4) complete
 */
export function runSplashAnimation(
  els: SplashAnimationElements,
  callbacks: SplashAnimationCallbacks = {},
): AnimationCleanup {
  const { overlay, backdrop, stage, logo, logoWrap, shine, getLogoTarget } = els

  if (prefersReducedMotion()) {
    callbacks.onComplete?.()
    return () => {}
  }

  let disposed = false
  let resizeHandler: (() => void) | null = null
  let moveTween: gsap.core.Tween | null = null

  const killTargets: gsap.TweenTarget[] = [overlay, backdrop, stage, logo]
  if (logoWrap) killTargets.push(logoWrap)
  if (shine) killTargets.push(shine)

  gsap.set(logo, {
    x: 0,
    y: 0,
    scale: LOGO_APPEAR_FROM_SCALE,
    opacity: 0,
    transformOrigin: 'center center',
    force3D: true,
  })
  if (shine) {
    gsap.set(shine, {
      left: '-50%',
      skewX: -22,
      opacity: 0,
      x: 0,
      force3D: true,
    })
  }
  gsap.set(logo, { filter: 'brightness(1)' })
  gsap.set(backdrop, { opacity: 1, force3D: true })
  gsap.set([overlay, stage], { force3D: true })

  const tl = gsap.timeline({
    defaults: { force3D: true },
    onComplete: () => {
      if (disposed) return
      callbacks.onComplete?.()
    },
  })

  // ── 1. Zoom-in appear ────────────────────────────────────────────
  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: LOGO_APPEAR_DURATION,
    ease: 'expo.out',
  })

  // Soft settle so the mark feels planted before the shimmer.
  tl.to({}, { duration: 0.18 })

  // ── 2. Shine / shimmer sweep ─────────────────────────────────────
  if (shine) {
    // Clip the beam to the logo stage for the sweep, then reopen for FLIP.
    if (logoWrap) {
      tl.set(logoWrap, { overflow: 'hidden' })
    }

    tl.set(shine, {
      left: '-50%',
      skewX: -22,
      opacity: 0,
      visibility: 'visible',
    })

    // Soft fade-in as the band enters.
    tl.to(shine, {
      opacity: 1,
      duration: 0.22,
      ease: 'power1.out',
    })

    // Sweep across the logo (left is % of the wrap — reliably crosses).
    tl.to(
      shine,
      {
        left: '110%',
        duration: SHINE_DURATION,
        ease: 'power2.inOut',
      },
      '<',
    )

    // Companion brightness kiss so the shimmer reads even on pale mark areas.
    tl.fromTo(
      logo,
      { filter: 'brightness(1)' },
      {
        filter: 'brightness(1.2)',
        duration: SHINE_DURATION * 0.5,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
      },
      '<',
    )

    // Fade the beam out near the exit edge.
    tl.to(
      shine,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
      `-=${0.3}`,
    )

    tl.set(logo, { filter: 'none' })

    if (logoWrap) {
      tl.set(logoWrap, { overflow: 'visible' })
    }
  }

  tl.to({}, { duration: POST_SHINE_HOLD })

  tl.add(() => {
    if (disposed) return
    callbacks.onTransitionStart?.()
  })

  // ── 3. Eased FLIP logo + fade splash backdrop ────────────────────
  tl.add(() => {
    if (disposed) return

    // Ensure shine is fully gone before the flight so it doesn't travel.
    if (shine) {
      gsap.set(shine, { opacity: 0, visibility: 'hidden' })
    }

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

  // After the logo seats, ease the veil out.
  tl.to(backdrop, {
    opacity: 0,
    duration: BACKDROP_FADE_DURATION,
    ease: 'power3.out',
  })

  tl.set(overlay, { pointerEvents: 'none' })

  return () => {
    disposed = true
    if (resizeHandler) {
      window.removeEventListener('resize', resizeHandler)
    }
    tl.kill()
    moveTween?.kill()
    gsap.killTweensOf(killTargets)
  }
}
