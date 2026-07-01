import { useRef } from 'react'

import {
  AboutChairmanSection,
  AboutContactSection,
  AboutHeroSection,
  AboutIntegritySection,
  AboutJourneySection,
  AboutLeadershipSection,
  AboutTopExecutivesSection,
  AboutOverviewSection,
  AboutRoadmapSection,
  AboutStrengthSection,
  AboutVideoSection,
} from '../components/about'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function AboutContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="about-content">
      <AboutHeroSection />
      <AboutOverviewSection />
      <AboutIntegritySection />
      <AboutVideoSection />
      <AboutJourneySection />
      <AboutStrengthSection />
      <AboutChairmanSection />
      <AboutLeadershipSection />
      <AboutTopExecutivesSection />
      <AboutRoadmapSection />
      <AboutContactSection />
      {/* <AboutClientsSection /> */}
    </div>
  )
}
