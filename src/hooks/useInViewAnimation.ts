import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0
}

/** Scroll-reveal for `[data-fade-in]` only — does not touch Webflow IX2 `data-w-id` targets. */
export function useInViewAnimation(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let frame = 0
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

    // Only checks elements that haven't been revealed yet — safe to call any time.
    const revealVisible = () => {
      const scope = containerRef?.current
      if (!scope) return
      Array.from(scope.querySelectorAll<HTMLElement>('[data-fade-in]'))
        .filter((el) => el.dataset.fadeDone !== 'true')
        .forEach((el) => {
          if (isInViewport(el)) reveal(el)
        })
    }

    const onScroll = () => {
      if (scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        revealVisible()
      })
    }

    // Defer init by one frame so the browser paints the initial hidden state first
    // (prevents a flash of visible→hidden→animated content on load).
    frame = requestAnimationFrame(() => {
      const scope = containerRef?.current
      if (!scope) return

      const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-fade-in]')).filter(
        (el) => el.dataset.fadeDone !== 'true',
      )

      if (!targets.length) return

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            reveal(entry.target as HTMLElement)
          })
        },
        // Wider margin catches elements that pass through the viewport quickly.
        { threshold: 0, rootMargin: '100px 0px 100px 0px' },
      )

      targets.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 24 })
        if (isInViewport(el)) {
          reveal(el)
        } else {
          observer?.observe(el)
        }
      })
    })

    // Scroll listener catches elements missed by the observer during fast scrolling.
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      observer?.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScroll)
    }
  }, [containerRef])
}
