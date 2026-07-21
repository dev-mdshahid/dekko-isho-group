import { type RefObject, useEffect } from 'react'

import { initJourneyAnimations } from '../lib/animations/about/journey'
import { getLenis } from '../lib/smoothScroll'

export function useJourneyTimelineAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let cleanup = initJourneyAnimations(section)

    // Lenis may mount in the same tick; rebind once it's available.
    const retry = window.setTimeout(() => {
      if (!getLenis()) return
      cleanup()
      cleanup = initJourneyAnimations(section)
    }, 0)

    return () => {
      window.clearTimeout(retry)
      cleanup()
    }
  }, [sectionRef])
}
