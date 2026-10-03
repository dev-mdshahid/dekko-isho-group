import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initHeroAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.hero-section')
  if (!section) return () => {}

  const taglineLines = section.querySelectorAll<HTMLElement>('[data-home-animate="hero-tagline-line"]')
  const taglineText = section.querySelector<HTMLElement>('[data-home-animate="hero-tagline-text"]')
  const logos = section.querySelector<HTMLElement>('[data-home-animate="hero-logos"]')
  const heroInner = section.querySelector<HTMLElement>('.hero-inner')

  const reduced = prefersReducedMotion()

  if (reduced) {
    gsap.set([taglineText, logos].filter(Boolean), { clearProps: 'all' })
    gsap.set(taglineLines, { scaleX: 1, transformOrigin: 'center' })
    return () => {}
  }

  gsap.set(taglineLines, { scaleX: 0, transformOrigin: 'center' })
  if (taglineText) gsap.set(taglineText, { opacity: 0, y: 20 })
  if (logos) gsap.set(logos, { opacity: 0, y: 24 })

  const tl = gsap.timeline({
    delay: 0.2,
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      once: true,
    },
    onComplete: () => {
      ScrollTrigger.refresh()
    },
  })

  const bottomStart = 0.2
  tl.to(
    taglineLines,
    { scaleX: 1, duration: 0.8, ease: 'power2.inOut', stagger: 0.12 },
    bottomStart,
  )
  if (taglineText) {
    tl.to(taglineText, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, bottomStart + 0.2)
  }
  if (logos) {
    tl.to(logos, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, bottomStart + 0.45)
  }

  let parallaxTrigger: ScrollTrigger | undefined

  if (heroInner) {
    parallaxTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      animation: gsap.to(heroInner, { y: -40, ease: 'none' }),
    })
  }

  return () => {
    tl.kill()
    parallaxTrigger?.kill()
  }
}
