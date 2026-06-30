import type { SnapshotKpi } from '../../data/sustainability/content'
import { SustainabilitySnapshotGauge } from './SustainabilitySnapshotGauge'

type Props = {
  kpi: SnapshotKpi
}

function SnapshotLabel({ lines }: { lines: [string, string] }) {
  return (
    <p className="sustain-snapshot-card-label">
      <span>{lines[0]}</span>
      <span>{lines[1]}</span>
    </p>
  )
}

export function SustainabilitySnapshotCard({ kpi }: Props) {
  if (kpi.type === 'stat') {
    return (
      <article className="sustain-snapshot-card sustain-snapshot-card--stat">
        <div className="sustain-snapshot-card-body">
          <p className="sustain-snapshot-card-value">
            <span className="sustain-snapshot-card-value-accent">{kpi.value}</span>
            <span className="sustain-snapshot-card-value-suffix">{kpi.suffix}</span>
          </p>
          <SnapshotLabel lines={kpi.labelLines} />
        </div>
      </article>
    )
  }

  return (
    <article className="sustain-snapshot-card sustain-snapshot-card--gauge">
      <div className="sustain-snapshot-gauge-wrap">
        <SustainabilitySnapshotGauge percentage={kpi.percentage} />
        <div className="sustain-snapshot-gauge-center">
          <p className="sustain-snapshot-card-value">
            <span className="sustain-snapshot-card-value-accent">{kpi.percentage}</span>
            <span className="sustain-snapshot-card-value-suffix">%</span>
          </p>
          <SnapshotLabel lines={kpi.labelLines} />
        </div>
      </div>
    </article>
  )
}
