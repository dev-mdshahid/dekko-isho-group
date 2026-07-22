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
  embroideryCapacity,
  embroideryCta,
  embroideryExpertise,
  embroideryHero,
  embroideryQuality,
  embroiderySpotlight,
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
      <SolutionExpertiseSection idPrefix={ID_PREFIX} {...embroideryExpertise} />
      <SolutionSpotlightSection idPrefix={ID_PREFIX} content={embroiderySpotlight} />
      <SolutionCapacitySection idPrefix={ID_PREFIX} content={embroideryCapacity} />
      <SolutionQualitySection idPrefix={ID_PREFIX} content={embroideryQuality} />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={embroideryCta} />
    </div>
  )
}
