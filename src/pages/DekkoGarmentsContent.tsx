import { useRef } from 'react'

import { IndustryFeatures, IndustryHero } from '../components/industry'
import { dekkoGarmentsHero } from '../data/industry/dekkoGarments'
import { dekkoGarmentsFeatures } from '../data/industry/dekkoGarmentsFeatures'
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
    </div>
  )
}
