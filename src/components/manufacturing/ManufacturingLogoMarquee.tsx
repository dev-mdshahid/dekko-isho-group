import type { CSSProperties } from 'react'
import type { ManufacturingClientLogo, ManufacturingClientRegionId } from '../../data/manufacturing/content'

export interface ManufacturingLogoMarqueeProps {
  logos: ManufacturingClientLogo[]
  regionId: ManufacturingClientRegionId
  regionLabel: string
}

const COPY_COUNT = 2

export function ManufacturingLogoMarquee({ logos, regionId, regionLabel }: ManufacturingLogoMarqueeProps) {
  if (logos.length === 0) {
    return (
      <div className="mfg-client-marquee mfg-client-marquee-empty" role="status">
        Partner portfolio coming soon.
      </div>
    )
  }

  return (
    <div className="mfg-client-marquee">
      <div
        className="mfg-client-marquee-viewport"
        tabIndex={0}
        role="region"
        aria-label={`${regionLabel} client logos. Focus or hover to pause scrolling.`}
      >
        <div key={regionId} className="mfg-client-marquee-track">
          {Array.from({ length: COPY_COUNT }, (_, copyIndex) => (
            <ul key={copyIndex} className="mfg-client-marquee-list" aria-hidden={copyIndex === 0 ? undefined : true}>
              {logos.map((logo) => (
                <li
                  key={logo.src}
                  style={{ '--logo-width': `${logo.width}px` } as CSSProperties}
                  className="mfg-client-marquee-item"
                >
                  <img
                    src={logo.src}
                    alt={copyIndex === 0 ? logo.alt : ''}
                    className="mfg-client-marquee-image"
                    draggable={false}
                    loading="eager"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
