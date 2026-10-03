import { useRef } from 'react'

import { useMaterialsProgressAnimation } from '../../hooks/useMaterialsProgressAnimation'

type Props = {
  sustainablePercentage: number
  sustainableLabel: string
}

export function SustainabilityMaterialsProgressCard({
  sustainablePercentage,
  sustainableLabel,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  useMaterialsProgressAnimation(cardRef, { sustainablePercentage })

  return (
    <div ref={cardRef} className="sustain-materials-progress-card">
      <div className="sustain-materials-progress-copy">
        <p className="sustain-materials-progress-value">
          <span className="sustain-materials-progress-value-num" />
          <span className="sustain-materials-progress-value-suffix">%</span>
        </p>
        <p className="sustain-materials-progress-label">{sustainableLabel}</p>
      </div>
      <div className="sustain-materials-progress-metrics">
        <div className="sustain-progress-bar">
          <div className="sustain-progress-bar-fill" />
        </div>
        <div className="sustain-progress-legend">
          <div className="sustain-progress-legend-item sustain-progress-legend-item--primary">
            <span className="sustain-progress-legend-swatch sustain-progress-legend-swatch--primary" />
            <span>
              <span className="sustain-progress-legend-pct sustain-progress-legend-pct--primary" />
              % Sustainable
            </span>
          </div>
          <div className="sustain-progress-legend-item sustain-progress-legend-item--muted">
            <span className="sustain-progress-legend-swatch sustain-progress-legend-swatch--muted" />
            <span>
              <span className="sustain-progress-legend-pct sustain-progress-legend-pct--muted" />
              % Conventional
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
