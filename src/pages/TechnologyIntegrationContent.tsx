import { useRef } from 'react'

import {
  TechnologyCTASection,
  TechnologyDashboardSection,
  TechnologyGrowthSection,
  TechnologyHeroSection,
  TechnologyIntroSection,
  TechnologyPartnersSection,
  TechnologyUnifiedSection,
} from '../components/technology-integration'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function TechnologyIntegrationContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="technology-integration-page">
      <TechnologyHeroSection />
      <TechnologyIntroSection />
      <TechnologyDashboardSection />
      <TechnologyUnifiedSection />
      <TechnologyGrowthSection />
      <TechnologyPartnersSection />
      <TechnologyCTASection />
    </div>
  )
}
