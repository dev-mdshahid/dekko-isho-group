import { useRef } from 'react'

import {
  CareerApplyCTASection,
  CareerEmployeeVoicesSection,
  CareerHeroSection,
  CareerLifeSection,
  CareerOpenPositionsSection,
  CareerStatsSection,
  CareerWhySection,
  CareerWorkplaceSection,
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
    <div ref={ref} className="career-page">
      <CareerHeroSection />
      <CareerWorkplaceSection />
      <CareerWhySection />
      <CareerStatsSection />
      <CareerLifeSection />
      <CareerOpenPositionsSection />
      <CareerEmployeeVoicesSection />
      <CareerApplyCTASection />
    </div>
  )
}
