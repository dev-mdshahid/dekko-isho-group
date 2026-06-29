import { useRef } from 'react'

import {
  SustainabilityCTASection,
  SustainabilityHeroImageSection,
  SustainabilityHeroSection,
  SustainabilityPillar01Section,
  SustainabilityPillar02Section,
  SustainabilityPillar03Section,
  SustainabilityPillar04Section,
  SustainabilityStrategySection,
} from '../components/sustainability'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function SustainabilityContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <SustainabilityHeroSection />
      <SustainabilityHeroImageSection />
      <SustainabilityStrategySection />
      <SustainabilityPillar01Section />
      <SustainabilityPillar02Section />
      <SustainabilityPillar03Section />
      <SustainabilityPillar04Section />
      {/* <SustainabilityCTASection /> */}
    </div>
  )
}
