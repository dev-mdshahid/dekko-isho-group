import { useRef } from 'react'

import { IndustryFeatures, IndustryHero, IndustryImageSection } from '../components/industry'
import { globusGarmentsHero } from '../data/industry/globusGarments'
import { globusGarmentsFeatures } from '../data/industry/globusGarmentsFeatures'
import { globusGarmentsImage } from '../data/industry/globusGarmentsImage'
import { GlobusGarmentsOperationalStrengthSection } from './GlobusGarmentsOperationalStrengthSection'
import { GlobusGarmentsProcessSection } from './GlobusGarmentsProcessSection'
import { GlobusGarmentsResponsibilitySection } from './GlobusGarmentsResponsibilitySection'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function GlobusGarmentsContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...globusGarmentsHero} />
      <IndustryFeatures {...globusGarmentsFeatures} />
      <IndustryImageSection {...globusGarmentsImage} />
      <GlobusGarmentsProcessSection />
      <GlobusGarmentsResponsibilitySection />
      <GlobusGarmentsOperationalStrengthSection />
    </div>
  )
}
