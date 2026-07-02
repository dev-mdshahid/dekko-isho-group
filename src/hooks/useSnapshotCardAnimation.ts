import { type RefObject, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'
import { createCardCursorGlow } from '../lib/animations/sustainability/cardCursorGlow'
import { STAGGER_CARD_HIDE_EVENT, STAGGER_CARD_REVEAL_EVENT } from './useStaggeredGridReveal'

type Options = {
  percentage?: number
  statTarget?: number
  statDuration?: number
  onGaugeUpdate?: (value: number) => void
}

function gaugeDuration(percentage: number) {
  return Math.max(2, Math.min(4, 1.5 + (percentage / 100) * 2))
}

export function useSnapshotCardAnimation(
  cardRef: RefObject<HTMLElement | null>,
  { percentage, statTarget, statDuration = 4.5, onGaugeUpdate }: Options = {},
) {
  const gaugeUpdateRef = useRef(onGaugeUpdate)
  gaugeUpdateRef.current = onGaugeUpdate

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const reduced = prefersReducedMotion()
    const canHover = window.matchMedia('(hover: hover)').matches
    const canTilt = canHover && !reduced

    const shine = card.querySelector<HTMLElement>('.sustain-snapshot-shine')
    const valueAccent = card.querySelector<HTMLElement>('.sustain-snapshot-card-value-accent')
    const valueSuffix = card.querySelector<HTMLElement>('.sustain-snapshot-card-value-suffix')
    const label = card.querySelector<HTMLElement>('.sustain-snapshot-card-label')
    const gaugeWrap = card.querySelector<HTMLElement>('.sustain-snapshot-gauge-wrap')
    const body = card.querySelector<HTMLElement>('.sustain-snapshot-card-body')
    const counter = card.querySelector<HTMLElement>('.sustain-snapshot-stat-value')

    const contentTargets = [valueAccent, valueSuffix, label, gaugeWrap, body].filter(
      Boolean,
    ) as HTMLElement[]

    gsap.killTweensOf([card, ...contentTargets, shine].filter(Boolean))

    let revealed = false
    let hovered = false
    let gaugeTween: gsap.core.Tween | null = null
    let counterTween: gsap.core.Tween | null = null
    const cursorGlow = createCardCursorGlow(card)

    const setGaugeValue = (value: number) => {
      gaugeUpdateRef.current?.(value)
    }

    const setHiddenState = () => {
      if (reduced) return

      if (valueAccent) gsap.set(valueAccent, { opacity: 0, y: 24, scale: 0.92 })
      if (valueSuffix) gsap.set(valueSuffix, { opacity: 0, y: 18 })
      if (label) gsap.set(label, { opacity: 0, y: 16 })
      if (gaugeWrap) gsap.set(gaugeWrap, { opacity: 0, scale: 0.88, y: 12 })
      if (body && !gaugeWrap) gsap.set(body, { opacity: 0, y: 12 })
    }

    setHiddenState()

    const killDataAnimations = () => {
      gaugeTween?.kill()
      gaugeTween = null
      counterTween?.kill()
      counterTween = null
    }

    const runGaugeAnimation = () => {
      if (percentage == null) return

      killDataAnimations()
      const obj = { val: 0 }
      setGaugeValue(0)
      gaugeTween = gsap.to(obj, {
        val: percentage,
        duration: gaugeDuration(percentage),
        ease: 'power2.out',
        onUpdate: () => setGaugeValue(obj.val),
        onComplete: () => setGaugeValue(percentage),
      })
    }

    const runCounterAnimation = () => {
      if (statTarget == null || !counter) return

      killDataAnimations()
      counter.textContent = '0'

      const obj = { val: 0 }
      counterTween = gsap.to(obj, {
        val: statTarget,
        duration: statDuration,
        ease: 'none',
        onUpdate: () => {
          counter.textContent = Math.floor(obj.val).toLocaleString()
        },
        onComplete: () => {
          counter.textContent = statTarget.toLocaleString()
        },
      })
    }

    const revealCard = () => {
      if (revealed) return
      revealed = true

      if (reduced) {
        gsap.set(contentTargets, { clearProps: 'all' })
        if (shine) gsap.set(shine, { clearProps: 'all' })
        setGaugeValue(percentage ?? 0)
        if (counter && statTarget != null) {
          counter.textContent = statTarget.toLocaleString()
        }
        return
      }

      const tl = gsap.timeline()

      if (gaugeWrap) {
        tl.to(gaugeWrap, { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power3.out' }, 0)
      } else if (body) {
        tl.to(body, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0)
      }

      if (valueAccent) {
        tl.to(
          valueAccent,
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.6)' },
          gaugeWrap ? 0.18 : 0.1,
        )
      }

      if (valueSuffix) {
        tl.to(valueSuffix, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, gaugeWrap ? 0.24 : 0.18)
      }

      if (label) {
        tl.to(label, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, gaugeWrap ? 0.32 : 0.26)
      }

      tl.add(() => {
        runGaugeAnimation()
        runCounterAnimation()
      }, gaugeWrap ? 0.2 : 0.12)
    }

    const hideCardContent = () => {
      revealed = false
      killDataAnimations()

      if (reduced) {
        gsap.set(contentTargets, { clearProps: 'all' })
        if (shine) gsap.set(shine, { clearProps: 'all' })
        return
      }

      setHiddenState()
      setGaugeValue(0)
      if (counter) counter.textContent = ''
    }

    const wrap = card.closest('.sustain-snapshot-card-wrap')

    const onWrapReveal = () => revealCard()
    const onWrapHide = () => hideCardContent()

    if (wrap?.classList.contains('is-revealed')) {
      revealCard()
    } else {
      wrap?.addEventListener(STAGGER_CARD_REVEAL_EVENT, onWrapReveal)
    }

    wrap?.addEventListener(STAGGER_CARD_HIDE_EVENT, onWrapHide)

    const onEnter = (event: PointerEvent) => {
      if (!canHover || reduced) return
      hovered = true
      card.classList.add('is-hovered')
      cursorGlow?.onEnter(event)

      gsap.to(card, {
        y: -3,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      if (shine) {
        gsap.fromTo(
          shine,
          { xPercent: -120, opacity: 0.7 },
          { xPercent: 120, opacity: 0, duration: 0.85, ease: 'power2.inOut', overwrite: 'auto' },
        )
      }

      if (valueAccent) {
        gsap.to(valueAccent, {
          scale: 1.06,
          duration: 0.4,
          ease: 'back.out(1.8)',
          overwrite: 'auto',
        })
      }

      if (gaugeWrap) {
        gsap.to(gaugeWrap, {
          scale: 1.03,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      if (label) {
        gsap.to(label, { y: -2, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      }
    }

    const onLeave = () => {
      if (!canHover || reduced) return
      hovered = false
      card.classList.remove('is-hovered')
      cursorGlow?.onLeave()

      gsap.to(card, {
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      if (valueAccent) {
        gsap.to(valueAccent, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
      }

      if (gaugeWrap) {
        gsap.to(gaugeWrap, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
      }

      if (label) {
        gsap.to(label, { y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      }
    }

    const onMove = (event: PointerEvent) => {
      if (!hovered) return

      cursorGlow?.onMove(event)

      if (!canTilt) return

      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5

      gsap.to(card, {
        rotateY: x * 6,
        rotateX: -y * 4,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
        transformPerspective: 900,
      })
    }

    if (canHover && !reduced) {
      card.addEventListener('pointerenter', onEnter)
      card.addEventListener('pointerleave', onLeave)
      card.addEventListener('pointermove', onMove)
    }

    return () => {
      wrap?.removeEventListener(STAGGER_CARD_REVEAL_EVENT, onWrapReveal)
      wrap?.removeEventListener(STAGGER_CARD_HIDE_EVENT, onWrapHide)
      card.removeEventListener('pointerenter', onEnter)
      card.removeEventListener('pointerleave', onLeave)
      card.removeEventListener('pointermove', onMove)
      card.classList.remove('is-hovered')
      cursorGlow?.kill()
      killDataAnimations()
      gsap.killTweensOf([card, ...contentTargets, shine].filter(Boolean))
    }
  }, [cardRef, percentage, statTarget, statDuration])
}
