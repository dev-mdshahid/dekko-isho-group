import { designProductDevelopmentShowroom } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignShowroomSection() {
  const {
    badge,
    titleBefore,
    titleAccent,
    description,
    addressLabel,
    addressLines,
    mapLabel,
    mapHref,
  } = designProductDevelopmentShowroom

  return (
    <section className="dpd-showroom-section">
      <div className="container">
        <FadeIn id="dpd-showroom-copy" className="dpd-showroom-layout">
          <PreSectionTitle title={badge} />
          <h2 className="dpd-showroom-title">
            {titleBefore}
            <span className="dpd-showroom-accent">{titleAccent}</span>
          </h2>
          <p className="dpd-showroom-description">{description}</p>
          <div className="dpd-showroom-address">
            <p className="dpd-showroom-address-label">{addressLabel}</p>
            <p className="dpd-showroom-address-text">
              {addressLines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < addressLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
            <a
              href={mapHref}
              className="dpd-showroom-map-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {mapLabel}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
