import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'

import { prefersReducedMotion } from '../../lib/animations/prefersReducedMotion'
import { setLenis } from '../../lib/smoothScroll'

/** Inertial wheel scrolling — page eases with scroll input instead of native 1:1 jumps. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      autoRaf: false,
    })

    setLenis(lenis)

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      cancelAnimationFrame(frame)
      gsap.ticker.remove(ticker)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return null
}
