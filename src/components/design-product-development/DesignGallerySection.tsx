import { designProductDevelopmentGallery } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function DesignGallerySection() {
  const { id, badge, title, description, images } = designProductDevelopmentGallery

  return (
    <section id={id} className="dpd-gallery-section">
      <div className="dpd-gallery-container">
        <FadeIn
          id="dpd-gallery-header"
          className="dpd-gallery-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="dpd-gallery-title">{title}</h2>
          <p className="dpd-gallery-description">{description}</p>
        </FadeIn>

        <FadeIn
          id="dpd-gallery-row"
          className="dpd-gallery-row"
          delay={60}
          variant="slide-in-bottom"
        >
          {images.map((image) => (
            <div
              key={image.id}
              className={`dpd-gallery-item dpd-gallery-item--${image.size}`}
            >
              <img
                src={image.src}
                loading="lazy"
                alt={image.alt}
                className="dpd-gallery-image"
                data-solution-animate="media-parallax"
              />
            </div>
          ))}
        </FadeIn>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
