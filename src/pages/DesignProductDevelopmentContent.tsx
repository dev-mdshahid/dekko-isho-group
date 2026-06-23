import { useRef } from 'react'

import {
  DesignCTASection,
  DesignExperienceSection,
  DesignFacilitiesSection,
  DesignFactoryAssuranceSection,
  DesignHeroSection,
  DesignPresenceSection,
  DesignServicesSection,
  DesignShowroomSection,
  DesignSolutionsBannerSection,
  DesignTeamSection,
} from '../components/design-product-development'
import { IndustryImageSection } from '../components/industry'
import { designProductDevelopmentConcept } from '../data/design-product-development/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function DesignProductDevelopmentContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="design-product-development-page">
      <DesignHeroSection />
      <DesignTeamSection />
      <DesignServicesSection />
      <DesignFactoryAssuranceSection />
      <DesignSolutionsBannerSection />
      <IndustryImageSection className="dpd-concept-section" {...designProductDevelopmentConcept} />
      <DesignFacilitiesSection />
      <DesignExperienceSection />
      <DesignPresenceSection />
      <DesignShowroomSection />
      <DesignCTASection />
    </div>
  )
}
