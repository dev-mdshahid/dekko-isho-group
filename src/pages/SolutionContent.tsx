import { useRef } from 'react'

import { SolutionHeroSection } from '../components/solutions'
import type { Solution } from '../data/solutions/solutions'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'
import { ManufacturingContent } from './ManufacturingContent'
import { IndustrialLaundryContent } from './IndustrialLaundryContent'

type SolutionPlaceholderContentProps = {
  solution: Solution
}

function SolutionPlaceholderContent({ solution }: SolutionPlaceholderContentProps) {
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

type SolutionContentProps = {
  solution: Solution
}

export function SolutionContent({ solution }: SolutionContentProps) {
  if (solution.slug === 'manufacturing') {
    return <ManufacturingContent />
  }

  if (solution.slug === 'industrial-laundry') {
    return <IndustrialLaundryContent />
  }

  return <SolutionPlaceholderContent solution={solution} />
}
