import { type PropsWithChildren, useRef } from 'react'

import { useStaggeredGridReveal } from '../../hooks/useStaggeredGridReveal'

type Props = PropsWithChildren<{
  twoColumn?: boolean
}>

export function SustainabilityInitiativesGrid({ children, twoColumn = false }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)

  useStaggeredGridReveal(gridRef, '.sustain-initiative-card-wrap', {
    once: true,
    requireScrollDown: true,
  })

  return (
    <div
      ref={gridRef}
      className={`sustain-initiatives-grid${twoColumn ? ' sustain-initiatives-grid--two-column' : ''}`}
    >
      {children}
    </div>
  )
}
