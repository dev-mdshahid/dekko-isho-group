import { useRef } from 'react'

import { AwardsHeroSection, AwardsHonorsSection } from '../components/awards'
import { CertificationsSection } from '../components/certifications'
import { awardsGridContent } from '../data/awards/logoGrid'
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
      <CertificationsSection
        variant="awards"
        tag={awardsGridContent.tag}
        title={awardsGridContent.title}
        description={awardsGridContent.description}
      />
    </div>
  )
}
