import { useCallback, useRef, useState } from 'react'

import type { FocusAreaCard } from '../../data/sustainability/content'
import { useFocusCardAnimation } from '../../hooks/useFocusCardAnimation'
import { SustainabilityFocusCardCarousel } from './SustainabilityFocusCardCarousel'

type Props = {
  item: FocusAreaCard
}

export function SustainabilityFocusCard({ item }: Props) {
  const cardRef = useRef<HTMLElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const hasMultiple = item.images.length > 1

  const handleHoverChange = useCallback((hovered: boolean) => {
    setIsHovered(hovered)
  }, [])

  useFocusCardAnimation(cardRef, { onHoverChange: handleHoverChange })

  return (
    <article ref={cardRef} className="sustain-focus-card">
      <div className="sustain-card-glow" aria-hidden="true" />
      <h3 className="sustain-focus-card-title">{item.title}</h3>
      <SustainabilityFocusCardCarousel
        images={item.images}
        isPlaying={isHovered && hasMultiple}
      />
    </article>
  )
}
