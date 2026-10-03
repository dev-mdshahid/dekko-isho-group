import { useRef } from 'react'

import { IndustryFeatures, IndustryFeatureGallery, IndustryHero } from '../components/industry'
import { ishoLtdHero } from '../data/industry/ishoLtd'
import { ishoLtdFeatureGallery } from '../data/industry/ishoLtdFeatureGallery'
import { ishoLtdFeatures } from '../data/industry/ishoLtdFeatures'
import { IshoLtdStoreSection } from './IshoLtdStoreSection'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function IshoLtdContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...ishoLtdHero} />
      <IndustryFeatures {...ishoLtdFeatures} />
      <IndustryFeatureGallery {...ishoLtdFeatureGallery} />
      <IshoLtdStoreSection />
    </div>
  )
}
