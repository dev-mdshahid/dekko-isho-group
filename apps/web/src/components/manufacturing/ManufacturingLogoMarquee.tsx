import type { CSSProperties, Key } from 'react'
import type { ManufacturingClientLogo, ManufacturingClientRegionId } from '../../data/manufacturing/content'
import LogoLoop, { type LogoItem } from '../ui/LogoLoop'

export interface ManufacturingLogoMarqueeProps {
  logos: ManufacturingClientLogo[]
  regionId: ManufacturingClientRegionId
  regionLabel: string
}

const renderLogoItem = (item: LogoItem, _key: Key) => {
  if (!('src' in item) || item.width == null) return null

  return (
    <span
      className="mfg-client-marquee-item"
      style={{ '--logo-width': `${item.width}px` } as CSSProperties}
    >
      <img
        src={item.src}
        alt={item.alt ?? ''}
        className="mfg-client-marquee-image"
        draggable={false}
      />
    </span>
  )
}

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
        <LogoLoop
          key={regionId}
          logos={logos}
          speed={50}
          direction="left"
          gap={128}
          hoverSpeed={0}
          ariaLabel={`${regionLabel} client logos`}
          className="mfg-client-marquee-loop"
          renderItem={renderLogoItem}
        />
      </div>
    </div>
  )
}
