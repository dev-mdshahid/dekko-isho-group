import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/** Keeps ScrollTrigger pin/scrub in sync with Lenis virtual scroll. */
export function bindLenisScrollTrigger(lenis: Lenis) {
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (value !== undefined) {
        lenis.scrollTo(value, { immediate: true })
      }
      return lenis.scroll
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    },
  })

  const onScroll = () => ScrollTrigger.update()
  lenis.on('scroll', onScroll)

  const onRefresh = () => {
    lenis.resize()
  }
  ScrollTrigger.addEventListener('refresh', onRefresh)

  ScrollTrigger.refresh()

  return () => {
    ScrollTrigger.removeEventListener('refresh', onRefresh)
    lenis.off('scroll', onScroll)
    ScrollTrigger.scrollerProxy(document.documentElement, {})
  }
}
