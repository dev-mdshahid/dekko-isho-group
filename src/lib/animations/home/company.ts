import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initCompanyAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.company-section')
  const awards = scope.querySelector<HTMLElement>('[data-home-animate="company-bg"]')
  if (!section) return () => {}

  const reduced = prefersReducedMotion()
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  if (awards && !reduced) {
    gsap.set(awards, { yPercent: 0, transformOrigin: 'center bottom' })

    const awardsTween = gsap.fromTo(
      awards,
      { yPercent: 1.5 },
      {
        yPercent: -1.5,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
      },
    )

    if (awardsTween.scrollTrigger) triggers.push(awardsTween.scrollTrigger)
    tweens.push(awardsTween)
  }

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
  }
}
