import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, isMobileViewport, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initServiceStackAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.service-section')
  if (!section) return () => {}

  const cards = section.querySelectorAll<HTMLElement>('[data-home-animate="service-card"]')
  if (!cards.length) return () => {}

  const reduced = prefersReducedMotion()
  const mobile = isMobileViewport()
  const triggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  if (reduced || mobile) {
    cards.forEach((card) => {
      const tween = gsap.fromTo(
        card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        },
      )
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      tweens.push(tween)
    })

    return () => {
      triggers.forEach((t) => t.kill())
      tweens.forEach((t) => t.kill())
    }
  }

  cards.forEach((card, index) => {
    if (index === cards.length - 1) return

    const nextCard = cards[index + 1]
    const inner = card.querySelector<HTMLElement>('.service-info-link') ?? card

    const tween = gsap.to(inner, {
      scale: 0.96,
      ease: 'none',
      scrollTrigger: {
        trigger: nextCard,
        start: 'top bottom',
        end: 'top 20%',
        scrub: 0.4,
      },
    })

    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
    tweens.push(tween)

    const features = card.querySelectorAll<HTMLElement>('.feature-item-inner')
    if (features.length) {
      const featureTween = gsap.fromTo(
        features,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            once: true,
          },
        },
      )
      if (featureTween.scrollTrigger) triggers.push(featureTween.scrollTrigger)
      tweens.push(featureTween)
    }
  })

  const lastCard = cards[cards.length - 1]
  const lastFeatures = lastCard?.querySelectorAll<HTMLElement>('.feature-item-inner')
  if (lastCard && lastFeatures?.length) {
    const featureTween = gsap.fromTo(
      lastFeatures,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: lastCard,
          start: 'top 75%',
          once: true,
        },
      },
    )
    if (featureTween.scrollTrigger) triggers.push(featureTween.scrollTrigger)
    tweens.push(featureTween)
  }

  return () => {
    triggers.forEach((t) => t.kill())
    tweens.forEach((t) => t.kill())
  }
}
