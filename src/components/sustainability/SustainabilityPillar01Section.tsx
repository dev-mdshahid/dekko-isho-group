import { pillar01 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'
import { SustainabilityInitiativeCard } from './SustainabilityInitiativeCard'
import { SustainabilitySnapshotCard } from './SustainabilitySnapshotCard'

export function SustainabilityPillar01Section() {
  return (
    <section className="sustain-pillar-section sustain-pillar-section--environment">
      <div className="sustain-pillar-texture-overlay" aria-hidden="true" />

      <div className="container-medium sustain-pillar01-container">
        <FadeIn id="sustain-pillar01-header" className="sustain-pillar-header">
          <span className="sustain-pillar-number" aria-hidden="true">
            {pillar01.number}
          </span>
          <div className="sustain-pillar-header-content">
            <SustainabilityBadge title={pillar01.badge} />
            <h2 className="sustain-section-title">{pillar01.title}</h2>
            <p className="sustain-section-description">{pillar01.description}</p>
          </div>
        </FadeIn>

        <div className="sustain-initiatives-grid">
          {pillar01.initiatives.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`sustain-p01-${item.id}`}
              className="sustain-initiative-card-wrap"
              delay={index * 50}
            >
              <SustainabilityInitiativeCard item={item} />
            </FadeIn>
          ))}
        </div>

        <FadeIn id="sustain-pillar01-snapshot" className="sustain-snapshot-section">
          <div className="sustain-snapshot-header">
            <SustainabilityBadge title={pillar01.snapshotBadge} />
            <h3 className="sustain-snapshot-headline">{pillar01.snapshotHeadline}</h3>
          </div>
          <div className="sustain-snapshot-cards">
            {pillar01.snapshotKpis.map((kpi, index) => (
              <FadeIn
                key={kpi.id}
                id={`sustain-snapshot-${kpi.id}`}
                className="sustain-snapshot-card-wrap"
                delay={index * 50}
              >
                <SustainabilitySnapshotCard kpi={kpi} />
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
