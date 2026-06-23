import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Clears GSAP scroll/pin state and resets the window scroll position. */
export function resetRouteScroll() {
  gsap.killTweensOf(window)
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill(true))
  ScrollTrigger.clearScrollMemory()

  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}
