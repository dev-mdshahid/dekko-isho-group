import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type StickyHorizontalScrollOptions = {
  /** Pinned panel — used as both ScrollTrigger trigger and pin target. */
  panelRef: RefObject<HTMLElement | null>
  /** Horizontally moving track inside the viewport. */
  trackRef: RefObject<HTMLElement | null>
}

/** Pins a section and maps vertical scroll progress to horizontal track movement. */
export function useStickyHorizontalScroll({
  panelRef,
  trackRef,
}: StickyHorizontalScrollOptions) {
  useEffect(() => {
    const panel = panelRef.current
    const track = trackRef.current
    const viewport = track?.parentElement

    if (!panel || !track || !viewport) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    let tween: gsap.core.Tween | undefined
    let initFrame = 0
    let cancelled = false

    const getMaxScroll = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh()
    }

    const init = () => {
      if (cancelled) return

      ScrollTrigger.refresh()
      const maxScroll = getMaxScroll()
      if (maxScroll <= 0) return

      tween = gsap.to(track, {
        x: () => -getMaxScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          pin: true,
          start: 'top top',
          end: () => `+=${getMaxScroll()}`,
          scrub: true,
          invalidateOnRefresh: true,
          anticipatePin: 0,
        },
      })

      ScrollTrigger.refresh()
    }

    // Defer until route scroll reset + first layout pass have settled.
    initFrame = requestAnimationFrame(() => {
      initFrame = requestAnimationFrame(init)
    })

    const images = Array.from(track.querySelectorAll('img'))
    images.forEach((image) => {
      if (!image.complete) {
        image.addEventListener('load', refresh, { once: true })
      }
    })

    window.addEventListener('resize', refresh)

    return () => {
      cancelled = true
      if (initFrame) cancelAnimationFrame(initFrame)
      window.removeEventListener('resize', refresh)
      tween?.scrollTrigger?.kill(true)
      tween?.kill()
      gsap.set(track, { clearProps: 'transform' })
    }
  }, [panelRef, trackRef])
}
