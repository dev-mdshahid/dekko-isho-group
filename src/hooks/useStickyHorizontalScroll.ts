import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type StickyHorizontalScrollOptions = {
  /** Element that defines the scroll range and receives the pin spacer. */
  triggerRef: RefObject<HTMLElement | null>
  /** Element to keep fixed while scrolling through the horizontal track. */
  pinRef: RefObject<HTMLElement | null>
  /** Horizontally moving track inside the viewport. */
  trackRef: RefObject<HTMLElement | null>
}

/** Pins a section and maps vertical scroll progress to horizontal track movement. */
export function useStickyHorizontalScroll({
  triggerRef,
  pinRef,
  trackRef,
}: StickyHorizontalScrollOptions) {
  useEffect(() => {
    const trigger = triggerRef.current
    const pin = pinRef.current
    const track = trackRef.current
    const viewport = track?.parentElement

    if (!trigger || !pin || !track || !viewport) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.registerPlugin(ScrollTrigger)

    const getMaxScroll = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

    const maxScroll = getMaxScroll()
    if (maxScroll <= 0) return

    const tween = gsap.to(track, {
      x: () => -getMaxScroll(),
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top top',
        end: () => `+=${getMaxScroll()}`,
        pin,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 0,
      },
    })

    const refresh = () => {
      ScrollTrigger.refresh()
    }

    const images = Array.from(track.querySelectorAll('img'))
    images.forEach((image) => {
      if (!image.complete) {
        image.addEventListener('load', refresh, { once: true })
      }
    })

    window.addEventListener('resize', refresh)

    return () => {
      window.removeEventListener('resize', refresh)
      tween.scrollTrigger?.kill()
      tween.kill()
      gsap.set(track, { clearProps: 'transform' })
    }
  }, [triggerRef, pinRef, trackRef])
}
