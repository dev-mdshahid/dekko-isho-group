import { useRef } from 'react'

import { IndustryFeatures, IndustryHero, IndustryImageSection } from '../components/industry'
import { dekkoFashionsHero } from '../data/industry/dekkoFashions'
import { dekkoFashionsFeatures } from '../data/industry/dekkoFashionsFeatures'
import { dekkoFashionsImage } from '../data/industry/dekkoFashionsImage'
import { DekkoFashionsCapabilitySection } from './DekkoFashionsCapabilitySection'
import { DekkoFashionsCategoriesSection } from './DekkoFashionsCategoriesSection'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function DekkoFashionsContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...dekkoFashionsHero} />
      <IndustryFeatures {...dekkoFashionsFeatures} />
      <IndustryImageSection {...dekkoFashionsImage} />
      <DekkoFashionsCapabilitySection />
      <DekkoFashionsCategoriesSection />
    </div>
  )
}
