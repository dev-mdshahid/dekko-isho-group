import { type RefObject, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { initAboutAnimations } from '../lib/animations/home/about'
import { initCompanyAnimations } from '../lib/animations/home/company'
import { initContactAnimations } from '../lib/animations/home/contact'
import { initHeroAnimations } from '../lib/animations/home/hero'
import { initServiceStackAnimations } from '../lib/animations/home/service'
import { initSolutionsDecorParallax } from '../lib/animations/home/solutions'

/** GSAP ScrollTrigger animations for the homepage landing sections. */
export function useHomeAnimations(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = containerRef.current
    if (!scope) return

    let resizeTimer = 0
    let disposed = false
    const cleanups: (() => void)[] = []

    const frame = requestAnimationFrame(() => {
      if (disposed || !containerRef.current) return

      cleanups.push(initHeroAnimations(scope))
      cleanups.push(initSolutionsDecorParallax(scope))
      cleanups.push(initAboutAnimations(scope))
      cleanups.push(initServiceStackAnimations(scope))
      cleanups.push(initCompanyAnimations(scope))
      cleanups.push(initContactAnimations(scope))

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
