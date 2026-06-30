import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const STREET_DRAW_DURATION = 1.35
const STEP_GAP = 0.42
const POINTER_DURATION = 0.62
const TEXT_DURATION = 0.48

function resetVisible(section: HTMLElement) {
  const street = section.querySelector<HTMLElement>('[data-about-animate="roadmap-street"]')
  const milestones = section.querySelectorAll<HTMLElement>('[data-about-animate="roadmap-milestone"]')

  if (street) gsap.set(street, { clearProps: 'clipPath,opacity,transform' })
  milestones.forEach((milestone) => {
    const pointer = milestone.querySelector<HTMLElement>('[data-about-animate="roadmap-pointer"]')
    const text = milestone.querySelector<HTMLElement>('[data-about-animate="roadmap-milestone-text"]')
    if (pointer) gsap.set(pointer, { clearProps: 'opacity,transform' })
    if (text) gsap.set(text, { clearProps: 'opacity,transform' })
  })
}

export function initRoadmapAnimations(section: HTMLElement): AnimationCleanup {
  const stage = section.querySelector<HTMLElement>('[data-about-animate="roadmap-stage"]')
  const street = section.querySelector<HTMLElement>('[data-about-animate="roadmap-street"]')
  const milestones = Array.from(
    section.querySelectorAll<HTMLElement>('[data-about-animate="roadmap-milestone"]'),
  ).sort((a, b) => Number(a.dataset.roadmapStep ?? 0) - Number(b.dataset.roadmapStep ?? 0))

  if (!stage || !street || !milestones.length) return () => {}

  if (prefersReducedMotion()) {
    resetVisible(section)
    return () => {}
  }

  gsap.set(street, { clipPath: 'inset(0 100% 0 0)' })

  milestones.forEach((milestone) => {
    const isUp = milestone.classList.contains('about-roadmap-milestone--up')
    const isTextLeft = milestone.classList.contains('about-roadmap-milestone--text-left')
    const pointer = milestone.querySelector<HTMLElement>('[data-about-animate="roadmap-pointer"]')
    const text = milestone.querySelector<HTMLElement>('[data-about-animate="roadmap-milestone-text"]')

    if (pointer) {
      gsap.set(pointer, {
        opacity: 0,
        scale: 0.35,
        y: isUp ? 36 : -36,
        transformOrigin: isUp ? '50% 0%' : '50% 100%',
      })
    }

    if (text) {
      gsap.set(text, {
        opacity: 0,
        x: isTextLeft ? -32 : 32,
      })
    }
  })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stage,
      start: 'top 72%',
      once: true,
    },
  })

  tl.to(street, {
    clipPath: 'inset(0 0% 0 0)',
    duration: STREET_DRAW_DURATION,
    ease: 'power3.inOut',
  })

  milestones.forEach((milestone, index) => {
    const pointer = milestone.querySelector<HTMLElement>('[data-about-animate="roadmap-pointer"]')
    const text = milestone.querySelector<HTMLElement>('[data-about-animate="roadmap-milestone-text"]')
    const stepStart = index === 0 ? `-=${0.35}` : `+=${STEP_GAP}`

    if (pointer) {
      tl.to(
        pointer,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: POINTER_DURATION,
          ease: 'back.out(2.2)',
        },
        stepStart,
      )

      tl.to(
        pointer,
        {
          scale: 1.05,
          duration: 0.14,
          ease: 'power2.out',
        },
        '>-0.08',
      )

      tl.to(
        pointer,
        {
          scale: 1,
          duration: 0.22,
          ease: 'power2.inOut',
        },
      )
    }

    if (text) {
      tl.to(
        text,
        {
          opacity: 1,
          x: 0,
          duration: TEXT_DURATION,
          ease: 'power3.out',
        },
        pointer ? '-=0.38' : stepStart,
      )
    }
  })

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    resetVisible(section)
  }
}
