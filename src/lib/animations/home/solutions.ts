import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const DECOR_PARALLAX = [
  { y: -30, rotate: -2 },
  { y: -60, rotate: -1.5 },
  { y: -45, rotate: 1.5 },
  { y: -75, rotate: 2 },
]

export function initSolutionsDecorParallax(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.solutions-expertise-section')
  if (!section) return () => {}

  const decors = section.querySelectorAll<HTMLElement>('[data-home-animate="solutions-decor"]')
  if (!decors.length) return () => {}

  const reduced = prefersReducedMotion()
  const triggers: ScrollTrigger[] = []

  if (reduced) {
    gsap.set(decors, { clearProps: 'all' })
    return () => {}
  }

  decors.forEach((el, index) => {
    const config = DECOR_PARALLAX[index % DECOR_PARALLAX.length]
    gsap.set(el, { rotate: config.rotate })

    const tween = gsap.to(el, {
      y: config.y,
      rotate: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    })

    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  return () => {
    triggers.forEach((t) => t.kill())
  }
}

export function animateSolutionsTabPanel(panel: HTMLElement | null) {
  if (!panel || prefersReducedMotion()) return

  const image = panel.querySelector<HTMLElement>('.solutions-expertise-card-image')
  const title = panel.querySelector<HTMLElement>('.solutions-expertise-card-title')
  const description = panel.querySelector<HTMLElement>('.solutions-expertise-card-description')
  const features = panel.querySelectorAll<HTMLElement>('.solutions-expertise-feature-item')

  gsap.killTweensOf([panel, image, title, description, ...features])

  gsap.set(panel, { opacity: 0, x: 24 })
  if (image) gsap.set(image, { scale: 1.04 })

  const tl = gsap.timeline()

  tl.to(panel, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' })

  if (image) {
    tl.to(image, { scale: 1, duration: 0.7, ease: 'power2.out' }, 0)
  }

  if (title || description) {
    tl.fromTo(
      [title, description].filter(Boolean),
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.09 },
      0.12,
    )
  }

  if (features.length) {
    tl.fromTo(
      features,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.06 },
      0.18,
    )
  }
}
