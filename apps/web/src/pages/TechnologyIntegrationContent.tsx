import { useRef } from 'react'

import {
  TechnologyDashboardSection,
  TechnologyGrowthSection,
  TechnologyHeroSection,
  TechnologyIntroSection,
  TechnologyPartnersSection,
  TechnologyUnifiedSection,
} from '../components/technology-integration'
import { SolutionCtaSection } from '../components/solutions'
import { technologyIntegrationCta } from '../data/technology-integration/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useSolutionAnimations } from '../hooks/useSolutionAnimations'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'ti'

export function TechnologyIntegrationContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useSolutionAnimations(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page technology-integration-page">
      <TechnologyHeroSection />
      <TechnologyIntroSection />
      <TechnologyDashboardSection />
      <TechnologyUnifiedSection />
      <TechnologyGrowthSection />
      <TechnologyPartnersSection />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={technologyIntegrationCta} />
    </div>
  )
}
