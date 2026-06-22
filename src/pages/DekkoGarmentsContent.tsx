import { useRef } from 'react'

import { IndustryFeatures, IndustryHero, IndustryImageSection } from '../components/industry'
import { dekkoGarmentsHero } from '../data/industry/dekkoGarments'
import { dekkoGarmentsFeatures } from '../data/industry/dekkoGarmentsFeatures'
import { dekkoGarmentsImage } from '../data/industry/dekkoGarmentsImage'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function DekkoGarmentsContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...dekkoGarmentsHero} />
      <IndustryFeatures {...dekkoGarmentsFeatures} />
      <IndustryImageSection {...dekkoGarmentsImage} />
    </div>
  )
}
