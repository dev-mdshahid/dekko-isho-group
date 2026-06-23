import { useRef } from 'react'

import { IndustryFeatureGallery, IndustryFeatures, IndustryHero, IndustryLocation } from '../components/industry'
import { dekkoIshoHero } from '../data/industry/dekkoIsho'
import { dekkoIshoFeatureGallery } from '../data/industry/dekkoIshoFeatureGallery'
import { dekkoIshoFeatures } from '../data/industry/dekkoIshoFeatures'
import { dekkoIshoLocations } from '../data/industry/dekkoIshoLocations'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function DekkoIshoContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...dekkoIshoHero} />
      <IndustryFeatures {...dekkoIshoFeatures} />
      <IndustryFeatureGallery {...dekkoIshoFeatureGallery} />
      <IndustryLocation {...dekkoIshoLocations} />
    </div>
  )
}
