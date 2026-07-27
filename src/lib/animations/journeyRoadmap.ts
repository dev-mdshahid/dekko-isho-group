import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import {
  type AnimationCleanup,
  isMobileViewport,
  prefersReducedMotion,
} from './prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Journey roadmap choreography — “traveler” pacing.
 *
 * For each stage: path advances → node lands → brief hold → next.
 * At the top→bottom turn, a longer breath marks the handoff.
 */
const ARRIVE = 0.4
const HOLD = 0.16
const TURN_BREATH = 0.48
const DOT_IN = 0.5
const LABEL_IN = 0.44
const LABEL_LAG = 0.1
const LAND_LEAD = 0.14
const GHOST_IN = 0.55
const FINALE_HOLD = 0.32
const PULSE = 0.22

type Beat = {
  index: number
  time: number
  isFinale: boolean
}

function buildBeats(rows: Array<'top' | 'bottom'>): { beats: Beat[]; total: number } {
  const beats: Beat[] = []
  let time = GHOST_IN * 0.35

  rows.forEach((row, index) => {
    const prev = rows[index - 1]
    if (prev === 'top' && row === 'bottom') {
      time += TURN_BREATH
    }

    beats.push({
      index,
      time,
      isFinale: index === rows.length - 1,
    })

    time += ARRIVE + (index === rows.length - 1 ? FINALE_HOLD : HOLD)
  })

  return { beats, total: time }
}

/** Desktop flow: top row L→R, then bottom row R→L (follows the U-turn path). */
function orderDesktopNodes(nodes: HTMLElement[]): HTMLElement[] {
  const top = nodes
    .filter((node) => node.dataset.journeyRow !== 'bottom')
    .sort(
      (a, b) =>
        Number(a.dataset.journeyColumn ?? 0) - Number(b.dataset.journeyColumn ?? 0),
    )
  const bottom = nodes
    .filter((node) => node.dataset.journeyRow === 'bottom')
    .sort(
      (a, b) =>
        Number(b.dataset.journeyColumn ?? 0) - Number(a.dataset.journeyColumn ?? 0),
    )
  return [...top, ...bottom]
}

function resetVisible(section: HTMLElement) {
  const maskPath = section.querySelector<SVGPathElement>('[data-journey-path-mask]')
  const ghost = section.querySelector<SVGPathElement>('[data-journey-path-ghost]')
  const dots = section.querySelectorAll<HTMLElement>('[data-journey-dot]')
  const labels = section.querySelectorAll<HTMLElement>('[data-journey-label]')
  const mobileItems = section.querySelectorAll<HTMLElement>('[data-journey-mobile-item]')
  const mobileDots = section.querySelectorAll<HTMLElement>('[data-journey-mobile-dot]')
  const mobileLabels = section.querySelectorAll<HTMLElement>('[data-journey-mobile-label]')

  if (maskPath) gsap.set(maskPath, { clearProps: 'strokeDasharray,strokeDashoffset' })
  if (ghost) gsap.set(ghost, { clearProps: 'opacity' })
  gsap.set(dots, { clearProps: 'opacity,transform' })
  gsap.set(labels, { clearProps: 'opacity,transform' })
  gsap.set(mobileItems, { clearProps: 'opacity,transform' })
  gsap.set(mobileDots, { clearProps: 'opacity,transform' })
  gsap.set(mobileLabels, { clearProps: 'opacity,transform' })
}

function revealNode(
  tl: gsap.core.Timeline,
  dot: HTMLElement | null,
  label: HTMLElement | null,
  at: number,
  isFinale: boolean,
) {
  if (dot) {
    tl.to(
      dot,
      {
        opacity: 1,
        scale: 1,
        duration: DOT_IN,
        ease: 'power3.out',
      },
      at,
    )

    // Soft confirmation pulse — stronger on the final stage.
    const peak = isFinale ? 1.12 : 1.06
    tl.to(
      dot,
      {
        scale: peak,
        duration: PULSE,
        ease: 'power2.out',
      },
      at + DOT_IN * 0.55,
    )
    tl.to(
      dot,
      {
        scale: 1,
        duration: PULSE * 1.35,
        ease: 'power2.inOut',
      },
      at + DOT_IN * 0.55 + PULSE,
    )
  }

  if (label) {
    tl.to(
      label,
      {
        opacity: 1,
        y: 0,
        duration: isFinale ? LABEL_IN + 0.08 : LABEL_IN,
        ease: 'power3.out',
      },
      at + LABEL_LAG,
    )
  }
}

