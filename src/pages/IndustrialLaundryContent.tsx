import { useRef } from 'react'

import { ManufacturingCapacitySection } from '../components/manufacturing'
import {
  DesignGlobalNetworkSection,
  DesignMaterialsSection,
} from '../components/design-product-development'
import {
  SolutionAdvancedFinishingSection,
  SolutionCapabilityCardsSection,
  SolutionCtaSection,
  SolutionPageHeroSection,
  SolutionSustainableTechSection,
} from '../components/solutions'
import { SplitContentSection } from '../components/ui/SplitContentSection'
import { SplitFeatureListSection } from '../components/ui/SplitFeatureListSection'
import {
  industrialLaundryAdvancedFinishing,
  industrialLaundryCta,
  industrialLaundryEnvironmentalManagement,
  industrialLaundryHero,
  industrialLaundryLaboratory,
  industrialLaundryQualityAssurance,
  industrialLaundryResearchDevelopment,
  industrialLaundrySustainableTech,
  industrialLaundryWashingProcesses,
  industrialLaundryWaterStewardship,
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
      {/* 1. Hero */}
      <SolutionPageHeroSection idPrefix={ID_PREFIX} {...industrialLaundryHero} />

      {/* 2. Core washing processes */}
      <SolutionCapabilityCardsSection
        idPrefix={ID_PREFIX}
        sectionKey="washing-processes"
        content={industrialLaundryWashingProcesses}
      />

      {/* 3. Advanced Finishing Capabilities */}
      <SolutionAdvancedFinishingSection
        idPrefix={ID_PREFIX}
        content={industrialLaundryAdvancedFinishing}
      />

      {/* 4. Production Capacity at Scale */}
      <ManufacturingCapacitySection
        idPrefix={ID_PREFIX}
        content={industrialLaundryWaterStewardship}
      />

      {/* 5. Research & Development */}
      <SplitFeatureListSection
        className="il-research-section"
        {...industrialLaundryResearchDevelopment}
      />

      {/* 6. Modern Washing Laboratory */}
      <DesignGlobalNetworkSection
        idPrefix={ID_PREFIX}
        className="il-laboratory-section"
        content={industrialLaundryLaboratory}
      />

      {/* 7. Quality Assurance */}
      <SplitContentSection
        className="il-quality-assurance-section"
        {...industrialLaundryQualityAssurance}
      />

      {/* 8. Sustainable Washing Technologies */}
      <SolutionSustainableTechSection
        idPrefix={ID_PREFIX}
        content={industrialLaundrySustainableTech}
      />

      {/* 9. Environmental & Chemical Management */}
      <DesignMaterialsSection
        idPrefix={ID_PREFIX}
        className="il-environmental-section"
        content={industrialLaundryEnvironmentalManagement}
      />

      {/* 10. CTA */}
      <SolutionCtaSection idPrefix={ID_PREFIX} content={industrialLaundryCta} />
    </div>
  )
}
