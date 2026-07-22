import { useRef } from 'react'

import {
  ComplianceImprovementSection,
  ComplianceInitiativesSection,
  ComplianceQualitySection,
  ComplianceReportingSection,
  ComplianceRiskSection,
  ComplianceSustainabilityHeroSection,
} from '../components/compliance-sustainability'
import { IndustryImageSection } from '../components/industry'
import { SolutionCtaSection } from '../components/solutions'
import {
  complianceSustainabilityCta,
  complianceSustainabilitySafety,
} from '../data/compliance-sustainability/content'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

const ID_PREFIX = 'cs'

export function ComplianceSustainabilityContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="solution-page compliance-sustainability-page">
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
      <SolutionCtaSection idPrefix={ID_PREFIX} content={complianceSustainabilityCta} />
    </div>
  )
}