export function initJourneyRoadmapAnimations(section: HTMLElement): AnimationCleanup {
  const roadmap = section.querySelector<HTMLElement>('[data-journey-roadmap]')
  const mobile = section.querySelector<HTMLElement>('[data-journey-mobile]')
  const maskPath = section.querySelector<SVGPathElement>('[data-journey-path-mask]')
  const ghost = section.querySelector<SVGPathElement>('[data-journey-path-ghost]')
  const nodes = orderDesktopNodes(
    Array.from(section.querySelectorAll<HTMLElement>('[data-journey-node]')),
  )
  const mobileItems = Array.from(
    section.querySelectorAll<HTMLElement>('[data-journey-mobile-item]'),
  ).sort((a, b) => Number(a.dataset.journeyStep ?? 0) - Number(b.dataset.journeyStep ?? 0))

  if (!roadmap && !mobile) return () => {}

  if (prefersReducedMotion()) {
    resetVisible(section)
    return () => {}
  }

  const mobileMode = isMobileViewport()
  const trigger = mobileMode ? mobile : roadmap
  if (!trigger) return () => {}

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top 75%',
      toggleActions: 'restart reset restart reset',
    },
  })

  if (mobileMode) {
    const rows = mobileItems.map(
      (item) => (item.dataset.journeyRow === 'bottom' ? 'bottom' : 'top') as 'top' | 'bottom',
    )
    const { beats } = buildBeats(rows)

    mobileItems.forEach((item) => {
      const dot = item.querySelector<HTMLElement>('[data-journey-mobile-dot]')
      const label = item.querySelector<HTMLElement>('[data-journey-mobile-label]')
      gsap.set(item, { opacity: 1, y: 0 })
      if (dot) gsap.set(dot, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
      if (label) gsap.set(label, { opacity: 0, y: 12 })
    })

    beats.forEach((beat) => {
      const item = mobileItems[beat.index]
      if (!item) return
      const dot = item.querySelector<HTMLElement>('[data-journey-mobile-dot]')
      const label = item.querySelector<HTMLElement>('[data-journey-mobile-label]')
      revealNode(tl, dot, label, beat.time, beat.isFinale)
    })
  } else {
    const rows = nodes.map(
      (node) => (node.dataset.journeyRow === 'bottom' ? 'bottom' : 'top') as 'top' | 'bottom',
    )
    const { beats, total } = buildBeats(rows)
    const count = Math.max(nodes.length, 1)

    const dots = nodes.map((node) => node.querySelector<HTMLElement>('[data-journey-dot]'))
    const labels = nodes.map((node) => node.querySelector<HTMLElement>('[data-journey-label]'))

    gsap.set(dots.filter(Boolean), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
    gsap.set(labels.filter(Boolean), { opacity: 0, y: 16 })

    if (ghost) {
      gsap.set(ghost, { opacity: 0 })
      tl.to(
        ghost,
        {
          opacity: 0.28,
          duration: GHOST_IN,
          ease: 'power2.out',
        },
        0,
      )
    }

    if (maskPath) {
      gsap.set(maskPath, {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      })

      // Path advances in story beats: each segment arrives just as its node lands.
      let prevProgress = 0
      beats.forEach((beat) => {
        const progress = (beat.index + 1) / count
        const segmentStart = beat.time
        tl.fromTo(
          maskPath,
          { strokeDashoffset: 1 - prevProgress },
          {
            strokeDashoffset: 1 - progress,
            duration: ARRIVE,
            ease: 'power2.inOut',
          },
          segmentStart,
        )
        prevProgress = progress
      })

      // Ensure path is fully drawn by the end even if timing drifts.
      tl.to(
        maskPath,
        {
          strokeDashoffset: 0,
          duration: 0.2,
          ease: 'power1.out',
        },
        Math.max(total - 0.2, beats[beats.length - 1]?.time ?? 0),
      )
    }

    beats.forEach((beat) => {
      const landAt = beat.time + Math.max(ARRIVE - LAND_LEAD, 0)
      revealNode(tl, dots[beat.index] ?? null, labels[beat.index] ?? null, landAt, beat.isFinale)
    })
  }

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    resetVisible(section)
  }
}
