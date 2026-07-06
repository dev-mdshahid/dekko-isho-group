import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import {
  formatPerformanceStatValue,
  parsePerformanceStat,
  performanceStatDuration,
} from '../lib/animations/sustainability/performanceStatFormat'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

const STAT_VALUE_SELECTOR = '.sustain-progress-stat-value'
const STAT_NUM_SELECTOR = '.sustain-progress-stat-value-num'

export function usePerformanceSnapshotAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduced = prefersReducedMotion()
    const statValues = Array.from(section.querySelectorAll<HTMLElement>(STAT_VALUE_SELECTOR))

    if (!statValues.length) return

    const statConfigs = statValues.map((statValueEl) => {
      const rawValue = statValueEl.dataset.statValue ?? ''
      const parsed = parsePerformanceStat(rawValue)
      const numEl = statValueEl.querySelector<HTMLElement>(STAT_NUM_SELECTOR)

      return { statValueEl, numEl, parsed, rawValue }
    })

    let revealed = false
    let observer: IntersectionObserver | null = null
    const tweens: gsap.core.Tween[] = []

    const setFinalStates = () => {
      statConfigs.forEach(({ numEl, rawValue }) => {
        if (numEl) numEl.textContent = rawValue
      })
    }

    const killAnimations = () => {
      tweens.forEach((tween) => tween.kill())
      tweens.length = 0
    }

    const runAnimations = () => {
      killAnimations()

      if (reduced) {
        setFinalStates()
        return
      }

      statConfigs.forEach(({ numEl, parsed }, index) => {
        if (!numEl) return

        numEl.textContent = formatPerformanceStatValue(0, parsed)

        const counter = { val: 0 }
        tweens.push(
          gsap.to(counter, {
            val: parsed.target,
            duration: performanceStatDuration(parsed.target),
            delay: index * 0.08,
            ease: 'power2.out',
            onUpdate: () => {
              numEl.textContent = formatPerformanceStatValue(counter.val, parsed)
            },
            onComplete: () => {
              numEl.textContent = formatPerformanceStatValue(parsed.target, parsed)
            },
          }),
        )
      })
    }

    if (reduced) {
      setFinalStates()
      return
    }

    statConfigs.forEach(({ numEl, parsed }) => {
      if (numEl) numEl.textContent = formatPerformanceStatValue(0, parsed)
    })

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || revealed) return
          revealed = true
          runAnimations()
          observer?.disconnect()
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px 60px 0px' },
    )

    observer.observe(section)

    return () => {
      observer?.disconnect()
      killAnimations()
    }
  }, [sectionRef])
}
