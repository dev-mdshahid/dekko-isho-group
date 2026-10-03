import { useRef } from 'react'

import { IndustryFeatures, IndustryHero } from '../components/industry'
import { agamiFashionsHero } from '../data/industry/agamiFashions'
import { agamiFashionsFeatures } from '../data/industry/agamiFashionsFeatures'
import { AgamiFashionsShowcaseSection } from './AgamiFashionsShowcaseSection'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function AgamiFashionsContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref} className="agami-fashions-page">
      <IndustryHero {...agamiFashionsHero} />
      <IndustryFeatures {...agamiFashionsFeatures} />
      <AgamiFashionsShowcaseSection />
    </div>
  )
}
