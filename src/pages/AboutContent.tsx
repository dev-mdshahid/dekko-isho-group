import { useEffect, useRef } from 'react'

import {
  AboutChairmanSection,
  AboutContactSection,
  AboutHeroSection,
  AboutImageInfoSection,
  AboutIntegritySection,
  AboutJourneySection,
  AboutLeadershipSection,
  AboutOverviewSection,
  AboutRoadmapSection,
  AboutStrengthSection,
  AboutVideoSection,
} from '../components/about'
import { initAboutHeroAnimation } from '../lib/animations/about/hero'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function AboutContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cleanup: (() => void) | undefined
    const frame = requestAnimationFrame(() => {
      cleanup = initAboutHeroAnimation(el)
    })
    return () => {
      cancelAnimationFrame(frame)
      cleanup?.()
    }
  }, [])

  return (
    <div ref={ref} className="about-content">
      <AboutHeroSection />
      <AboutImageInfoSection />
      <AboutOverviewSection />
      <AboutIntegritySection />
      <AboutVideoSection />
      <AboutJourneySection />
      <AboutStrengthSection />
      <AboutChairmanSection />
      <AboutLeadershipSection />
      <AboutRoadmapSection />
      <AboutContactSection />
      {/* <AboutClientsSection /> */}
    </div>
  )
}
