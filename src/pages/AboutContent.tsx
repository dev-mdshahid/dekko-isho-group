import { useRef } from 'react'

import {
  AboutChairmanSection,
  AboutClientsSection,
  AboutHeroSection,
  AboutImageInfoSection,
  AboutIntegritySection,
  AboutJourneySection,
  AboutOverviewSection,
  AboutStrengthSection,
  AboutTeamSection,
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
    <div ref={ref}>
      <AboutHeroSection />
      <AboutImageInfoSection />
      <AboutOverviewSection />
      <AboutIntegritySection />
      <AboutVideoSection />
      <AboutJourneySection />
      <AboutStrengthSection />
      <AboutChairmanSection />
      <AboutClientsSection />
      <AboutTeamSection />
    </div>
  )
}
