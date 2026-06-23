import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
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
      gsap.to(el, { opacity: targetOpacity, y: 0, duration: 0.6, ease: 'power2.out', delay, overwrite: 'auto' })
      observer?.unobserve(el)
    }

    // Only touches elements that haven't been revealed yet — safe to call at any time.
    const revealVisible = () => {
      Array.from(scope.querySelectorAll<HTMLElement>('[data-fade-in]'))
        .filter((el) => el.dataset.fadeDone !== 'true' && isInViewport(el))
        .forEach(reveal)
    }

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
      // The CSS rule `[data-fade-in] { opacity: 0 }` already hides elements before JS runs,
      // so no rAF deferral is needed. Initialising synchronously (after first paint, which is
      // when useEffect fires) means the observer is live before the user can scroll.
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            reveal(entry.target as HTMLElement)
          })
        },
        // Generous margin catches elements that pass through the viewport quickly.
        { threshold: 0, rootMargin: '120px 0px 120px 0px' },
      )

      targets.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 24 })
        if (isInViewport(el)) {
          reveal(el)
        } else {
          observer?.observe(el)
        }
      })
    }

    // Scroll handler as a safety net: catches elements the observer may have missed
    // when the user scrolls faster than intersection callbacks can fire.
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScroll, { passive: true })

    return () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScroll)
    }
  }, [containerRef])
}
