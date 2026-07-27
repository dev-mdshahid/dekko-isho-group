import { useRef } from 'react'

import {
  DesignCapabilitiesSection,
  DesignDigitalDevelopmentSection,
  DesignDigitalImpactSection,
  // DesignExperienceSection,
  // DesignFacilitiesSection,
  DesignGallerySection,
  DesignGlobalNetworkSection,
  DesignJourneySection,
  DesignMaterialsSection,
  DesignStudioSection,
  // DesignPresenceSection,
  // DesignServicesSection,
  // DesignShowroomSection,
  // DesignSolutionsBannerSection,
} from '../components/design-product-development'
// import { IndustryImageSection } from '../components/industry'
import { SolutionCtaSection, SolutionPageHeroSection } from '../components/solutions'
import {
  // designProductDevelopmentConcept,
  designProductDevelopmentCta,
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
      <DesignStudioSection />
      <DesignDigitalDevelopmentSection />
      <DesignMaterialsSection />
      {/* <DesignServicesSection /> */}
      <DesignGlobalNetworkSection />
      <DesignJourneySection />
      <DesignDigitalImpactSection />
      <DesignGallerySection />
      {/* <DesignSolutionsBannerSection /> */}
      {/* <IndustryImageSection className="dpd-concept-section" {...designProductDevelopmentConcept} /> */}
      {/* <DesignFacilitiesSection /> */}
      {/* <DesignExperienceSection /> */}
      {/* <DesignPresenceSection /> */}
      {/* <DesignShowroomSection /> */}
      <SolutionCtaSection idPrefix={ID_PREFIX} content={designProductDevelopmentCta} />
    </div>
  )
}
