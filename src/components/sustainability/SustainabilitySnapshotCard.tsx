import { useRef } from 'react'

import type { SnapshotKpi } from '../../data/sustainability/content'
import { useGaugeAnimation } from '../../hooks/useGaugeAnimation'
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

function StatSnapshotCard({ kpi }: { kpi: Extract<SnapshotKpi, { type: 'stat' }> }) {
  const numericTarget = kpi.value.replace(/\D/g, '')

  return (
    <article className="sustain-snapshot-card sustain-snapshot-card--stat">
      <div className="sustain-snapshot-card-body">
        <p className="sustain-snapshot-card-value">
          <span
            className="sustain-snapshot-card-value-accent count"
            data-target={numericTarget}
            data-duration="4.5"
          >
            {kpi.value}
          </span>
          <span className="sustain-snapshot-card-value-suffix">{kpi.suffix}</span>
        </p>
        <SnapshotLabel lines={kpi.labelLines} />
      </div>
    </article>
  )
}

function GaugeSnapshotCard({ kpi }: { kpi: Extract<SnapshotKpi, { type: 'gauge' }> }) {
  const cardRef = useRef<HTMLElement>(null)
  const displayPct = useGaugeAnimation(kpi.percentage, cardRef)

  return (
    <article ref={cardRef} className="sustain-snapshot-card sustain-snapshot-card--gauge">
      <div className="sustain-snapshot-gauge-wrap">
        <SustainabilitySnapshotGauge percentage={displayPct} />
        <div className="sustain-snapshot-gauge-center">
          <p className="sustain-snapshot-card-value">
            <span className="sustain-snapshot-card-value-accent">{Math.round(displayPct)}</span>
            <span className="sustain-snapshot-card-value-suffix">%</span>
          </p>
          <SnapshotLabel lines={kpi.labelLines} />
        </div>
      </div>
    </article>
  )
}

export function SustainabilitySnapshotCard({ kpi }: Props) {
  if (kpi.type === 'stat') {
    return <StatSnapshotCard kpi={kpi} />
  }

  return <GaugeSnapshotCard kpi={kpi} />
}
