import { useRef } from 'react'

import {
  ComplianceCTASection,
  ComplianceImprovementSection,
  ComplianceInitiativesSection,
  ComplianceQualitySection,
  ComplianceReportingSection,
  ComplianceRiskSection,
  ComplianceSustainabilityHeroSection,
} from '../components/compliance-sustainability'
import { IndustryImageSection } from '../components/industry'
import {
  complianceSustainabilitySafety,
} from '../data/compliance-sustainability/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function ComplianceSustainabilityContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="compliance-sustainability-page">
      <ComplianceSustainabilityHeroSection />
      <ComplianceInitiativesSection />
      <IndustryImageSection
        className="cs-safety-section"
        {...complianceSustainabilitySafety}
      />
      <ComplianceRiskSection />
      <ComplianceQualitySection />
      <ComplianceReportingSection />
      <ComplianceImprovementSection />
      <ComplianceCTASection />
    </div>
  )
}
