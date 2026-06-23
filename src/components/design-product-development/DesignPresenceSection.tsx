import { designProductDevelopmentPresence } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function DesignPresenceSection() {
  const { badge, title, description, primaryImage, gridImages, bannerImage } =
    designProductDevelopmentPresence

  return (
    <section className="dpd-presence-section">
      <div className="dpd-presence-container">
        <FadeIn id="dpd-presence-header" className="dpd-presence-header">
          <PreSectionTitle title={badge} />
          <h2 className="dpd-presence-title">{title}</h2>
          <p className="dpd-presence-description">{description}</p>
        </FadeIn>

        <FadeIn id="dpd-presence-gallery" className="dpd-presence-gallery" delay={60}>
          <div className="dpd-presence-gallery-row">
            <div className="dpd-presence-gallery-primary">
              <img
                src={primaryImage.src}
                loading="lazy"
                alt={primaryImage.alt}
                className="dpd-presence-gallery-image"
              />
            </div>

            <div className="dpd-presence-gallery-grid">
              {gridImages.map((image) => (
                <div key={image.src} className="dpd-presence-gallery-grid-item">
                  <img
                    src={image.src}
                    loading="lazy"
                    alt={image.alt}
                    className="dpd-presence-gallery-image"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="dpd-presence-gallery-banner">
            <img
              src={bannerImage.src}
              loading="lazy"
              alt={bannerImage.alt}
              className="dpd-presence-gallery-image"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
