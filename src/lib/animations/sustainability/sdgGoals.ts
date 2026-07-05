import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const APPEAR_DURATION = 0.28
const VIEWPORT_START = 'top 88%'

function resetVisible(container: HTMLElement) {
  const animated = container.querySelectorAll<HTMLElement>('[data-sdg-animate]')
  animated.forEach((el) => gsap.set(el, { clearProps: 'opacity,transform,clipPath' }))
}

function revealRow(tl: gsap.core.Timeline, pillar: HTMLElement) {
  const bar = pillar.querySelector<HTMLElement>('[data-sdg-animate="bar"]')

  tl.to(pillar, {
    opacity: 1,
    y: 0,
    duration: APPEAR_DURATION,
    ease: 'power3.out',
  })

  if (bar) {
    tl.to(
      bar,
      {
        scaleX: 1,
        duration: APPEAR_DURATION * 0.85,
        ease: 'power3.out',
      },
      '<',
    )
  }
}

export function setupSdgFrameworkAnimations(container: HTMLElement): AnimationCleanup {
  const title = container.querySelector<HTMLElement>('[data-sdg-animate="title"]')
  const description = container.querySelector<HTMLElement>('[data-sdg-animate="description"]')
  const pillars = Array.from(container.querySelectorAll<HTMLElement>('[data-sdg-animate="pillar"]'))

  if (!title && !description && !pillars.length) return () => {}

  if (prefersReducedMotion()) {
    resetVisible(container)
    return () => {}
  }

  const cleanups: AnimationCleanup[] = []
  const header = [title, description].filter(Boolean) as HTMLElement[]

  if (header.length) {
    gsap.set(header, { opacity: 0, y: 18 })

    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: title ?? description ?? container,
        start: VIEWPORT_START,
        toggleActions: 'play none none reverse',
      },
    })

    headerTl.to(header, {
      opacity: 1,
      y: 0,
      duration: APPEAR_DURATION,
      ease: 'power3.out',
      stagger: 0.05,
    })

    cleanups.push(() => {
      headerTl.scrollTrigger?.kill()
      headerTl.kill()
    })
  }

  pillars.forEach((pillar) => {
    const bar = pillar.querySelector<HTMLElement>('[data-sdg-animate="bar"]')
    gsap.set(pillar, { opacity: 0, y: 22 })
    if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })

    const pillarTl = gsap.timeline({
      scrollTrigger: {
        trigger: pillar,
        start: VIEWPORT_START,
        toggleActions: 'play none none reverse',
      },
    })

    revealRow(pillarTl, pillar)

    cleanups.push(() => {
      pillarTl.scrollTrigger?.kill()
      pillarTl.kill()
    })
  })

  ScrollTrigger.refresh()

  return () => {
    cleanups.forEach((cleanup) => cleanup())
    resetVisible(container)
  }
}
