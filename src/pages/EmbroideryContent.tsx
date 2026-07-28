import { useRef } from 'react'

import { ManufacturingCapacitySection } from '../components/manufacturing'
import {
  SolutionAdvancedFinishingSection,
  SolutionCapabilityCardsSection,
  SolutionCtaSection,
  SolutionPageHeroSection,
  SolutionProductionNetworkSection,
  // SolutionWhyItMattersSection,
} from '../components/solutions'
import { SplitContentSection } from '../components/ui/SplitContentSection'
import { SplitFeatureListSection } from '../components/ui/SplitFeatureListSection'
import {
  embroideryCapabilities,
  embroideryCta,
  embroideryHero,
  embroideryProductionCapacity,
  embroideryProductionNetwork,
  embroideryQualityAssurance,
  embroideryTechnicalDevelopment,
  embroideryTechnology,
  // embroideryWhyItMatters,
} from '../data/embroidery/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useSolutionAnimations } from '../hooks/useSolutionAnimations'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'embroidery'

export function EmbroideryContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useSolutionAnimations(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page embroidery-page">
      {/* 1. Hero */}
      <SolutionPageHeroSection idPrefix={ID_PREFIX} {...embroideryHero} />

      {/* 2. Advanced Embroidery Capabilities */}
      <SolutionCapabilityCardsSection
        idPrefix={ID_PREFIX}
        sectionKey="capabilities"
        content={embroideryCapabilities}
      />

      {/* 3. Advanced Embroidery Technology */}
      <SolutionAdvancedFinishingSection
        idPrefix={ID_PREFIX}
        content={embroideryTechnology}
      />

      {/* 4. Production Capacity */}
      <ManufacturingCapacitySection
        idPrefix={ID_PREFIX}
        content={embroideryProductionCapacity}
      />

      {/* 5. Technical Development */}
      <SplitFeatureListSection
        className="il-research-section"
        {...embroideryTechnicalDevelopment}
      />

      {/* 6. Quality Assurance / QC Process */}
      <SplitContentSection
        className="il-quality-assurance-section"
        {...embroideryQualityAssurance}
      />

      {/* 7. Production Network */}
      <SolutionProductionNetworkSection
        idPrefix={ID_PREFIX}
        content={embroideryProductionNetwork}
      />

      {/* Not in current embroidery page design */}
      {/* <SolutionWhyItMattersSection idPrefix={ID_PREFIX} content={embroideryWhyItMatters} /> */}

      {/* 8. CTA */}
      <SolutionCtaSection idPrefix={ID_PREFIX} content={embroideryCta} />
    </div>
  )
}
