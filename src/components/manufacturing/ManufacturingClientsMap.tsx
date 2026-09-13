import type { KeyboardEvent } from 'react'
import type { ManufacturingClientRegionId } from '../../data/manufacturing/content'

interface ManufacturingClientsMapProps {
  activeRegionId: ManufacturingClientRegionId
  onRegionSelect: (regionId: ManufacturingClientRegionId) => void
}

const regionLabels: Record<ManufacturingClientRegionId, string> = {
  'north-america': 'North America',
  europe: 'Europe',
  international: 'International Markets',
}

const labelPositions: Record<ManufacturingClientRegionId, { x: number; y: number; width: number }> = {
  'north-america': { x: 170, y: 150, width: 150 },
  europe: { x: 518, y: 116, width: 90 },
  international: { x: 756, y: 308, width: 190 },
}

export function ManufacturingClientsMap({
  activeRegionId,
  onRegionSelect,
}: ManufacturingClientsMapProps) {
  const handleRegionKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    regionId: ManufacturingClientRegionId,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onRegionSelect(regionId)
  }

  const interactiveProps = (regionId: ManufacturingClientRegionId) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `Select ${regionLabels[regionId]}`,
    'aria-pressed': activeRegionId === regionId,
    onClick: () => onRegionSelect(regionId),
    onKeyDown: (event: KeyboardEvent<SVGGElement>) => handleRegionKeyDown(event, regionId),
  })

  const activeLabel = labelPositions[activeRegionId]

  return (
    <div className="mfg-clients-map-wrap">
      <svg
        className="mfg-clients-map"
        viewBox="0 0 980 460"
        role="group"
        aria-labelledby="mfg-clients-map-title mfg-clients-map-description"
      >
        <title id="mfg-clients-map-title">Global client markets</title>
        <desc id="mfg-clients-map-description">
          Select North America, Europe, or International Markets to view clients in that region.
        </desc>

        <g className="mfg-map-neutral" aria-hidden="true">
          <path d="M520 210 L556 200 L588 208 L602 196 L586 178 L560 168 L548 150 L560 138 L590 142 L606 160 L622 176 L616 200 L630 224 L624 252 L634 278 L622 304 L604 326 L588 344 L566 350 L556 332 L562 308 L548 288 L536 262 L520 240 Z" />
          <path d="M600 96 L660 80 L720 74 L780 82 L830 78 L860 92 L840 112 L790 108 L740 118 L690 112 L648 126 L610 118 L594 106 Z" />
          <path d="M588 178 L610 168 L628 176 L622 196 L602 200 L590 190 Z" />
        </g>

        <g
          className="mfg-map-region"
          data-region="north-america"
          data-active={activeRegionId === 'north-america'}
          {...interactiveProps('north-america')}
        >
          <path d="M70 90 L110 66 L150 60 L170 76 L210 68 L240 82 L226 106 L250 112 L246 138 L218 150 L224 176 L200 196 L206 222 L182 236 L160 224 L150 250 L126 254 L118 230 L96 220 L104 194 L84 176 L92 150 L72 138 L64 112 Z" />
        </g>

        <g
          className="mfg-map-region"
          data-region="europe"
          data-active={activeRegionId === 'europe'}
          {...interactiveProps('europe')}
        >
          <path d="M452 92 L472 78 L494 84 L500 70 L520 76 L534 92 L556 96 L560 116 L540 128 L546 148 L522 156 L498 148 L486 160 L466 152 L460 130 L440 122 L444 104 Z" />
        </g>

        <g
          className="mfg-map-region"
          data-region="international"
          data-active={activeRegionId === 'international'}
          {...interactiveProps('international')}
        >
          <path d="M210 262 L240 250 L262 260 L270 288 L258 316 L266 344 L250 368 L228 372 L218 346 L226 316 L212 292 Z" />
          <path d="M660 150 L700 138 L740 146 L768 138 L790 152 L778 176 L790 196 L770 216 L744 210 L730 228 L706 222 L698 198 L674 188 L668 166 Z" />
          <path d="M800 300 L840 292 L864 304 L856 326 L826 332 L804 320 Z" />
        </g>

        <g className="mfg-map-pins" aria-hidden="true">
          <g data-active={activeRegionId === 'north-america'} transform="translate(150,150)">
            <circle className="mfg-map-pin-ring" r="26" />
            <circle className="mfg-map-pin-dot" r="10" />
          </g>
          <g data-active={activeRegionId === 'europe'} transform="translate(498,116)">
            <circle className="mfg-map-pin-ring" r="26" />
            <circle className="mfg-map-pin-dot" r="10" />
          </g>
          <g data-active={activeRegionId === 'international'} transform="translate(826,308)">
            <circle className="mfg-map-pin-ring" r="26" />
            <circle className="mfg-map-pin-dot" r="10" />
          </g>
        </g>

        <g
          className="mfg-map-active-label"
          transform={`translate(${activeLabel.x},${activeLabel.y})`}
          aria-hidden="true"
        >
          <rect x="0" y="-16" width={activeLabel.width} height="32" rx="16" />
          <text x="16" y="5">{regionLabels[activeRegionId]}</text>
        </g>
      </svg>
    </div>
  )
}
