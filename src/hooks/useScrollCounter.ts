import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function useScrollCounter() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const counters = gsap.utils.toArray<HTMLElement>('.count')
    if (!counters.length) return

    const cleanups: (() => void)[] = []

    counters.forEach((el, idx) => {
      const raw = el.getAttribute('data-target') || '0'
      const target = parseInt(String(raw).replace(/\D/g, ''), 10) || 0
      const customDuration = el.getAttribute('data-duration')
      const duration =
        customDuration != null && customDuration !== ''
          ? Number.parseFloat(customDuration) || Math.max(1, Math.min(3, (target / 200) * 2))
          : Math.max(1, Math.min(3, (target / 200) * 2))

      const delayAttr = el.getAttribute('data-delay')
      const delay =
        delayAttr != null && delayAttr !== ''
          ? Number.parseFloat(delayAttr) || 0
          : idx * 0.15

      const scrollStart = el.getAttribute('data-scroll-start') || 'top 80%'
      const scrollTriggerSelector = el.getAttribute('data-scroll-trigger')
      const triggerEl = scrollTriggerSelector
        ? document.querySelector<HTMLElement>(scrollTriggerSelector)
        : el

      if (!triggerEl) return

      el.textContent = ''

      const obj = { val: 0 }
      const tween = gsap.to(obj, {
        val: target,
        duration,
        ease: 'none',
        delay,
        paused: true,
        onUpdate: () => {
          el.textContent = Math.floor(obj.val).toLocaleString()
        },
        onComplete: () => {
          el.textContent = target.toLocaleString()
        },
      })

      const scrollTrigger = ScrollTrigger.create({
        trigger: triggerEl,
        start: scrollStart,
        once: true,
        onEnter: () => {
          tween.play()
        },
      })

      cleanups.push(() => {
        scrollTrigger.kill()
        tween.kill()
      })
    })

    ScrollTrigger.refresh()

    return () => {
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [])
}
