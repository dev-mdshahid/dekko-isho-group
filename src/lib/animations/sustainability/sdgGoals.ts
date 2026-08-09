import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const APPEAR_DURATION = 0.34
const VIEWPORT_START = 'top 88%'

function resetVisible(container: HTMLElement) {
  const animated = container.querySelectorAll<HTMLElement>('[data-sdg-animate]')
  animated.forEach((el) => gsap.set(el, { clearProps: 'opacity,transform' }))
}

export function setupSdgFrameworkAnimations(container: HTMLElement): AnimationCleanup {
  const title = container.querySelector<HTMLElement>('[data-sdg-animate="title"]')
  const description = container.querySelector<HTMLElement>('[data-sdg-animate="description"]')
  const grid = container.querySelector<HTMLElement>('[data-sdg-animate="pillar"]')
  const cards = Array.from(container.querySelectorAll<HTMLElement>('.sustain-sdg-card'))

  if (!title && !description && !grid) return () => {}

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
      stagger: 0.06,
    })

    cleanups.push(() => {
      headerTl.scrollTrigger?.kill()
      headerTl.kill()
    })
  }

  if (grid) {
    gsap.set(grid, { opacity: 0, y: 24 })
    if (cards.length) gsap.set(cards, { opacity: 0, y: 16, scale: 0.97 })

    const gridTl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: VIEWPORT_START,
        toggleActions: 'play none none reverse',
      },
    })

    gridTl.to(grid, {
      opacity: 1,
      y: 0,
      duration: APPEAR_DURATION,
      ease: 'power3.out',
    })

    if (cards.length) {
      gridTl.to(
        cards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: APPEAR_DURATION,
          ease: 'power3.out',
          stagger: 0.035,
        },
        '-=0.12',
      )
    }

    cleanups.push(() => {
      gridTl.scrollTrigger?.kill()
      gridTl.kill()
    })
  }

  ScrollTrigger.refresh()

  return () => {
    cleanups.forEach((cleanup) => cleanup())
    resetVisible(container)
  }
}
