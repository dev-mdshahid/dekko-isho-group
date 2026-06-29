import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { scrollToTop } from './smoothScroll'

gsap.registerPlugin(ScrollTrigger)

/** Resets window scroll without tearing down page-owned ScrollTrigger instances. */
export function resetScrollPosition() {
  gsap.killTweensOf(window)
  ScrollTrigger.clearScrollMemory()
  scrollToTop({ immediate: true })
}