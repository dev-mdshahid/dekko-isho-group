import { manufacturingProductRange } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function ManufacturingProductRangeSection() {
  const { badge, title, description, items } = manufacturingProductRange

  return (
    <section className="mfg-product-range-section">
      <div className="container">
        <FadeIn
          id="mfg-product-range-header"
          className="mfg-product-range-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="mfg-product-range-title">{title}</h2>
          <p className="mfg-product-range-description">{description}</p>
        </FadeIn>

        <div className="mfg-product-range-grid" data-solution-animate-group>
          {items.map((item) => (
            <div
              key={item.id}
              id={`mfg-product-range-${item.id}`}
              className="mfg-product-range-card"
              data-solution-animate="tilt-card"
            >
              <img
                src={item.image}
                alt={item.label}
                loading="lazy"
                decoding="async"
                className="mfg-product-range-card-image"
              />
              <div className="mfg-product-range-card-overlay" aria-hidden="true" />
              <h3 className="mfg-product-range-card-label">{item.label}</h3>
            </div>
          ))}
        </div>
      </div>

      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
