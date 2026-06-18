import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0
}

export function useInViewAnimation(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let frame = 0

    const reveal = (el: HTMLElement) => {
      if (el.dataset.fadeDone === 'true') return
      el.dataset.fadeDone = 'true'
      gsap.to(el, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    }

    frame = requestAnimationFrame(() => {
      const scope = containerRef?.current
      if (!scope) return

      const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-w-id]')).filter(
        (el) => el.dataset.fadeDone !== 'true',
      )

      if (!targets.length) return

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            reveal(entry.target as HTMLElement)
            observer?.unobserve(entry.target)
          })
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
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

    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [containerRef])
}
