import { type PropsWithChildren, useRef } from 'react'

import { useSnapshotGridReveal } from '../../hooks/useStaggeredGridReveal'

export function SustainabilitySnapshotGrid({ children }: PropsWithChildren) {
  const gridRef = useRef<HTMLDivElement>(null)

  useSnapshotGridReveal(gridRef)

  return (
    <div ref={gridRef} className="sustain-snapshot-cards">
      {children}
    </div>
  )
}
