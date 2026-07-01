import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import { registerFadeInReveal, unregisterFadeInReveal } from '../lib/fadeInReveal'
import type { RevealOptions } from '../lib/fadeInReveal'

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

/** Generous bounds for elements that pass through view quickly (anchor jumps, fast scroll). */
function isNearViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const margin = Math.max(120, window.innerHeight * 0.25)
  return rect.top < window.innerHeight + margin && rect.bottom > -margin
}

/** Hidden offset for a target — larger = more noticeable travel on reveal. */
function hiddenY(el: HTMLElement) {
  return el.dataset.fadeVariant === 'slide-in-bottom' ? 100 : 44
}

/** Scroll-reveal for `[data-fade-in]` only — does not touch Webflow IX2 `data-w-id` targets. */
export function useInViewAnimation(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = containerRef?.current
    if (!scope) return

    let observer: IntersectionObserver | null = null

    /** Reset a target to its hidden state so it replays the next time it enters view. */
    const hide = (el: HTMLElement) => {
      if (el.dataset.fadeState === 'out') return
      el.dataset.fadeState = 'out'
      gsap.killTweensOf(el)
      gsap.set(el, { opacity: 0, y: hiddenY(el) })
    }

    const reveal = (el: HTMLElement) => {
      if (el.dataset.fadeState === 'in') return
      el.dataset.fadeState = 'in'
      const targetOpacity = el.classList.contains('industry-image-bg') ? 0.7 : 1
      const delayMs = Number.parseInt(el.dataset.fadeDelay ?? '0', 10)
      const delay = Number.isFinite(delayMs) ? delayMs / 1000 : 0
      const isSlideInBottom = el.dataset.fadeVariant === 'slide-in-bottom'

      gsap.to(el, {
        opacity: targetOpacity,
        y: 0,
        duration: isSlideInBottom ? 1.5 : 1.0,
        ease: isSlideInBottom ? 'power4.out' : 'power2.out',
        delay,
        overwrite: 'auto',
      })
    }

    const revealVisible = (root?: Element, options?: RevealOptions) => {
      const queryRoot = (root ?? scope) as ParentNode
      Array.from(queryRoot.querySelectorAll<HTMLElement>('[data-fade-in]'))
        .filter((el) => {
          if (el.dataset.fadeState === 'in') return false
          if (options?.forceInRoot) return true
          return isInViewport(el) || isNearViewport(el)
        })
        .forEach(reveal)
    }

    registerFadeInReveal(revealVisible)

    const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-fade-in]'))

    if (targets.length) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement
            if (entry.isIntersecting) reveal(el)
            else hide(el)
          })
        },
        { threshold: 0, rootMargin: '0px 0px -10% 0px' },
      )

      targets.forEach((el) => {
        gsap.set(el, { opacity: 0, y: hiddenY(el) })
        el.dataset.fadeState = 'out'
        observer?.observe(el)
      })
    }

    return () => {
      unregisterFadeInReveal()
      observer?.disconnect()
    }
  }, [containerRef])
}
