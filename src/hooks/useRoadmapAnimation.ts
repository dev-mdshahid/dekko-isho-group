import { type RefObject, useEffect } from 'react'

import { initRoadmapAnimations } from '../lib/animations/about/roadmap'

export function useRoadmapAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    return initRoadmapAnimations(section)
  }, [sectionRef])
}
