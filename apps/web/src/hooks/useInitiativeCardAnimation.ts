import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'
import { createCardCursorGlow } from '../lib/animations/sustainability/cardCursorGlow'
import { STAGGER_CARD_HIDE_EVENT, STAGGER_CARD_REVEAL_EVENT } from './useStaggeredGridReveal'

type Options = {
  index?: number
}

export function useInitiativeCardAnimation(cardRef: RefObject<HTMLElement | null>, _options: Options = {}) {
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const reduced = prefersReducedMotion()
    const canHover = window.matchMedia('(hover: hover)').matches
    const canTilt = canHover && !reduced

    const image = card.querySelector<HTMLElement>('.sustain-initiative-image')
    const shine = card.querySelector<HTMLElement>('.sustain-initiative-shine')
    const number = card.querySelector<HTMLElement>('.sustain-initiative-number')
    const title = card.querySelector<HTMLElement>('.sustain-initiative-title')
    const description = card.querySelector<HTMLElement>('.sustain-initiative-description')
    const metric = card.querySelector<HTMLElement>('.sustain-initiative-metric')
    const metricValue = card.querySelector<HTMLElement>('.sustain-initiative-metric-value')
    const metricLine = card.querySelector<HTMLElement>('.sustain-initiative-metric-line')

    const targets = [image, number, title, description, metric, metricLine, metricValue].filter(
      Boolean,
    ) as HTMLElement[]

    gsap.killTweensOf([card, ...targets, shine].filter(Boolean))

    if (!reduced) {
      if (image) gsap.set(image, { scale: 1.14 })
      if (number) gsap.set(number, { scale: 0.6, opacity: 0, y: 8 })
      if (title) gsap.set(title, { opacity: 0, y: 22 })
      if (description) gsap.set(description, { opacity: 0, y: 18 })
      if (metricLine) gsap.set(metricLine, { scaleX: 0, transformOrigin: 'left center' })
      if (metric) gsap.set(metric, { opacity: 0, y: 14 })
      if (metricValue) gsap.set(metricValue, { scale: 0.92 })
    }

    let revealed = false
    let hovered = false
    const cursorGlow = createCardCursorGlow(card)

    const revealCard = () => {
      if (revealed) return
      revealed = true

      if (reduced) {
        gsap.set(targets, { clearProps: 'all' })
        if (shine) gsap.set(shine, { clearProps: 'all' })
        return
      }

      const tl = gsap.timeline()

      if (image) {
        tl.to(image, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0)
      }

      if (number) {
        tl.to(
          number,
          { scale: 1, opacity: 1, y: 0, duration: 0.55, ease: 'back.out(2)' },
          0.12,
        )
      }

      if (title) {
        tl.to(title, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.2)
      }

      if (description) {
        tl.to(description, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.28)
      }

      if (metricLine) {
        tl.to(metricLine, { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }, 0.38)
      }

      if (metric) {
        tl.to(metric, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.44)
      }

      if (metricValue) {
        tl.to(metricValue, { scale: 1, duration: 0.5, ease: 'back.out(1.6)' }, 0.5)
      }
    }

    const hideCardContent = () => {
      revealed = false

      if (reduced) {
        gsap.set(targets, { clearProps: 'all' })
        if (shine) gsap.set(shine, { clearProps: 'all' })
        return
      }

      if (image) gsap.set(image, { scale: 1.14 })
      if (number) gsap.set(number, { scale: 0.6, opacity: 0, y: 8 })
      if (title) gsap.set(title, { opacity: 0, y: 22 })
      if (description) gsap.set(description, { opacity: 0, y: 18 })
      if (metricLine) gsap.set(metricLine, { scaleX: 0, transformOrigin: 'left center' })
      if (metric) gsap.set(metric, { opacity: 0, y: 14 })
      if (metricValue) gsap.set(metricValue, { scale: 0.92 })
    }

    const wrap = card.closest('.sustain-initiative-card-wrap')

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

      if (image) {
        gsap.to(image, { scale: 1.08, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
      }

      if (shine) {
        gsap.fromTo(
          shine,
          { xPercent: -120, opacity: 0.85 },
          { xPercent: 120, opacity: 0, duration: 0.85, ease: 'power2.inOut', overwrite: 'auto' },
        )
      }

      if (number) {
        gsap.to(number, {
          scale: 1.12,
          y: -2,
          duration: 0.45,
          ease: 'back.out(2)',
          overwrite: 'auto',
        })
      }

      if (title) {
        gsap.to(title, { y: -3, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      }

      if (metricValue) {
        gsap.to(metricValue, {
          scale: 1.06,
          duration: 0.4,
          ease: 'back.out(1.8)',
          overwrite: 'auto',
        })
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

      if (image) {
        gsap.to(image, { scale: 1, duration: 0.65, ease: 'power3.out', overwrite: 'auto' })
      }

      if (number) {
        gsap.to(number, { scale: 1, y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      }

      if (title) {
        gsap.to(title, { y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      }

      if (metricValue) {
        gsap.to(metricValue, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
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
        rotateY: x * 7,
        rotateX: -y * 5,
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
      gsap.killTweensOf([card, ...targets, shine].filter(Boolean))
    }
  }, [cardRef])
}
