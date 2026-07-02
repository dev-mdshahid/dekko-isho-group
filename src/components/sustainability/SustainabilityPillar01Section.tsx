import { pillar01 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'
import { SustainabilityInitiativeCard } from './SustainabilityInitiativeCard'
import { SustainabilityInitiativesGrid } from './SustainabilityInitiativesGrid'
import { SustainabilitySnapshotCard } from './SustainabilitySnapshotCard'
import { SustainabilitySnapshotGrid } from './SustainabilitySnapshotGrid'

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

        <SustainabilityInitiativesGrid>
          {pillar01.initiatives.map((item, index) => (
            <div key={item.id} className="sustain-initiative-card-wrap">
              <SustainabilityInitiativeCard item={item} index={index} />
            </div>
          ))}
        </SustainabilityInitiativesGrid>

        <FadeIn id="sustain-pillar01-snapshot" className="sustain-snapshot-section">
          <div className="sustain-snapshot-header">
            <SustainabilityBadge title={pillar01.snapshotBadge} />
            <h3 className="sustain-snapshot-headline">{pillar01.snapshotHeadline}</h3>
          </div>
          <SustainabilitySnapshotGrid>
            {pillar01.snapshotKpis.map((kpi) => (
              <div key={kpi.id} className="sustain-snapshot-card-wrap">
                <SustainabilitySnapshotCard kpi={kpi} />
              </div>
            ))}
          </SustainabilitySnapshotGrid>
        </FadeIn>
      </div>
    </section>
  )
}
