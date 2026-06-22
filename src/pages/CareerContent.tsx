import { useRef } from 'react'

import {
  CareerApplyCTASection,
  CareerBannerSection,
  CareerEmployeeVoicesSection,
  CareerHeroSection,
  CareerOpenPositionsSection,
  CareerStatsSection,
  CareerWhySection,
} from '../components/career'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function CareerContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <CareerHeroSection />
      <CareerBannerSection />
      <CareerWhySection />
      <CareerStatsSection />
      <CareerOpenPositionsSection />
      <CareerEmployeeVoicesSection />
      <CareerApplyCTASection />
    </div>
  )
}
