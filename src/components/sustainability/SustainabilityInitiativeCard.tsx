import { useRef } from 'react'

import { useInitiativeCardAnimation } from '../../hooks/useInitiativeCardAnimation'

export type SustainabilityInitiativeCardData = {
  number: string
  title: string
  description: string
  metricValue: string
  metricLabel: string
  image: string
  imageAlt: string
}

type Props = {
  item: SustainabilityInitiativeCardData
  index?: number
}

export function SustainabilityInitiativeCard({ item, index = 0 }: Props) {
  const cardRef = useRef<HTMLElement>(null)

  useInitiativeCardAnimation(cardRef, { index })

  return (
    <article ref={cardRef} className="sustain-initiative-card">
      <div className="sustain-card-glow" aria-hidden="true" />
      <div className="sustain-initiative-media">
        <img
          src={item.image}
          loading="lazy"
          alt={item.imageAlt}
          className="sustain-initiative-image"
        />
        <div className="sustain-initiative-shine" aria-hidden="true" />
        <div className="sustain-initiative-number">{item.number}</div>
      </div>
      <div className="sustain-initiative-content">
        <h3 className="sustain-initiative-title">{item.title}</h3>
        <p className="sustain-initiative-description">{item.description}</p>
        <div className="sustain-initiative-metric">
          <div className="sustain-initiative-metric-line" aria-hidden="true" />
          <p className="sustain-initiative-metric-text">
            <span className="sustain-initiative-metric-value">{item.metricValue}</span>{' '}
            <span className="sustain-initiative-metric-label">{item.metricLabel}</span>
          </p>
        </div>
      </div>
    </article>
  )
}
