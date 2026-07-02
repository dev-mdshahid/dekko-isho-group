import { useRef } from 'react'

import { AwardsGridSection, AwardsHeroSection, AwardsHonorsSection } from '../components/awards'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function AwardsContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <AwardsHeroSection />
      <AwardsHonorsSection />
      <AwardsGridSection />
    </div>
  )
}
