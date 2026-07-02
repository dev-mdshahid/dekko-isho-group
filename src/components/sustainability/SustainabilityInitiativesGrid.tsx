import { type PropsWithChildren, useRef } from 'react'

import { useInitiativeGridReveal } from '../../hooks/useStaggeredGridReveal'

export function SustainabilityInitiativesGrid({ children }: PropsWithChildren) {
  const gridRef = useRef<HTMLDivElement>(null)

  useInitiativeGridReveal(gridRef)

  return (
    <div ref={gridRef} className="sustain-initiatives-grid">
      {children}
    </div>
  )
}
