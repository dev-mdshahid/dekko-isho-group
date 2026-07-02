import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import type { MaterialBar } from '../data/sustainability/content'
import { percentDuration } from '../lib/animations/sustainability/percentDuration'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

const ROW_STAGGER = 0.1

type Options = {
  materials: MaterialBar[]
  maxPercentage: number
}

function formatMaterialPercentage(value: number) {
  return value.toFixed(2)
}

export function useMaterialsChartAnimation(
  cardRef: RefObject<HTMLElement | null>,
  { materials, maxPercentage }: Options,
) {
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const reduced = prefersReducedMotion()
    const rows = Array.from(card.querySelectorAll<HTMLElement>('.sustain-material-bar-row'))

    let revealed = false
    let observer: IntersectionObserver | null = null
    const tweens: gsap.core.Tween[] = []

    const rowTargets = rows.map((row, index) => {
      const material = materials[index]
      const fill = row.querySelector<HTMLElement>('.sustain-material-bar-fill')
      const valueNum = row.querySelector<HTMLElement>('.sustain-material-bar-value-num')
      const barWidth = material ? (material.percentage / maxPercentage) * 100 : 0
      const targetPercentage = material?.percentage ?? 0

      return { fill, valueNum, barWidth, targetPercentage }
    })

    const setFinalState = () => {
      rowTargets.forEach(({ fill, valueNum, barWidth, targetPercentage }) => {
        if (fill) gsap.set(fill, { width: `${barWidth}%` })
        if (valueNum) valueNum.textContent = formatMaterialPercentage(targetPercentage)
      })
    }

    const setHiddenState = () => {
      rowTargets.forEach(({ fill, valueNum }) => {
        if (fill) gsap.set(fill, { width: '0%' })
        if (valueNum) valueNum.textContent = '0.00'
      })
    }

    const killAnimations = () => {
      tweens.forEach((tween) => tween.kill())
      tweens.length = 0
    }

    const runAnimations = () => {
      killAnimations()
      setHiddenState()

      if (reduced) {
        setFinalState()
        return
      }

      rowTargets.forEach(({ fill, valueNum, barWidth, targetPercentage }, index) => {
        const delay = index * ROW_STAGGER
        const duration = percentDuration(targetPercentage)
        const counter = { val: 0 }

        if (fill) {
          tweens.push(
            gsap.to(fill, {
              width: `${barWidth}%`,
              duration,
              delay,
              ease: 'power2.out',
            }),
          )
        }

        tweens.push(
          gsap.to(counter, {
            val: targetPercentage,
            duration,
            delay,
            ease: 'power2.out',
            onUpdate: () => {
              if (valueNum) valueNum.textContent = formatMaterialPercentage(counter.val)
            },
            onComplete: () => {
              if (valueNum) valueNum.textContent = formatMaterialPercentage(targetPercentage)
            },
          }),
        )
      })
    }

    const revealCard = () => {
      if (revealed) return
      revealed = true
      runAnimations()
    }

    const hideCard = () => {
      revealed = false
      killAnimations()
      if (reduced) {
        setFinalState()
        return
      }
      setHiddenState()
    }

    setHiddenState()

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealCard()
          else hideCard()
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px 60px 0px' },
    )

    observer.observe(card)

    return () => {
      observer?.disconnect()
      killAnimations()
      gsap.killTweensOf(rowTargets.flatMap(({ fill, valueNum }) => [fill, valueNum].filter(Boolean)))
    }
  }, [cardRef, materials, maxPercentage])
}
