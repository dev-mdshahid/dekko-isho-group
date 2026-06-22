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
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function ManufacturingContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="manufacturing-page">
      <ManufacturingHeroSection />
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
