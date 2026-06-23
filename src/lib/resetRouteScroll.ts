import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Resets window scroll without tearing down page-owned ScrollTrigger instances. */
export function resetScrollPosition() {
  gsap.killTweensOf(window)
  ScrollTrigger.clearScrollMemory()

  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}
