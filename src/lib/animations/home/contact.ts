import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initContactAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.home-contact-section')
  if (!section) return () => {}

  const fields = section.querySelectorAll<HTMLElement>('[data-home-animate="contact-field"]')
  const visual = section.querySelector<HTMLElement>('[data-home-animate="contact-visual"]')
  const submit = section.querySelector<HTMLElement>('[data-home-animate="contact-submit"]')

  const reduced = prefersReducedMotion()
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  const formTargets = [...fields, submit].filter(Boolean) as HTMLElement[]

  if (formTargets.length && !reduced) {
    gsap.set(formTargets, { opacity: 0, y: 20 })

    const formTween = gsap.to(formTargets, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: section.querySelector('.page-contact-form-card') ?? section,
        start: 'top 75%',
        once: true,
      },
    })

    if (formTween.scrollTrigger) triggers.push(formTween.scrollTrigger)
    tweens.push(formTween)
  }

  if (visual && !reduced) {
    const visualTween = gsap.fromTo(
      visual,
      { y: 30 },
      {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      },
    )

    if (visualTween.scrollTrigger) triggers.push(visualTween.scrollTrigger)
    tweens.push(visualTween)
  }

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
  }
}
