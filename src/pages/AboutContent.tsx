import { useRef } from 'react'

import {
  AboutClientsSection,
  AboutHeroSection,
  AboutImageInfoSection,
  AboutJourneySection,
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
      <AboutJourneySection />
      <AboutClientsSection />
      <AboutVideoSection />
      <AboutTeamSection />
    </div>
  )
}
