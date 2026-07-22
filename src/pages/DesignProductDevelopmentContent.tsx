import { useRef } from 'react'

import {
  DesignCapabilitiesSection,
  DesignCTASection,
  DesignExperienceSection,
  DesignFacilitiesSection,
  DesignFactoryAssuranceSection,
  DesignPresenceSection,
  DesignServicesSection,
  DesignShowroomSection,
  DesignSolutionsBannerSection,
} from '../components/design-product-development'
import { IndustryImageSection } from '../components/industry'
import { SolutionPageHeroSection } from '../components/solutions'
import {
  designProductDevelopmentConcept,
  designProductDevelopmentHero,
} from '../data/design-product-development/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'dpd'

export function DesignProductDevelopmentContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page design-product-development-page">
      <SolutionPageHeroSection idPrefix={ID_PREFIX} {...designProductDevelopmentHero} />
      <DesignCapabilitiesSection />
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
