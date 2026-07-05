import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'
import { createCardCursorGlow } from '../lib/animations/sustainability/cardCursorGlow'
import { STAGGER_CARD_HIDE_EVENT, STAGGER_CARD_REVEAL_EVENT } from './useStaggeredGridReveal'

type Options = {
  onHoverChange?: (hovered: boolean) => void
}

export function useFocusCardAnimation(
  cardRef: RefObject<HTMLElement | null>,
  { onHoverChange }: Options = {},
) {
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const reduced = prefersReducedMotion()
    const canHover = window.matchMedia('(hover: hover)').matches
    const canTilt = canHover && !reduced

    const title = card.querySelector<HTMLElement>('.sustain-focus-card-title')
    const media = card.querySelector<HTMLElement>('.sustain-focus-card-media')
    const shine = card.querySelector<HTMLElement>('.sustain-focus-card-shine')
    const images = Array.from(
      card.querySelectorAll<HTMLElement>('.sustain-focus-card-image'),
    )

    const targets = [title, media, ...images].filter(Boolean) as HTMLElement[]

    gsap.killTweensOf([card, ...targets, shine].filter(Boolean))

    if (!reduced) {
      if (title) gsap.set(title, { opacity: 0, y: 22 })
      if (media) gsap.set(media, { scale: 1.08, opacity: 0.92 })
      if (images.length === 1) {
        images.forEach((image) => gsap.set(image, { scale: 1.14 }))
      }
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

      if (media) {
        tl.to(media, { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0)
      }

      if (images.length === 1) {
        tl.to(images, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0.05)
      }

      if (title) {
        tl.to(title, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.18)
      }
    }

    const hideCardContent = () => {
      revealed = false

      if (reduced) {
        gsap.set(targets, { clearProps: 'all' })
        if (shine) gsap.set(shine, { clearProps: 'all' })
        return
      }

      if (title) gsap.set(title, { opacity: 0, y: 22 })
      if (media) gsap.set(media, { scale: 1.08, opacity: 0.92 })
      if (images.length === 1) {
        images.forEach((image) => gsap.set(image, { scale: 1.14 }))
      }
    }

    const wrap = card.closest('.sustain-focus-card-wrap')

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
      onHoverChange?.(true)
      cursorGlow?.onEnter(event)

      gsap.to(card, {
        y: -3,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      if (media) {
        gsap.to(media, { scale: 1.03, duration: 0.7, ease: 'power2.out', overwrite: 'auto' })
      }

      if (shine) {
        gsap.fromTo(
          shine,
          { xPercent: -120, opacity: 0.85 },
          { xPercent: 120, opacity: 0, duration: 0.85, ease: 'power2.inOut', overwrite: 'auto' },
        )
      }

      if (title) {
        gsap.to(title, { y: -3, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
      }
    }

    const onLeave = () => {
      if (!canHover || reduced) return
      hovered = false
      card.classList.remove('is-hovered')
      onHoverChange?.(false)
      cursorGlow?.onLeave()

      gsap.to(card, {
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      })

      if (media) {
        gsap.to(media, { scale: 1, duration: 0.65, ease: 'power3.out', overwrite: 'auto' })
      }

      if (title) {
        gsap.to(title, { y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' })
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
      onHoverChange?.(false)
      cursorGlow?.kill()
      gsap.killTweensOf([card, ...targets, shine].filter(Boolean))
    }
  }, [cardRef, onHoverChange])
}
