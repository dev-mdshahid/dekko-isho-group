import { type RefObject, useEffect } from 'react'

import { initAboutHeroAnimations } from '../lib/animations/about/hero'

export function useAboutHeroAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    return initAboutHeroAnimations(section)
  }, [sectionRef])
}
