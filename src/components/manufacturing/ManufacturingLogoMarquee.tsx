import type { ManufacturingClientLogo, ManufacturingClientRegionId } from '../../data/manufacturing/content'

export interface ManufacturingLogoMarqueeProps {
  logos: ManufacturingClientLogo[]
  regionId: ManufacturingClientRegionId
  regionLabel: string
}

const COPY_COUNT = 3

export function ManufacturingLogoMarquee({ logos, regionId }: ManufacturingLogoMarqueeProps) {
  const hasLogos = logos.length > 0
  const visibleLogos = Array.from(
    { length: hasLogos ? Math.max(logos.length, 8) : 0 },
    (_, index) => ({ ...logos[index % logos.length], originalIndex: index % logos.length }),
  )

  if (!hasLogos) {
    return (
      <div className="mfg-client-marquee mfg-client-marquee-empty" role="status">
        Partner portfolio coming soon.
      </div>
    )
  }

  return (
    <div className="mfg-client-marquee">
      <div className="mfg-client-marquee-viewport">
        <div className="mfg-client-marquee-track">
          {Array.from({ length: COPY_COUNT }, (_, copyIndex) => (
            <div key={`${regionId}-${copyIndex}`} className="mfg-client-marquee-list" aria-hidden={copyIndex === 0 ? undefined : true}>
              {visibleLogos.map((logo, index) => (
                <div key={`${copyIndex}-${index}-${logo.alt}`} style={{ border: "1px solid #dce5f0", borderRadius: "1rem" }} className="mfg-client-marquee-item">
                  <img src={logo.src} alt={copyIndex === 0 && logo.originalIndex === index ? logo.alt : ''} className="mfg-client-marquee-image" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
