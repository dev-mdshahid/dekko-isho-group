import { useRef } from 'react'

import {
  ManufacturingCapacityDetailsSection,
  ManufacturingCapacitySection,
  ManufacturingCTASection,
  ManufacturingCuttingPreparationSection,
  ManufacturingEmbroiderySection,
  ManufacturingHowItWorksSection,
  ManufacturingProductionNetworkSection,
  ManufacturingSewingSection,
} from '../components/manufacturing'
import { SolutionIntroSections } from '../components/solutions'
import { manufacturingExpertise, manufacturingHero } from '../data/manufacturing/content'
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
      <SolutionIntroSections
        idPrefix={ID_PREFIX}
        hero={manufacturingHero}
        expertise={manufacturingExpertise}
        className="mfg-hero-section"
      />
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
