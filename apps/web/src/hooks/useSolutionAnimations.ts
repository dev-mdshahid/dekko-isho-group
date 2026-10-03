import { type RefObject, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initSolutionCardAnimations } from '../lib/animations/solutions/cards'
import { initSolutionMediaAnimations } from '../lib/animations/solutions/media'

/** GSAP ScrollTrigger animations for solution page sections. */
export function useSolutionAnimations(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = containerRef.current
    if (!scope) return

    let resizeTimer = 0
    let disposed = false
    const cleanups: (() => void)[] = []

    const frame = requestAnimationFrame(() => {
      if (disposed || !containerRef.current) return

      cleanups.push(initSolutionCardAnimations(scope))
      cleanups.push(initSolutionMediaAnimations(scope))

      ScrollTrigger.refresh()
    })

    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh()
      }, 200)
    }

    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      cleanups.forEach((cleanup) => cleanup())
    }
  }, [containerRef])
}
