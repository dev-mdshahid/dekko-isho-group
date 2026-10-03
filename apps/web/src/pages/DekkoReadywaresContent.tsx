import { useRef } from 'react'

import { IndustryFeatures, IndustryHero, IndustryImageSection } from '../components/industry'
import { dekkoReadywaresHero } from '../data/industry/dekkoReadywares'
import { dekkoReadywaresFeatures } from '../data/industry/dekkoReadywaresFeatures'
import { dekkoReadywaresImage } from '../data/industry/dekkoReadywaresImage'
import { DekkoReadywaresCapacitySection } from './DekkoReadywaresCapacitySection'
import { DekkoReadywaresGallerySection } from './DekkoReadywaresGallerySection'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function DekkoReadywaresContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <IndustryHero {...dekkoReadywaresHero} />
      <IndustryFeatures {...dekkoReadywaresFeatures} />
      <IndustryImageSection {...dekkoReadywaresImage} />
      <DekkoReadywaresGallerySection />
      <DekkoReadywaresCapacitySection />
    </div>
  )
}
