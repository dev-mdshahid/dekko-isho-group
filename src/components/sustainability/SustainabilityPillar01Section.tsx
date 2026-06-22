import { pillar01 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'

export function SustainabilityPillar01Section() {
  return (
    <section className="sustain-pillar-section sustain-pillar-section--light">
      <div className="container-medium">
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
              className="sustain-initiative-card"
              delay={index * 50}
            >
              <div className="sustain-initiative-number">{item.number}</div>
              <div className="sustain-initiative-content">
                <h3 className="sustain-initiative-title">{item.title}</h3>
                <p className="sustain-initiative-description">{item.description}</p>
                <div className="sustain-initiative-metric">
                  <span className="sustain-initiative-metric-value">{item.metricValue}</span>{' '}
                  <span className="sustain-initiative-metric-label">{item.metricLabel}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn id="sustain-pillar01-snapshot" className="sustain-snapshot-banner">
          <div className="sustain-snapshot-header">
            <SustainabilityBadge title={pillar01.snapshotBadge} variant="dark" />
            <h3 className="sustain-snapshot-headline">{pillar01.snapshotHeadline}</h3>
          </div>
          <div className="sustain-snapshot-kpis">
            {pillar01.snapshotKpis.map((kpi) => (
              <div key={kpi.id} className="sustain-snapshot-kpi">
                <div className="sustain-snapshot-kpi-value">{kpi.value}</div>
                <div className="sustain-snapshot-kpi-label">{kpi.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
