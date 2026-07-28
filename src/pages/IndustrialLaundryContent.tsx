import { useRef } from 'react'

import { ManufacturingCapacitySection } from '../components/manufacturing'
import { DesignGlobalNetworkSection } from '../components/design-product-development'
import {
  SolutionAdvancedFinishingSection,
  // SolutionCapacitySection,
  SolutionCtaSection,
  SolutionExpertiseSection,
  SolutionPageHeroSection,
  SolutionProductionNetworkSection,
  // SolutionQualitySection,
  // SolutionSpotlightSection,
  SolutionSustainableTechSection,
  SolutionWashingProcessesSection,
  SolutionWhyItMattersSection,
} from '../components/solutions'
import { SplitContentSection } from '../components/ui/SplitContentSection'
import { SplitFeatureListSection } from '../components/ui/SplitFeatureListSection'
import {
  industrialLaundryAdvancedFinishing,
  industrialLaundryExpertise,
  industrialLaundryCta,
  industrialLaundryHero,
  industrialLaundryLaboratory,
  industrialLaundryProductionNetwork,
  industrialLaundryQualityAssurance,
  // industrialLaundryQuality,
  industrialLaundryResearchDevelopment,
  // industrialLaundrySpotlight,
  industrialLaundrySustainableTech,
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
      <SplitFeatureListSection
        className="il-research-section"
        {...industrialLaundryResearchDevelopment}
      />
      <DesignGlobalNetworkSection
        idPrefix={ID_PREFIX}
        className="il-laboratory-section"
        content={industrialLaundryLaboratory}
      />
      <SplitContentSection
        className="il-quality-assurance-section"
        {...industrialLaundryQualityAssurance}
      />
      <SolutionSustainableTechSection
        idPrefix={ID_PREFIX}
        content={industrialLaundrySustainableTech}
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
