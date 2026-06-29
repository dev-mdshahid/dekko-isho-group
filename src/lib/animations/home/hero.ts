import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initHeroAnimations(scope: ParentNode): AnimationCleanup {
  const section = scope.querySelector<HTMLElement>('.hero-section')
  if (!section) return () => {}

  const lines = section.querySelectorAll<HTMLElement>('[data-home-animate="hero-line"]')
  const accents = section.querySelectorAll<HTMLElement>('[data-home-animate="hero-accent"]')
  const taglineLines = section.querySelectorAll<HTMLElement>('[data-home-animate="hero-tagline-line"]')
  const taglineText = section.querySelector<HTMLElement>('[data-home-animate="hero-tagline-text"]')
  const logos = section.querySelector<HTMLElement>('[data-home-animate="hero-logos"]')
  const heroInner = section.querySelector<HTMLElement>('.hero-inner')

  const reduced = prefersReducedMotion()

  if (reduced) {
    gsap.set([...lines, ...accents, taglineText, logos].filter(Boolean), {
      clearProps: 'all',
    })
    gsap.set(taglineLines, { scaleX: 1, transformOrigin: 'center' })
    return () => {}
  }

  gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' })
  gsap.set(accents, { opacity: 0, y: 20, scale: 0.96 })
  gsap.set(taglineLines, { scaleX: 0, transformOrigin: 'center' })
  if (taglineText) gsap.set(taglineText, { opacity: 0, y: 12 })
  if (logos) gsap.set(logos, { opacity: 0 })

  const tl = gsap.timeline({
    onComplete: () => {
      ScrollTrigger.refresh()
    },
  })

  tl.to(lines, {
    clipPath: 'inset(0 0% 0 0)',
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
  })
    .to(
      accents,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
      },
      '-=0.5',
    )
    .to(
      taglineLines,
      {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.1,
      },
      '-=0.2',
    )

  if (taglineText) {
    tl.to(taglineText, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35')
  }

  if (logos) {
    tl.to(logos, { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.15')
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
