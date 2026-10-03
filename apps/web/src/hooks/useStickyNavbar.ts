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
 * Updates CSS variables on the element / document (no React re-renders per frame).
 * Also exposes `--navbar-height` for sticky content offsets below the bar.
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

    function syncNavbarHeight() {
      const height = Math.round(nav!.getBoundingClientRect().height)
      document.documentElement.style.setProperty('--navbar-height', `${height}px`)
    }

    function applyProgress(progress: number) {
      const clamped = Math.min(1, Math.max(0, progress))
      nav!.style.setProperty('--nav-bg-progress', clamped.toFixed(4))
      nav!.classList.toggle('is-scrolled', clamped >= SCROLLED_CLASS_THRESHOLD)
    }

    function measureScrollProgress() {
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

    function measureAll() {
      syncNavbarHeight()
      measureScrollProgress()
    }

    function onScroll() {
      if (frameId) {
        return
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        measureScrollProgress()
      })
    }

    function onResizeOrPageshow() {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
        frameId = 0
      }
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        measureAll()
      })
    }

    measureAll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResizeOrPageshow, { passive: true })
    // Restore correct state after bfcache / back-forward navigation.
    window.addEventListener('pageshow', onResizeOrPageshow)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResizeOrPageshow)
      window.removeEventListener('pageshow', onResizeOrPageshow)
    }
  }, [navRef, forceSolid, resetKey])
}
