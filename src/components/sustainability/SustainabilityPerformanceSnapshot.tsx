import { Fragment } from 'react'

import {
  performanceSnapshot,
  type PerformanceSnapshotCard,
  type PerformanceSnapshotFooter,
} from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'

function PerformanceSnapshotFooter({ footer }: { footer: PerformanceSnapshotFooter }) {
  return (
    <div className="sustain-progress-card-foot">
      <span className="sustain-progress-foot-label">{footer.label}</span>
      {footer.type === 'single' ? (
        <span className="sustain-progress-foot-item">
          <b>{footer.bold}</b> {footer.text}
        </span>
      ) : (
        footer.items.map((item, index) => (
          <Fragment key={item.bold}>
            {index > 0 && <span className="sustain-progress-foot-sep">|</span>}
            <span className="sustain-progress-foot-item">
              <b>{item.bold}</b> · {item.text}
            </span>
          </Fragment>
        ))
      )}
    </div>
  )
}

function PerformanceSnapshotCardView({ card }: { card: PerformanceSnapshotCard }) {
  return (
    <div className={`sustain-progress-card sustain-progress-card--${card.theme}`}>
      <div className="sustain-progress-card-title">
        <span className="sustain-progress-card-category">{card.category}</span>
        <h4 className="sustain-progress-card-heading">{card.title}</h4>
        <p className="sustain-progress-card-description">{card.description}</p>
      </div>
      <div className="sustain-progress-card-right">
        <div
          className={`sustain-progress-stats sustain-progress-stats--c${card.statsColumns}`}
        >
          {card.stats.map((stat) => (
            <div
              key={stat.label}
              className={`sustain-progress-stat${stat.lead ? ' sustain-progress-stat--lead' : ''}`}
            >
              <span className="sustain-progress-stat-value">
                {stat.value}
                {stat.unit ? <small> {stat.unit}</small> : null}
              </span>
              <span className="sustain-progress-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
        <PerformanceSnapshotFooter footer={card.footer} />
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
