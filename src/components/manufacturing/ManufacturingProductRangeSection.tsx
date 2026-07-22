import { manufacturingProductRange } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function ManufacturingProductRangeSection() {
  const { badge, title, items } = manufacturingProductRange

  return (
    <section className="mfg-product-range-section section-spacing">
      <div className="container">
        <FadeIn id="mfg-product-range-header" className="mfg-product-range-header">
          <PreSectionTitle title={badge} />
          <h2 className="section-title title-center mfg-product-range-title">{title}</h2>
        </FadeIn>

        <div className="mfg-product-range-grid">
          {items.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`mfg-product-range-${item.id}`}
              className="mfg-product-range-card"
              delay={index * 40}
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
            </FadeIn>
          ))}
        </div>
      </div>

      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
