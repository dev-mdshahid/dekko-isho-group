import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function initAboutHeroAnimations(section: HTMLElement): AnimationCleanup {
  const words = Array.from(section.querySelectorAll<HTMLElement>('[data-about-animate="hero-word"]'))
  const subtitle = section.querySelector<HTMLElement>('[data-about-animate="hero-subtitle"]')

  if (!words.length && !subtitle) return () => {}

  if (prefersReducedMotion()) {
    gsap.set([...words, subtitle].filter(Boolean), { clearProps: 'all' })
    return () => {}
  }

  gsap.set(words, { opacity: 0, y: 30 })
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20 })

  const tl = gsap.timeline({
    delay: 0.2,
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      once: true,
    },
  })

  // Heading words fade up, staggered
  tl.to(words, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 })

  // Subtitle plays in parallel with the heading, after a slight delay
  if (subtitle) {
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.2)
  }

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
  }
}
