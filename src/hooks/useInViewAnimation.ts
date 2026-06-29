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

/** Scroll-reveal for `[data-fade-in]` only — does not touch Webflow IX2 `data-w-id` targets. */
export function useInViewAnimation(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = containerRef?.current
    if (!scope) return

    let observer: IntersectionObserver | null = null
    let scrollRaf = 0

    const reveal = (el: HTMLElement) => {
      if (el.dataset.fadeDone === 'true') return
      el.dataset.fadeDone = 'true'
      const targetOpacity = el.classList.contains('industry-image-bg') ? 0.7 : 1
      const delayMs = Number.parseInt(el.dataset.fadeDelay ?? '0', 10)
      const delay = Number.isFinite(delayMs) ? delayMs / 1000 : 0
      const isSlideInBottom = el.dataset.fadeVariant === 'slide-in-bottom'

      gsap.to(el, {
        opacity: targetOpacity,
        y: 0,
        duration: isSlideInBottom ? 1 : 0.6,
        ease: isSlideInBottom ? 'power4.out' : 'power2.out',
        delay,
        overwrite: 'auto',
      })
      observer?.unobserve(el)
    }

    const revealVisible = (root?: Element, options?: RevealOptions) => {
      const queryRoot = (root ?? scope) as ParentNode
      Array.from(queryRoot.querySelectorAll<HTMLElement>('[data-fade-in]'))
        .filter((el) => {
          if (el.dataset.fadeDone === 'true') return false
          if (options?.forceInRoot) return true
          return isInViewport(el) || isNearViewport(el)
        })
        .forEach(reveal)
    }

    registerFadeInReveal(revealVisible)

    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        revealVisible()
      })
    }

    const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-fade-in]')).filter(
      (el) => el.dataset.fadeDone !== 'true',
    )

    if (targets.length) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            reveal(entry.target as HTMLElement)
          })
        },
        { threshold: 0, rootMargin: '120px 0px 120px 0px' },
      )

      targets.forEach((el) => {
        const isSlideInBottom = el.dataset.fadeVariant === 'slide-in-bottom'
        gsap.set(el, { opacity: 0, y: isSlideInBottom ? 80 : 24 })
        if (isInViewport(el) || isNearViewport(el)) {
          reveal(el)
        } else {
          observer?.observe(el)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScroll, { passive: true })

    return () => {
      unregisterFadeInReveal()
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScroll)
    }
  }, [containerRef])
}
