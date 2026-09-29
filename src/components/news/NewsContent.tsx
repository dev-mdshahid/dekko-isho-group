import { useRef } from 'react'

import { useInViewAnimation } from '../../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../../hooks/useWebflowInit'
import { NewsListSection } from './NewsListSection'

export function NewsContent() {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <NewsListSection />
    </div>
  )
}
