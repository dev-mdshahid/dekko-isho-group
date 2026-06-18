import { useEffect } from 'react'
import { gsap } from 'gsap'

export function useInViewAnimation(selector = '[data-w-id]') {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector))
    if (!targets.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          gsap.to(entry.target, { opacity: 1, y: 0, duration: 0.5, ease: 'power1.out' })
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.15 },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}
