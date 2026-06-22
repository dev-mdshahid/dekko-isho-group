import { useRef } from 'react'

import { GalleryGridSection, GalleryHeroSection } from '../components/gallery'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

export function GalleryContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <GalleryHeroSection />
      <GalleryGridSection />
    </div>
  )
}
