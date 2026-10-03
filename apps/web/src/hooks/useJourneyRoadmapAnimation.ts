import { type RefObject, useEffect } from 'react'

import { initJourneyRoadmapAnimations } from '../lib/animations/journeyRoadmap'

/** Matches the breakpoint where the roadmap swaps to the stacked mobile list. */
const MOBILE_QUERY = '(max-width: 991px)'

export function useJourneyRoadmapAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let cleanup = initJourneyRoadmapAnimations(section)

    // Each layout gets its own timeline, so the other one stays hidden until rebuilt.
    const query = window.matchMedia(MOBILE_QUERY)
    const rebuild = () => {
      cleanup()
      cleanup = initJourneyRoadmapAnimations(section)
    }
    query.addEventListener('change', rebuild)

    return () => {
      query.removeEventListener('change', rebuild)
      cleanup()
    }
  }, [sectionRef])
}
