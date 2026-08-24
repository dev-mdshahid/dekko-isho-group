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
const ARRIVE = 0.72
const HOLD = 0.16
const TURN_BREATH = 0.48
const TURN_ARRIVE = 1
const DOT_IN = 0.5
const LABEL_IN = 0.44
const LABEL_LAG = 0.1
const GHOST_IN = 0.55
const FINALE_HOLD = 0.32
const PULSE = 0.22
const MOBILE_CONNECTOR_IN = 0.68

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
  const maskPaths = section.querySelectorAll<SVGPathElement>('[data-journey-path-mask]')
  const dots = section.querySelectorAll<HTMLElement>('[data-journey-dot]')
  const icons = section.querySelectorAll<HTMLElement>('[data-journey-icon]')
  const labels = section.querySelectorAll<HTMLElement>('[data-journey-label]')
  const mobileItems = section.querySelectorAll<HTMLElement>('[data-journey-mobile-item]')
  const mobileConnectors = section.querySelectorAll<HTMLElement>('[data-journey-mobile-connector]')
  const mobileDots = section.querySelectorAll<HTMLElement>('[data-journey-mobile-dot]')
  const mobileIcons = section.querySelectorAll<HTMLElement>('[data-journey-mobile-icon]')
  const mobileLabels = section.querySelectorAll<HTMLElement>('[data-journey-mobile-label]')

  gsap.set(maskPaths, { clearProps: 'strokeDasharray,strokeDashoffset' })
  gsap.set(dots, { clearProps: 'opacity,transform' })
  gsap.set(icons, { clearProps: 'opacity,transform' })
  gsap.set(labels, { clearProps: 'opacity,transform' })
  gsap.set(mobileItems, { clearProps: 'opacity,transform' })
  gsap.set(mobileConnectors, { clearProps: 'opacity,transform,transformOrigin' })
  gsap.set(mobileDots, { clearProps: 'opacity,transform' })
  gsap.set(mobileIcons, { clearProps: 'opacity,transform' })
  gsap.set(mobileLabels, { clearProps: 'opacity,transform' })
}

function pathLength(path: SVGPathElement) {
  try {
    return path.getTotalLength()
  } catch {
    return 1
  }
}

function revealNode(
  tl: gsap.core.Timeline,
  dot: HTMLElement | null,
  label: HTMLElement | null,
  at: number,
  isFinale: boolean,
  icon?: HTMLElement | null,
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

  if (icon) {
    tl.to(
      icon,
      {
        opacity: 1,
        y: 0,
        duration: LABEL_IN,
        ease: 'power3.out',
      },
      at + LABEL_LAG,
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
      at + LABEL_LAG + (icon ? 0.06 : 0),
    )
  }
}

export function initJourneyRoadmapAnimations(section: HTMLElement): AnimationCleanup {
  const roadmap = section.querySelector<HTMLElement>('[data-journey-roadmap]')
  const mobile = section.querySelector<HTMLElement>('[data-journey-mobile]')
  const maskPaths = Array.from(
    section.querySelectorAll<SVGPathElement>('[data-journey-path-mask]'),
  )
  const connectorPaths = Array.from(section.querySelectorAll<SVGPathElement>('[data-journey-path]'))
  const nodes = orderDesktopNodes(
    Array.from(section.querySelectorAll<HTMLElement>('[data-journey-node]')),
  )
  const mobileItems = Array.from(
    section.querySelectorAll<HTMLElement>('[data-journey-mobile-item]'),
  ).sort((a, b) => Number(a.dataset.journeyStep ?? 0) - Number(b.dataset.journeyStep ?? 0))
  const mobileConnectors = mobileItems.map((item) =>
    item.querySelector<HTMLElement>('[data-journey-mobile-connector]'),
  )

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
    mobileItems.forEach((item) => {
      const dot = item.querySelector<HTMLElement>('[data-journey-mobile-dot]')
      const icon = item.querySelector<HTMLElement>('[data-journey-mobile-icon]')
      const label = item.querySelector<HTMLElement>('[data-journey-mobile-label]')
      gsap.set(item, { opacity: 1, y: 0 })
      if (dot) gsap.set(dot, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
      if (icon) gsap.set(icon, { opacity: 0, y: 12 })
      if (label) gsap.set(label, { opacity: 0, y: 12 })
    })
    gsap.set(mobileConnectors.filter(Boolean), {
      opacity: 1,
      scaleY: 0,
      transformOrigin: '50% 0%',
    })

    let cursor = GHOST_IN * 0.35

    mobileItems.forEach((item, index) => {
      const dot = item.querySelector<HTMLElement>('[data-journey-mobile-dot]')
      const icon = item.querySelector<HTMLElement>('[data-journey-mobile-icon]')
      const label = item.querySelector<HTMLElement>('[data-journey-mobile-label]')
      const connector = mobileConnectors[index]
      const isFinale = index === mobileItems.length - 1

      revealNode(tl, dot, label, cursor, isFinale, icon)
      cursor += DOT_IN + (isFinale ? FINALE_HOLD : HOLD)

      if (connector) {
        tl.to(
          connector,
          {
            scaleY: 1,
            duration: MOBILE_CONNECTOR_IN,
            ease: 'power2.inOut',
          },
          cursor,
        )
        cursor += MOBILE_CONNECTOR_IN + HOLD
      }
    })
  } else {
    const dots = nodes.map((node) => node.querySelector<HTMLElement>('[data-journey-dot]'))
    const icons = nodes.map((node) => node.querySelector<HTMLElement>('[data-journey-icon]'))
    const labels = nodes.map((node) => node.querySelector<HTMLElement>('[data-journey-label]'))

    gsap.set(dots.filter(Boolean), { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
    gsap.set(icons.filter(Boolean), { opacity: 0, y: 12 })
    gsap.set(labels.filter(Boolean), { opacity: 0, y: 16 })
    maskPaths.forEach((maskPath) => {
      const length = pathLength(maskPath)
      gsap.set(maskPath, {
        strokeDasharray: length,
        strokeDashoffset: length,
      })
    })

    let cursor = GHOST_IN * 0.35

    nodes.forEach((_node, index) => {
      revealNode(
        tl,
        dots[index] ?? null,
        labels[index] ?? null,
        cursor,
        index === nodes.length - 1,
        icons[index] ?? null,
      )

      const maskPath = maskPaths[index]
      if (!maskPath) {
        cursor += DOT_IN + HOLD
        return
      }

      const connectorPath = connectorPaths[index]
      const isTurn = connectorPath?.dataset.journeyTurn === 'true'
      const duration = isTurn ? TURN_ARRIVE : ARRIVE

      cursor += DOT_IN + HOLD

      tl.to(
        maskPath,
        {
          strokeDashoffset: 0,
          duration,
          ease: 'power2.inOut',
        },
        cursor,
      )

      cursor += duration + (isTurn ? TURN_BREATH : HOLD)
    })
  }

  return () => {
    tl.scrollTrigger?.kill()
    tl.kill()
    resetVisible(section)
  }
}
