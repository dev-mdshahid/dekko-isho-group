import { type RefObject, useEffect } from 'react'

import { initJourneyRoadmapAnimations } from '../lib/animations/journeyRoadmap'

export function useJourneyRoadmapAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    return initJourneyRoadmapAnimations(section)
  }, [sectionRef])
}
