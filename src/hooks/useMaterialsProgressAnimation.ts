import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import { percentDuration } from '../lib/animations/sustainability/percentDuration'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

type Options = {
  sustainablePercentage: number
}

export function useMaterialsProgressAnimation(
  cardRef: RefObject<HTMLElement | null>,
  { sustainablePercentage }: Options,
) {
  const conventionalPercentage = 100 - sustainablePercentage

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const reduced = prefersReducedMotion()
    const valueNum = card.querySelector<HTMLElement>('.sustain-materials-progress-value-num')
    const barFill = card.querySelector<HTMLElement>('.sustain-progress-bar-fill')
    const legendPrimary = card.querySelector<HTMLElement>('.sustain-progress-legend-pct--primary')
    const legendMuted = card.querySelector<HTMLElement>('.sustain-progress-legend-pct--muted')

    let revealed = false
    let observer: IntersectionObserver | null = null
    const tweens: gsap.core.Tween[] = []

    const setFinalState = () => {
      if (valueNum) valueNum.textContent = String(sustainablePercentage)
      if (legendPrimary) legendPrimary.textContent = String(sustainablePercentage)
      if (legendMuted) legendMuted.textContent = String(conventionalPercentage)
      if (barFill) gsap.set(barFill, { width: `${sustainablePercentage}%` })
    }

    const setHiddenState = () => {
      if (valueNum) valueNum.textContent = '0'
      if (legendPrimary) legendPrimary.textContent = '0'
      if (legendMuted) legendMuted.textContent = '0'
      if (barFill) gsap.set(barFill, { width: '0%' })
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

      const duration = percentDuration(sustainablePercentage)
      const sustainable = { val: 0 }
      const conventional = { val: 0 }

      if (barFill) {
        tweens.push(
          gsap.to(barFill, {
            width: `${sustainablePercentage}%`,
            duration,
            ease: 'power2.out',
          }),
        )
      }

      tweens.push(
        gsap.to(sustainable, {
          val: sustainablePercentage,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            const rounded = Math.round(sustainable.val)
            if (valueNum) valueNum.textContent = String(rounded)
            if (legendPrimary) legendPrimary.textContent = String(rounded)
          },
          onComplete: () => {
            if (valueNum) valueNum.textContent = String(sustainablePercentage)
            if (legendPrimary) legendPrimary.textContent = String(sustainablePercentage)
          },
        }),
      )

      tweens.push(
        gsap.to(conventional, {
          val: conventionalPercentage,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            if (legendMuted) legendMuted.textContent = String(Math.round(conventional.val))
          },
          onComplete: () => {
            if (legendMuted) legendMuted.textContent = String(conventionalPercentage)
          },
        }),
      )
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
      gsap.killTweensOf([barFill, valueNum, legendPrimary, legendMuted].filter(Boolean))
    }
  }, [cardRef, sustainablePercentage, conventionalPercentage])
}
