import { useRef } from 'react'

import {
  // ManufacturingCapacityDetailsSection,
  ManufacturingCapacitySection,
  ManufacturingEcosystemSection,
  ManufacturingClientsSection,
  // ManufacturingCuttingPreparationSection,
  ManufacturingProductRangeSection,
  // ManufacturingEmbroiderySection,
  ManufacturingHeroSection,
  // ManufacturingHowItWorksSection,
  // ManufacturingSewingSection,
  ManufacturingTechnologySection,
  ManufacturingOperationSection,
  ManufacturingJourneySection,
} from '../components/manufacturing'
import {
  SolutionCtaSection,
  // SolutionExpertiseSection,
  SolutionProductionNetworkSection,
  SolutionWhyItMattersSection,
} from '../components/solutions'
import {
  manufacturingCapacity,
  manufacturingCta,
  // manufacturingExpertise,
  manufacturingProductionNetwork,
  manufacturingWhyItMatters,
} from '../data/manufacturing/content'
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
      <SolutionProductionNetworkSection
        idPrefix={ID_PREFIX}
        content={manufacturingProductionNetwork}
      />
      {/* <SolutionExpertiseSection idPrefix={ID_PREFIX} {...manufacturingExpertise} /> */}
      {/* <ManufacturingHowItWorksSection /> */}
      <ManufacturingCapacitySection content={manufacturingCapacity} />
      <ManufacturingEcosystemSection />
      <ManufacturingTechnologySection />
      <ManufacturingOperationSection />
      <ManufacturingJourneySection />
      <ManufacturingClientsSection />
      <ManufacturingProductRangeSection />
      <SolutionWhyItMattersSection idPrefix={ID_PREFIX} content={manufacturingWhyItMatters} />
      {/* <ManufacturingCapacityDetailsSection /> */}
      {/* <ManufacturingCuttingPreparationSection /> */}
      {/* <ManufacturingSewingSection /> */}
      {/* <ManufacturingEmbroiderySection /> */}
      <SolutionCtaSection idPrefix={ID_PREFIX} content={manufacturingCta} />
    </div>
  )
}
