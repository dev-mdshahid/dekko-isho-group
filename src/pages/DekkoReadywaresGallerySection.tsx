import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import { SectionLines } from '../components/ui/SectionDecor'
import { dekkoReadywaresGalleryImages } from '../data/industry/dekkoReadywaresGallery'

export function DekkoReadywaresGallerySection() {
  return (
    <section className="dekko-readywares-gallery">
      <SectionLines border="dark" />

      <div className="dekko-readywares-gallery-container">
        <FadeIn id="dekko-readywares-gallery-header" className="dekko-readywares-gallery-header">
          <PreSectionTitle title="Photo Gallery" variant="bg-dark" />
          <h2 className="dekko-readywares-gallery-title">
            Visual production journey from sample to packed garment.
          </h2>
          <p className="dekko-readywares-gallery-description">
            Image-focused sections make the page stronger by showing the readywear process, product
            categories, garment handling, quality checking, and production floor atmosphere.
          </p>
        </FadeIn>

        <div className="dekko-readywares-gallery-grid" role="list">
          {dekkoReadywaresGalleryImages.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`dekko-readywares-gallery-${item.id}`}
              className={`dekko-readywares-gallery-item dekko-readywares-gallery-item--${item.id}${item.grayscale ? ' dekko-readywares-gallery-item--grayscale' : ''}`}
              delay={index * 50}
            >
              <div className="dekko-readywares-gallery-item-inner" role="listitem">
                <img
                  src={item.src}
                  loading="lazy"
                  alt={item.alt}
                  className="dekko-readywares-gallery-image"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>

      <div className="dekko-readywares-gallery-glow" aria-hidden="true" />
    </section>
  )
}
