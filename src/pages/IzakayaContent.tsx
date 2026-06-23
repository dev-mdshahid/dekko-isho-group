import { useRef } from 'react'

import { IndustryFeatureGallery, IndustryFeatures, IndustryHero, IndustryLocation } from '../components/industry'
import { izakayaHero } from '../data/industry/izakaya'
import { izakayaFeatureGallery } from '../data/industry/izakayaFeatureGallery'
import { izakayaFeatures } from '../data/industry/izakayaFeatures'
import { izakayaLocations } from '../data/industry/izakayaLocations'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function IzakayaContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...izakayaHero} />
      <IndustryFeatures {...izakayaFeatures} />
      <IndustryFeatureGallery {...izakayaFeatureGallery} />
      <IndustryLocation {...izakayaLocations} />
    </div>
  )
}
