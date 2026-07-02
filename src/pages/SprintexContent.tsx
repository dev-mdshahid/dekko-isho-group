import { useRef } from 'react'

import { IndustryFeatureGallery, IndustryFeatures, IndustryHero, IndustryLocation } from '../components/industry'
import { sprintexHero } from '../data/industry/sprintex'
import { sprintexFeatureGallery } from '../data/industry/sprintexFeatureGallery'
import { sprintexFeatures } from '../data/industry/sprintexFeatures'
import { sprintexLocations } from '../data/industry/sprintexLocations'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function SprintexContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...sprintexHero} />
      <IndustryFeatures {...sprintexFeatures} />
      <IndustryFeatureGallery {...sprintexFeatureGallery} />
      <IndustryLocation {...sprintexLocations} />
    </div>
  )
}
