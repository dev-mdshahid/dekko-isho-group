import type { MouseEvent, PointerEvent, TransitionEvent } from 'react'

import type { AwardHonor } from '../../data/awards/honors'

type Props = {
  award: AwardHonor
  cardKey: string
  isGhost?: boolean
  isReentering?: boolean
  onActivate?: (cardKey: string, award: AwardHonor, element: HTMLDivElement) => void
  onDeactivate?: (cardKey: string) => void
  onReentryEnd?: (cardKey: string) => void
}

export function AwardHonorCard({
  award,
  cardKey,
  isGhost = false,
  isReentering = false,
  onActivate,
  onDeactivate,
  onReentryEnd,
}: Props) {
  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || isGhost) return
    onActivate?.(cardKey, award, event.currentTarget)
  }

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || isGhost) return
    onDeactivate?.(cardKey)
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    onActivate?.(cardKey, award, event.currentTarget)
  }

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'opacity' || !isReentering) return
    onReentryEnd?.(cardKey)
  }

  return (
    <div
      className={[
        'awards-honor-card',
        isGhost ? 'awards-honor-card--ghost' : '',
        isReentering ? 'awards-honor-card--reentering' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      onTransitionEnd={handleTransitionEnd}
      role="button"
      tabIndex={0}
      aria-label={`${award.title}, ${award.year}. ${award.category}`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onActivate?.(cardKey, award, event.currentTarget)
        }
      }}
    >
      <div className="awards-honor-card__media">
        <img
          src={award.image}
          alt={award.imageAlt}
          className="awards-honor-card__image"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="awards-honor-card__caption" aria-hidden="true">
        <div className="awards-honor-card__caption-top">
          <h3 className="awards-honor-card__title">{award.title}</h3>
          <span className="awards-honor-card__year">{award.year}</span>
        </div>
        <p className="awards-honor-card__organization">{award.category}</p>
      </div>
    </div>
  )
}
