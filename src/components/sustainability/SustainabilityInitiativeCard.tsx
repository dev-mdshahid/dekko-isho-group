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
}

export function SustainabilityInitiativeCard({ item }: Props) {
  return (
    <article className="sustain-initiative-card">
      <div className="sustain-initiative-media">
        <img
          src={item.image}
          loading="lazy"
          alt={item.imageAlt}
          className="sustain-initiative-image"
        />
        <div className="sustain-initiative-number">{item.number}</div>
      </div>
      <div className="sustain-initiative-content">
        <h3 className="sustain-initiative-title">{item.title}</h3>
        <p className="sustain-initiative-description">{item.description}</p>
        <div className="sustain-initiative-metric">
          <span className="sustain-initiative-metric-value">{item.metricValue}</span>{' '}
          <span className="sustain-initiative-metric-label">{item.metricLabel}</span>
        </div>
      </div>
    </article>
  )
}
