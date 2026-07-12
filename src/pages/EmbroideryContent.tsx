import { useRef } from 'react'

import {
  SolutionCapacitySection,
  SolutionCtaSection,
  SolutionIntroSections,
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
      <SolutionIntroSections
        idPrefix={ID_PREFIX}
        hero={embroideryHero}
        expertise={embroideryExpertise}
      />
      <SolutionSpotlightSection idPrefix={ID_PREFIX} content={embroiderySpotlight} />
      <SolutionCapacitySection idPrefix={ID_PREFIX} content={embroideryCapacity} />
      <SolutionQualitySection idPrefix={ID_PREFIX} content={embroideryQuality} />
      <SolutionCtaSection idPrefix={ID_PREFIX} content={embroideryCta} />
    </div>
  )
}
