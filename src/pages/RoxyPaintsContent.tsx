import { useRef } from 'react'

import { IndustryFeatureGallery, IndustryFeatures, IndustryHero, IndustryLocation } from '../components/industry'
import { roxyPaintsHero } from '../data/industry/roxyPaints'
import { roxyPaintsFeatureGallery } from '../data/industry/roxyPaintsFeatureGallery'
import { roxyPaintsFeatures } from '../data/industry/roxyPaintsFeatures'
import { roxyPaintsLocations } from '../data/industry/roxyPaintsLocations'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function RoxyPaintsContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...roxyPaintsHero} />
      <IndustryFeatures {...roxyPaintsFeatures} />
      <IndustryFeatureGallery {...roxyPaintsFeatureGallery} />
      <IndustryLocation {...roxyPaintsLocations} />
    </div>
  )
}
