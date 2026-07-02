import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

export const STAGGER_CARD_REVEAL_EVENT = 'stagger-card-reveal'
export const STAGGER_CARD_HIDE_EVENT = 'stagger-card-hide'

/** @deprecated Use STAGGER_CARD_REVEAL_EVENT */
export const INITIATIVE_CARD_REVEAL_EVENT = STAGGER_CARD_REVEAL_EVENT
/** @deprecated Use STAGGER_CARD_HIDE_EVENT */
export const INITIATIVE_CARD_HIDE_EVENT = STAGGER_CARD_HIDE_EVENT

const STAGGER_S = 0.12
const REVEAL_DURATION = 1.1
const HIDDEN_Y = 100

export function useStaggeredGridReveal(
  gridRef: RefObject<HTMLElement | null>,
  wrapSelector: string,
) {
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const wraps = Array.from(grid.querySelectorAll<HTMLElement>(wrapSelector))
    if (!wraps.length) return

    const reduced = prefersReducedMotion()
    let revealed = false
    let observer: IntersectionObserver | null = null
    const tweens: gsap.core.Tween[] = []

    const hideWraps = () => {
      revealed = false
      tweens.forEach((t) => t.kill())
      tweens.length = 0

      if (reduced) {
        gsap.set(wraps, { clearProps: 'all' })
        wraps.forEach((wrap) => {
          wrap.classList.remove('is-revealed')
          wrap.dispatchEvent(new CustomEvent(STAGGER_CARD_HIDE_EVENT))
        })
        return
      }

      gsap.set(wraps, { opacity: 0, y: HIDDEN_Y })
      wraps.forEach((wrap) => {
        wrap.classList.remove('is-revealed')
        wrap.dispatchEvent(new CustomEvent(STAGGER_CARD_HIDE_EVENT))
      })
    }

    const revealGrid = () => {
      if (revealed) return
      revealed = true

      if (reduced) {
        wraps.forEach((wrap) => {
          wrap.classList.add('is-revealed')
          wrap.dispatchEvent(new CustomEvent(STAGGER_CARD_REVEAL_EVENT))
        })
        return
      }

      wraps.forEach((wrap, index) => {
        const tween = gsap.to(wrap, {
          opacity: 1,
          y: 0,
          duration: REVEAL_DURATION,
          ease: 'power4.out',
          delay: index * STAGGER_S,
          onStart: () => {
            wrap.classList.add('is-revealed')
            wrap.dispatchEvent(new CustomEvent(STAGGER_CARD_REVEAL_EVENT))
          },
        })
        tweens.push(tween)
      })
    }

    hideWraps()

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealGrid()
          else hideWraps()
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px 80px 0px' },
    )

    observer.observe(grid)

    return () => {
      observer?.disconnect()
      tweens.forEach((t) => t.kill())
      gsap.killTweensOf(wraps)
    }
  }, [gridRef, wrapSelector])
}

export function useInitiativeGridReveal(gridRef: RefObject<HTMLElement | null>) {
  useStaggeredGridReveal(gridRef, '.sustain-initiative-card-wrap')
}

export function useSnapshotGridReveal(gridRef: RefObject<HTMLElement | null>) {
  useStaggeredGridReveal(gridRef, '.sustain-snapshot-card-wrap')
}
