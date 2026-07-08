import { useRef } from 'react'

import {
  SolutionExpertiseSection,
  SolutionVideoHeroSection,
} from '../components/solutions'
import { embroideryExpertise, embroideryHero } from '../data/embroidery/content'
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
      <section className="service-details-section section-spacing-top solution-hero-section">
        <SolutionVideoHeroSection idPrefix={ID_PREFIX} {...embroideryHero} />
      </section>
      <SolutionExpertiseSection idPrefix={ID_PREFIX} {...embroideryExpertise} />
    </div>
  )
}
