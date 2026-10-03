import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, isMobileViewport, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scrub parallax for `[data-solution-animate="media-parallax"]`
 * and background zoom for `[data-solution-animate="bg-parallax"]`.
 */
export function initSolutionMediaAnimations(scope: ParentNode): AnimationCleanup {
  if (prefersReducedMotion()) return () => {}

  const cleanups: (() => void)[] = []
  const mobile = isMobileViewport()

  if (!mobile) {
    scope.querySelectorAll<HTMLElement>('[data-solution-animate="media-parallax"]').forEach((media) => {
      const trigger =
        media.closest('section') ?? media.closest('[data-solution-parallax-trigger]') ?? media

      const tween = gsap.fromTo(
        media,
        { y: 30 },
        {
          y: -30,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      )

      cleanups.push(() => {
        tween.scrollTrigger?.kill()
        tween.kill()
      })
    })
  }

  scope.querySelectorAll<HTMLElement>('[data-solution-animate="bg-parallax"]').forEach((bg) => {
    const trigger = bg.closest('section') ?? bg

    gsap.set(bg, { scale: 1, transformOrigin: 'center center' })

    const tween = gsap.to(bg, {
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    })

    cleanups.push(() => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
  })

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
