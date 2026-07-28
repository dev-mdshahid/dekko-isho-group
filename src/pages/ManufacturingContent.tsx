import { useRef } from 'react'

import {
  ManufacturingCapacitySection,
  ManufacturingClientsSection,
  ManufacturingEcosystemSection,
  ManufacturingHeroSection,
  ManufacturingJourneySection,
  ManufacturingOperationSection,
  ManufacturingProductRangeSection,
  ManufacturingTechnologySection,
  // ManufacturingCapacityDetailsSection,
  // ManufacturingCuttingPreparationSection,
  // ManufacturingEmbroiderySection,
  // ManufacturingHowItWorksSection,
  // ManufacturingSewingSection,
} from '../components/manufacturing'
import {
  SolutionCtaSection,
  SolutionProductionNetworkSection,
  // SolutionExpertiseSection,
  // SolutionWhyItMattersSection,
} from '../components/solutions'
import {
  manufacturingCapacity,
  manufacturingCta,
  manufacturingProductionNetwork,
  // manufacturingExpertise,
  // manufacturingWhyItMatters,
} from '../data/manufacturing/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useSolutionAnimations } from '../hooks/useSolutionAnimations'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'mfg'

/**
 * Manufacturing page section order (matches design):
 * 1. Hero
 * 2. Monthly Production Capacity
 * 3. Manufacturing Ecosystem
 * 4. Technology-Driven Manufacturing
 * 5. Inside the Operation
 * 6. Product Range
 * 7. Manufacturing Journey
 * 8. Global Business Footprint (Clients)
 * 9. Production Network
 * 10. CTA
 */
export function ManufacturingContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useSolutionAnimations(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page manufacturing-page">
      <ManufacturingHeroSection />
      <ManufacturingCapacitySection content={manufacturingCapacity} />
      <ManufacturingEcosystemSection />
      <ManufacturingTechnologySection />
      <ManufacturingOperationSection />
      <ManufacturingProductRangeSection />
      <ManufacturingJourneySection />
      <ManufacturingClientsSection />
      <SolutionProductionNetworkSection
        idPrefix={ID_PREFIX}
        content={manufacturingProductionNetwork}
      />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={manufacturingCta} />

      {/* Unused legacy sections — kept for reference */}
      {/* <SolutionExpertiseSection idPrefix={ID_PREFIX} {...manufacturingExpertise} /> */}
      {/* <ManufacturingHowItWorksSection /> */}
      {/* <SolutionWhyItMattersSection idPrefix={ID_PREFIX} content={manufacturingWhyItMatters} /> */}
      {/* <ManufacturingCapacityDetailsSection /> */}
      {/* <ManufacturingCuttingPreparationSection /> */}
      {/* <ManufacturingSewingSection /> */}
      {/* <ManufacturingEmbroiderySection /> */}
    </div>
  )
}
