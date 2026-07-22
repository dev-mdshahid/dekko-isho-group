import { useRef } from 'react'

import {
  ManufacturingCapacityDetailsSection,
  ManufacturingCapacitySection,
  ManufacturingCTASection,
  ManufacturingCuttingPreparationSection,
  ManufacturingEmbroiderySection,
  ManufacturingHeroSection,
  ManufacturingHowItWorksSection,
  ManufacturingProductionNetworkSection,
  ManufacturingSewingSection,
} from '../components/manufacturing'
import { SolutionExpertiseSection } from '../components/solutions'
import { manufacturingExpertise } from '../data/manufacturing/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'mfg'

export function ManufacturingContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page manufacturing-page">
      <ManufacturingHeroSection />
      <SolutionExpertiseSection idPrefix={ID_PREFIX} {...manufacturingExpertise} />
      <ManufacturingHowItWorksSection />
      <ManufacturingCapacitySection />
      <ManufacturingCapacityDetailsSection />
      <ManufacturingCuttingPreparationSection />
      <ManufacturingSewingSection />
      <ManufacturingEmbroiderySection />
      <ManufacturingProductionNetworkSection />
      <ManufacturingCTASection />
    </div>
  )
}
