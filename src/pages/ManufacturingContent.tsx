import { useRef } from 'react'

import {
  ManufacturingCapacityDetailsSection,
  ManufacturingCapacitySection,
  ManufacturingCuttingPreparationSection,
  ManufacturingEmbroiderySection,
  ManufacturingHeroSection,
  ManufacturingHowItWorksSection,
  ManufacturingProductionNetworkSection,
  ManufacturingSewingSection,
} from '../components/manufacturing'
import { SolutionCtaSection, SolutionExpertiseSection } from '../components/solutions'
import { manufacturingCta, manufacturingExpertise } from '../data/manufacturing/content'
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
      <ManufacturingProductionNetworkSection />
      <SolutionExpertiseSection idPrefix={ID_PREFIX} {...manufacturingExpertise} />
      <ManufacturingHowItWorksSection />
      <ManufacturingCapacitySection />
      <ManufacturingCapacityDetailsSection />
      <ManufacturingCuttingPreparationSection />
      <ManufacturingSewingSection />
      <ManufacturingEmbroiderySection />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={manufacturingCta} />
    </div>
  )
}
