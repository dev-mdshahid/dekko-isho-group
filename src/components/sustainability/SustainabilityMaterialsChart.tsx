import { useRef } from 'react'

import type { MaterialBar } from '../../data/sustainability/content'
import { useMaterialsChartAnimation } from '../../hooks/useMaterialsChartAnimation'

type Props = {
  title: string
  materials: MaterialBar[]
  maxPercentage: number
}

export function SustainabilityMaterialsChart({ title, materials, maxPercentage }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  useMaterialsChartAnimation(cardRef, { materials, maxPercentage })

  return (
    <div ref={cardRef} className="sustain-materials-chart-card">
      <h3 className="sustain-materials-chart-title">{title}</h3>
      <div className="sustain-materials-bars">
        {materials.map((material) => (
          <div key={material.id} className="sustain-material-bar-row">
            <div className="sustain-material-bar-label">{material.name}</div>
            <div className="sustain-material-bar-track">
              <div className="sustain-material-bar-fill" />
            </div>
            <div className="sustain-material-bar-value">
              <span className="sustain-material-bar-value-num" />
              %
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
