import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

/** Scroll distance (px) over which the navbar background fades from transparent to solid. */
const FADE_DISTANCE_PX = 80

/** Progress at which the discrete scrolled styles (shadow, etc.) engage. */
const SCROLLED_CLASS_THRESHOLD = 0.7

type UseStickyNavbarOptions = {
  /** Force fully solid background (e.g. while a dropdown is open). */
  forceSolid?: boolean
  /** Re-measure when this changes (typically route pathname). */
  resetKey?: string
}

/**
 * Drive a fixed navbar's transparent → solid white transition from scroll position.
 * Updates a CSS variable on the element (no React re-renders per frame).
 */
export function useStickyNavbar(
  navRef: RefObject<HTMLElement | null>,
  { forceSolid = false, resetKey }: UseStickyNavbarOptions = {},
) {
  useEffect(() => {
    const nav = navRef.current
    if (!nav) {
      return undefined
    }

    let frameId = 0

    function applyProgress(progress: number) {
      const clamped = Math.min(1, Math.max(0, progress))
      nav!.style.setProperty('--nav-bg-progress', clamped.toFixed(4))
      nav!.classList.toggle('is-scrolled', clamped >= SCROLLED_CLASS_THRESHOLD)
    }

    function measure() {
      if (forceSolid) {
        applyProgress(1)
        return
      }

      // Ignore iOS rubber-band / negative scroll.
      const y = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0)

      if (prefersReducedMotion()) {
        applyProgress(y > 8 ? 1 : 0)
        return
      }

      applyProgress(y / FADE_DISTANCE_PX)
    }

    function onScrollOrResize() {
      if (frameId) {
        return
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        measure()
      })
    }

    measure()

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize, { passive: true })
    // Restore correct state after bfcache / back-forward navigation.
    window.addEventListener('pageshow', measure)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('pageshow', measure)
    }
  }, [navRef, forceSolid, resetKey])
}
