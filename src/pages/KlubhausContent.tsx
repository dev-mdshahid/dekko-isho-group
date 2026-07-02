import { useRef } from 'react'

import { IndustryFeatureGallery, IndustryFeatures, IndustryHero, IndustryLocation } from '../components/industry'
import { klubhausHero } from '../data/industry/klubhaus'
import { klubhausFeatureGallery } from '../data/industry/klubhausFeatureGallery'
import { klubhausFeatures } from '../data/industry/klubhausFeatures'
import { klubhausLocations } from '../data/industry/klubhausLocations'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function KlubhausContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...klubhausHero} />
      <IndustryFeatures {...klubhausFeatures} />
      <IndustryFeatureGallery {...klubhausFeatureGallery} />
      <IndustryLocation {...klubhausLocations} />
    </div>
  )
}
