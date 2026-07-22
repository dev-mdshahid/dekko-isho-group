import { useRef } from 'react'

import {
  SolutionCapacitySection,
  SolutionCtaSection,
  SolutionExpertiseSection,
  SolutionPageHeroSection,
  SolutionQualitySection,
  SolutionSpotlightSection,
} from '../components/solutions'
import {
  industrialLaundryExpertise,
  industrialLaundryCta,
  industrialLaundryHero,
  industrialLaundryQuality,
  industrialLaundrySpotlight,
  industrialLaundryWashing,
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
      <SolutionExpertiseSection idPrefix={ID_PREFIX} {...industrialLaundryExpertise} />
      <SolutionSpotlightSection idPrefix={ID_PREFIX} content={industrialLaundrySpotlight} />
      <SolutionCapacitySection idPrefix={ID_PREFIX} content={industrialLaundryWashing} />
      <SolutionQualitySection idPrefix={ID_PREFIX} content={industrialLaundryQuality} />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={industrialLaundryCta} />
    </div>
  )
}
