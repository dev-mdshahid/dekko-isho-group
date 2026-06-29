import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initCompanyAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.company-section')
  const bg = scope.querySelector<HTMLElement>('[data-home-animate="company-bg"]')
  if (!section) return () => {}

  const reduced = prefersReducedMotion()
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  if (bg && !reduced) {
    gsap.set(bg, { scale: 1, transformOrigin: 'center right' })

    const bgTween = gsap.to(bg, {
      scale: 1.08,
      backgroundPosition: '48% center',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    })

    if (bgTween.scrollTrigger) triggers.push(bgTween.scrollTrigger)
    tweens.push(bgTween)
  }

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
  }
}
