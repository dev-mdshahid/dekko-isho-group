import { useRef } from 'react'

import { IndustryFeatures, IndustryHero } from '../components/industry'
import { agamiWashingHero } from '../data/industry/agamiWashing'
import { agamiWashingFeatures } from '../data/industry/agamiWashingFeatures'
import { AgamiWashingCapabilitySection } from './AgamiWashingCapabilitySection'
import { AgamiWashingTypesSection } from './AgamiWashingTypesSection'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function AgamiWashingContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="agami-washing-page">
      <IndustryHero {...agamiWashingHero} />
      <IndustryFeatures {...agamiWashingFeatures} />
      <AgamiWashingCapabilitySection />
      <AgamiWashingTypesSection />
    </div>
  )
}
