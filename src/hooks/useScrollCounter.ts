import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollCounter() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const counters = gsap.utils.toArray<HTMLElement>('.count')
    if (!counters.length) return

    counters.forEach((el, idx) => {
      const raw = el.getAttribute('data-target') || el.textContent || '0'
      const target = parseInt(String(raw).replace(/\D/g, ''), 10) || 0
      const duration = Math.max(1, Math.min(3, (target / 200) * 2))
      const obj = { val: 0 }

      gsap.to(obj, {
        val: target,
        duration,
        ease: 'none',
        delay: idx * 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toLocaleString()
        },
        onComplete: () => {
          el.textContent = target.toLocaleString()
        },
      })
    })
  }, [])
}
