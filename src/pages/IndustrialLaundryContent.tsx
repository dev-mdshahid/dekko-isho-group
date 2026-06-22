import { useRef } from 'react'

import {
  IndustrialLaundryCTASection,
  IndustrialLaundryDevelopmentSection,
  IndustrialLaundryHeroSection,
  IndustrialLaundryInnovationSection,
  IndustrialLaundryQualitySection,
  IndustrialLaundryWashingSection,
} from '../components/industrial-laundry'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function IndustrialLaundryContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="industrial-laundry-page">
      <IndustrialLaundryHeroSection />
      <IndustrialLaundryInnovationSection />
      <IndustrialLaundryDevelopmentSection />
      <IndustrialLaundryWashingSection />
      <IndustrialLaundryQualitySection />
      <IndustrialLaundryCTASection />
    </div>
  )
}
