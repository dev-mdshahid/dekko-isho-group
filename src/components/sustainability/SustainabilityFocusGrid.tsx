import { type PropsWithChildren, useRef } from 'react'

import { useStaggeredGridReveal } from '../../hooks/useStaggeredGridReveal'

export function SustainabilityFocusGrid({ children }: PropsWithChildren) {
  const gridRef = useRef<HTMLDivElement>(null)

  useStaggeredGridReveal(gridRef, '.sustain-focus-card-wrap', {
    once: true,
    requireScrollDown: true,
  })

  return (
    <div ref={gridRef} className="sustain-focus-grid">
      {children}
    </div>
  )
}
