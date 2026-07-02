import { type RefObject, useEffect } from 'react'

import { revealFadeIns } from '../lib/fadeInReveal'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'
import { getLenis, scrollToElement } from '../lib/smoothScroll'

function afterAnchorScroll(target: HTMLElement) {
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

/** Smooth in-page anchor scrolling for hash links. */
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

      const reducedMotion = prefersReducedMotion()
      const lenis = getLenis()

      if (lenis) {
        lenis.scrollTo(target, {
          immediate: reducedMotion,
          duration: reducedMotion ? undefined : 1.1,
          onComplete: () => {
            history.pushState(null, '', href)
            afterAnchorScroll(target)
          },
        })
        return
      }

      scrollToElement(target, {
        immediate: reducedMotion,
        duration: reducedMotion ? undefined : 1.1,
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
