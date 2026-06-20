import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

/** Webflow `slideInBottom` preset — opacity 0, y 100px, 1000ms outQuart. */
const SLIDE_IN_BOTTOM = {
  initialY: 100,
  duration: 1,
  ease: 'power4.out',
} as const

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

function startShadowLoops(scope: HTMLElement) {
  const shadow01 = scope.querySelector<HTMLElement>('.footer-shadow._01')
  const shadow02 = scope.querySelector<HTMLElement>('.footer-shadow._02')
  if (!shadow01 || !shadow02) return () => {}

  gsap.set(shadow01, { x: 180, scale: 1.2, rotation: 0, transformOrigin: '50% 50%' })
  const tl1 = gsap
    .timeline({ repeat: -1 })
    .to(shadow01, { x: 0, rotation: 180, scale: 2, duration: 3, ease: 'none' })
    .to(shadow01, { x: 200, rotation: 0, scale: 1, duration: 3, ease: 'none' })

  gsap.set(shadow02, { x: 100, y: 70, rotation: 180, transformOrigin: '50% 50%' })
  const tl2 = gsap
    .timeline({ repeat: -1 })
    .to(shadow02, { x: -300, y: -100, rotation: -180, duration: 3, ease: 'none' })
    .to(shadow02, { x: 100, y: 70, rotation: 180, duration: 3, ease: 'none' })

  return () => {
    tl1.kill()
    tl2.kill()
    gsap.set([shadow01, shadow02], { clearProps: 'transform' })
  }
}

/** Looping footer glow shadows — Webflow action lists a-29 / a-30. */
export function useFooterShadowAnimation(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let shadowObserver: IntersectionObserver | null = null
    let stopShadows: (() => void) | null = null
    let frame = 0

    frame = requestAnimationFrame(() => {
      const scope = containerRef.current
      if (!scope) return

      const footerMain = scope.querySelector<HTMLElement>('.footer-main')
      if (!footerMain) return

      shadowObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              stopShadows?.()
              stopShadows = startShadowLoops(scope)
            } else {
              stopShadows?.()
              stopShadows = null
            }
          })
        },
        { threshold: 0, rootMargin: '0px' },
      )
      shadowObserver.observe(footerMain)
      if (isInViewport(footerMain)) {
        stopShadows = startShadowLoops(scope)
      }
    })

    return () => {
      cancelAnimationFrame(frame)
      shadowObserver?.disconnect()
      stopShadows?.()
    }
  }, [containerRef])
}

/** Footer scroll-reveal — matches legacy Webflow `slideInBottom` IX2 presets. */
export function useFooterAnimations(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let sectionObserver: IntersectionObserver | null = null
    let resyncTimer = 0
    let frame = 0

    const reveal = (el: HTMLElement) => {
      if (el.dataset.fadeDone === 'true') return
      el.dataset.fadeDone = 'true'
      const delayMs = Number.parseInt(el.dataset.fadeDelay ?? '0', 10)
      const delay = Number.isFinite(delayMs) ? delayMs / 1000 : 0
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: SLIDE_IN_BOTTOM.duration,
        ease: SLIDE_IN_BOTTOM.ease,
        delay,
        overwrite: 'auto',
      })
    }

    const revealAll = (scope: HTMLElement) => {
      const targets = Array.from(
        scope.querySelectorAll<HTMLElement>('[data-fade-variant="slide-in-bottom"]'),
      ).filter((el) => el.dataset.fadeDone !== 'true')

      targets.forEach((el) => {
        gsap.set(el, { opacity: 0, y: SLIDE_IN_BOTTOM.initialY })
        reveal(el)
      })
    }

    const primeTargets = (scope: HTMLElement) => {
      scope.querySelectorAll<HTMLElement>('[data-fade-variant="slide-in-bottom"]').forEach((el) => {
        if (el.dataset.fadeDone === 'true') return
        gsap.set(el, { opacity: 0, y: SLIDE_IN_BOTTOM.initialY })
      })
    }

    frame = requestAnimationFrame(() => {
      const scope = containerRef.current
      if (!scope) return

      primeTargets(scope)

      // Observe the footer shell — bottom rows sit below the fold until scrolled.
      // Per-element observers fail when transforms push targets outside overflow clips.
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            revealAll(scope)
            sectionObserver?.disconnect()
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px 120px 0px' },
      )

      sectionObserver.observe(scope)

      if (isInViewport(scope)) {
        revealAll(scope)
        sectionObserver.disconnect()
      }

      resyncTimer = window.setTimeout(() => {
        primeTargets(scope)
        if (isInViewport(scope)) revealAll(scope)
      }, 300)
    })

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(resyncTimer)
      sectionObserver?.disconnect()
    }
  }, [containerRef])
}
