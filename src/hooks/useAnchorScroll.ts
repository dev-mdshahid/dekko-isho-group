import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { revealFadeIns } from '../lib/fadeInReveal'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

function getScrollPositionForTarget(target: HTMLElement): number | HTMLElement {
  const trigger = ScrollTrigger.getAll().find((st) => {
    const el = st.trigger as HTMLElement | undefined
    return el && (el === target || el.contains(target) || target.contains(el))
  })

  if (trigger) return trigger.start
  return target
}

function afterAnchorScroll(target: HTMLElement) {
  ScrollTrigger.refresh()

  const reveal = () => {
    revealFadeIns(target)
    const header = target.querySelector('.about-info')
    if (header) revealFadeIns(header, { forceInRoot: true })
  }

  requestAnimationFrame(() => {
    reveal()
    requestAnimationFrame(reveal)
  })
}

/** Smooth in-page anchor scrolling that cooperates with ScrollTrigger pin sections. */
export function useAnchorScroll(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a')
      if (!anchor || !container.contains(anchor)) return

      const href = anchor.getAttribute('href')
      if (!href?.startsWith('#') || href.length < 2) return

      const target = document.getElementById(href.slice(1))
      if (!target) return

      event.preventDefault()

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const scrollTarget = getScrollPositionForTarget(target)

      gsap.killTweensOf(window)

      if (reducedMotion) {
        gsap.to(window, {
          scrollTo: { y: scrollTarget, autoKill: false },
          duration: 0,
          onComplete: () => {
            history.pushState(null, '', href)
            afterAnchorScroll(target)
          },
        })
        return
      }

      gsap.to(window, {
        scrollTo: { y: scrollTarget, autoKill: true },
        duration: 1.1,
        ease: 'power2.inOut',
        onComplete: () => {
          history.pushState(null, '', href)
          afterAnchorScroll(target)
        },
      })
    }

    container.addEventListener('click', onClick)
    return () => container.removeEventListener('click', onClick)
  }, [containerRef])
}
