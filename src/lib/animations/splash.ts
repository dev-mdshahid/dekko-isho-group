import { gsap } from 'gsap'

import { type AnimationCleanup, prefersReducedMotion } from './prefersReducedMotion'

/**
 * Soft decelerating ease for the shared-element logo flight —
 * gentle lift-off, fluid mid-path, cushioned seat into the navbar.
 */
export const LOGO_MOVE_EASE = 'expo.inOut'

/**
 * Fast appear → brief hold (shimmer at the end) → immediate navbar exit.
 */
const LOGO_APPEAR_FROM_SCALE = 0.55
const LOGO_APPEAR_DURATION = 0.34
/** Hold time on-screen for the mark / shimmer beat. */
const LOGO_HOLD_DURATION = 1
/** Short shimmer at the very end of the hold, then exit. */
const SHINE_DURATION = 0.4
const SHINE_START_AT = LOGO_APPEAR_DURATION + LOGO_HOLD_DURATION - SHINE_DURATION
/** Shared-element flight to the navbar. */
const LOGO_MOVE_DURATION = 0.58
/** Veil clear after the logo has seated. */
const BACKDROP_FADE_DURATION = 0.32

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
 * 1) logo appears really fast
 * 2) holds ~1s with shimmer at the last stage
 * 3) immediate FLIP into the navbar while backdrop fades
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

  // ── 1. Fast appear ───────────────────────────────────────────────
  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: LOGO_APPEAR_DURATION,
    ease: 'power3.out',
  })

  // ── 2. Hold ~1s; shimmer at the very last stage ──────────────────
  if (shine) {
    if (logoWrap) {
      tl.set(logoWrap, { overflow: 'hidden' }, SHINE_START_AT)
    }

    tl.set(
      shine,
      {
        left: '-50%',
        skewX: -22,
        opacity: 0,
        visibility: 'visible',
      },
      SHINE_START_AT,
    )

    tl.to(
      shine,
      {
        opacity: 1,
        duration: 0.1,
        ease: 'power1.out',
      },
      SHINE_START_AT,
    )

    tl.to(
      shine,
      {
        left: '110%',
        duration: SHINE_DURATION,
        ease: 'power2.inOut',
      },
      SHINE_START_AT,
    )

    tl.fromTo(
      logo,
      { filter: 'brightness(1)' },
      {
        filter: 'brightness(1.22)',
        duration: SHINE_DURATION * 0.5,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
      },
      SHINE_START_AT,
    )

    tl.to(
      shine,
      {
        opacity: 0,
        duration: 0.12,
        ease: 'power2.out',
      },
      SHINE_START_AT + SHINE_DURATION - 0.12,
    )

    tl.set(logo, { filter: 'none' }, SHINE_START_AT + SHINE_DURATION)

    if (logoWrap) {
      tl.set(logoWrap, { overflow: 'visible' }, SHINE_START_AT + SHINE_DURATION)
    }
  }

  // Exit immediately after the hold (shimmer ends with it).
  const exitAt = LOGO_APPEAR_DURATION + LOGO_HOLD_DURATION

  tl.add(() => {
    if (disposed) return
    callbacks.onTransitionStart?.()
  }, exitAt)

  // ── 3. Eased FLIP → navbar ───────────────────────────────────────
  tl.add(() => {
    if (disposed) return

    if (shine) {
      gsap.set(shine, { opacity: 0, visibility: 'hidden' })
    }

    const currentScale = Math.max(gsap.getProperty(logo, 'scale') as number, 0.001)
    const flight = measureLogoFlight(logo, getLogoTarget())
    const endScale = flight
      ? currentScale * flight.scale
      : currentScale * 0.28
    const endX = flight?.x ?? 0
    const endY = flight?.y ?? 0

    gsap.set(logo, {
      x: 0,
      y: 0,
      scale: currentScale,
      opacity: 1,
      transformOrigin: 'center center',
      force3D: true,
    })

    moveTween = gsap.to(logo, {
      x: endX,
      y: endY,
      scale: endScale,
      duration: LOGO_MOVE_DURATION,
      ease: LOGO_MOVE_EASE,
      overwrite: 'auto',
      force3D: true,
      onComplete: () => {
        if (disposed) return
        callbacks.onHandoff?.()
        gsap.set(logo, { opacity: 0, visibility: 'hidden' })
      },
    })

    resizeHandler = () => {
      if (disposed || !moveTween) return
      const progress = moveTween.progress()
      if (progress >= 1) return

      const f = logo.getBoundingClientRect()
      const curX = gsap.getProperty(logo, 'x') as number
      const curY = gsap.getProperty(logo, 'y') as number
      const liveScale = Math.max(gsap.getProperty(logo, 'scale') as number, 0.001)
      const originCx = f.left + f.width / 2 - curX
      const originCy = f.top + f.height / 2 - curY

      const t = getLogoTarget()
      if (!t) return
      const l = t.getBoundingClientRect()
      const unscaledH = f.height / liveScale

      moveTween.vars.x = l.left + l.width / 2 - originCx
      moveTween.vars.y = l.top + l.height / 2 - originCy
      moveTween.vars.scale = l.height / Math.max(unscaledH, 1)
      moveTween.invalidate().progress(progress)
    }

    window.addEventListener('resize', resizeHandler)
  }, exitAt)

  tl.to({}, { duration: LOGO_MOVE_DURATION }, exitAt)

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
