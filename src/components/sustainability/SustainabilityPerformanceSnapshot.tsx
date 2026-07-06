import {
  performanceSnapshot,
  type PerformanceSnapshotCard,
  type PerformanceSnapshotFooterItem,
} from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'

function PerformanceSnapshotStat({
  stat,
}: {
  stat: PerformanceSnapshotCard['stats'][number]
}) {
  return (
    <div className={`sustain-progress-stat${stat.lead ? ' sustain-progress-stat--lead' : ''}`}>
      <span className="sustain-progress-stat-value">
        {stat.value}
        {stat.unit ? <small> {stat.unit}</small> : null}
      </span>
      <span className="sustain-progress-stat-label">{stat.label}</span>
    </div>
  )
}

function PerformanceSnapshotFootBlock({ item }: { item: PerformanceSnapshotFooterItem }) {
  return (
    <div className="sustain-progress-foot-block">
      <span className="sustain-progress-foot-block-title">{item.title}</span>
      <span className="sustain-progress-foot-block-text">{item.text}</span>
    </div>
  )
}

function PerformanceSnapshotCardView({ card }: { card: PerformanceSnapshotCard }) {
  const hasFooterGrid = Boolean(card.footer?.length)

  if (hasFooterGrid) {
    return (
      <div
        className={`sustain-progress-card sustain-progress-card--${card.theme} sustain-progress-card--grid-foot`}
      >
        <div className="sustain-progress-card-title">
          <span className="sustain-progress-card-category">{card.category}</span>
          <h4 className="sustain-progress-card-heading">{card.title}</h4>
          <p className="sustain-progress-card-description">{card.description}</p>
        </div>
        <div className="sustain-progress-card-grid">
          <div className="sustain-progress-card-stats-row">
            {card.stats.map((stat) => (
              <PerformanceSnapshotStat key={stat.label} stat={stat} />
            ))}
          </div>
          <div className="sustain-progress-card-foot-row">
            {card.footer!.map((item) => (
              <PerformanceSnapshotFootBlock key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statsCol2 = card.stats.filter((_, index) => index % 2 === 0)
  const statsCol3 = card.stats.filter((_, index) => index % 2 === 1)

  return (
    <div className={`sustain-progress-card sustain-progress-card--${card.theme}`}>
      <div className="sustain-progress-card-title">
        <span className="sustain-progress-card-category">{card.category}</span>
        <h4 className="sustain-progress-card-heading">{card.title}</h4>
        <p className="sustain-progress-card-description">{card.description}</p>
      </div>
      <div className="sustain-progress-card-col">
        {statsCol2.map((stat) => (
          <PerformanceSnapshotStat key={stat.label} stat={stat} />
        ))}
      </div>
      <div className="sustain-progress-card-col">
        {statsCol3.map((stat) => (
          <PerformanceSnapshotStat key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  )
}

export function SustainabilityPerformanceSnapshot() {
  return (
    <FadeIn id="sustain-pillar01-snapshot" className="sustain-progress-section">
      <div className="sustain-progress-head">
        <span className="sustain-progress-pill">
          <span className="sustain-progress-pill-sq" aria-hidden="true" />
          {performanceSnapshot.badge}
        </span>
        <h3 className="sustain-progress-headline">{performanceSnapshot.headline}</h3>
      </div>

      {performanceSnapshot.cards.map((card) => (
        <PerformanceSnapshotCardView key={card.id} card={card} />
      ))}
    </FadeIn>
  )
}
