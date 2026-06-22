import { useRef } from 'react'

import { SolutionHeroSection } from '../components/solutions'
import type { Solution } from '../data/solutions/solutions'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

type SolutionContentProps = {
  solution: Solution
}

export function SolutionContent({ solution }: SolutionContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  return (
    <div ref={ref}>
      <SolutionHeroSection solution={solution} />
    </div>
  )
}
