import { useRef } from 'react'

import {
  // SolutionCapacitySection,
  SolutionAdvancedFinishingSection,
  SolutionCapabilityCardsSection,
  SolutionCtaSection,
  SolutionPageHeroSection,
  SolutionProductionNetworkSection,
  // SolutionQualitySection,
  // SolutionSpotlightSection,
  SolutionWhyItMattersSection,
} from '../components/solutions'
import {
  // embroideryCapacity,
  embroideryCapabilities,
  embroideryCta,
  embroideryHero,
  embroideryProductionNetwork,
  // embroideryQuality,
  // embroiderySpotlight,
  embroideryTechnology,
  embroideryWhyItMatters,
} from '../data/embroidery/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'embroidery'

export function EmbroideryContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page embroidery-page">
      <SolutionPageHeroSection idPrefix={ID_PREFIX} {...embroideryHero} />
      <SolutionCapabilityCardsSection
        idPrefix={ID_PREFIX}
        sectionKey="capabilities"
        content={embroideryCapabilities}
      />
      <SolutionAdvancedFinishingSection
        idPrefix={ID_PREFIX}
        content={embroideryTechnology}
      />
      <SolutionProductionNetworkSection
        idPrefix={ID_PREFIX}
        content={embroideryProductionNetwork}
      />
      {/* <SolutionSpotlightSection idPrefix={ID_PREFIX} content={embroiderySpotlight} /> */}
      {/* <SolutionCapacitySection idPrefix={ID_PREFIX} content={embroideryCapacity} /> */}
      {/* <SolutionQualitySection idPrefix={ID_PREFIX} content={embroideryQuality} /> */}
      <SolutionWhyItMattersSection idPrefix={ID_PREFIX} content={embroideryWhyItMatters} />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={embroideryCta} />
    </div>
  )
}
