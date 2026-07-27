import { useRef } from 'react'

import { ManufacturingCapacitySection } from '../components/manufacturing'
import {
  SolutionAdvancedFinishingSection,
  // SolutionCapacitySection,
  SolutionCtaSection,
  SolutionExpertiseSection,
  SolutionPageHeroSection,
  SolutionProductionNetworkSection,
  // SolutionQualitySection,
  // SolutionSpotlightSection,
  SolutionWashingProcessesSection,
  SolutionWhyItMattersSection,
} from '../components/solutions'
import {
  industrialLaundryAdvancedFinishing,
  industrialLaundryExpertise,
  industrialLaundryCta,
  industrialLaundryHero,
  industrialLaundryProductionNetwork,
  // industrialLaundryQuality,
  // industrialLaundrySpotlight,
  // industrialLaundryWashing,
  industrialLaundryWashingProcesses,
  industrialLaundryWaterStewardship,
  industrialLaundryWhyItMatters,
} from '../data/industrial-laundry/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'il'

export function IndustrialLaundryContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page industrial-laundry-page">
      <SolutionPageHeroSection idPrefix={ID_PREFIX} {...industrialLaundryHero} />
      <SolutionWashingProcessesSection
        idPrefix={ID_PREFIX}
        content={industrialLaundryWashingProcesses}
      />
      <SolutionAdvancedFinishingSection
        idPrefix={ID_PREFIX}
        content={industrialLaundryAdvancedFinishing}
      />
      <SolutionExpertiseSection idPrefix={ID_PREFIX} {...industrialLaundryExpertise} />
      <ManufacturingCapacitySection
        idPrefix={ID_PREFIX}
        content={industrialLaundryWaterStewardship}
      />
      <SolutionProductionNetworkSection
        idPrefix={ID_PREFIX}
        content={industrialLaundryProductionNetwork}
      />
      {/* <SolutionSpotlightSection idPrefix={ID_PREFIX} content={industrialLaundrySpotlight} /> */}
      {/* <SolutionCapacitySection idPrefix={ID_PREFIX} content={industrialLaundryWashing} /> */}
      {/* <SolutionQualitySection idPrefix={ID_PREFIX} content={industrialLaundryQuality} /> */}
      <SolutionWhyItMattersSection idPrefix={ID_PREFIX} content={industrialLaundryWhyItMatters} />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={industrialLaundryCta} />
    </div>
  )
}
