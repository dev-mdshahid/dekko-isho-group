import { manufacturingSewing } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingSewingSection() {
  const { badge, title, description, images } = manufacturingSewing

  return (
    <section className="service-inner-section mfg-sewing-section">
      <div className="container">
        <div className="service-inner-main mfg-sewing-main">
          <div className="mfg-sewing-layout">
            <FadeIn id="mfg-sewing-text" className="mfg-sewing-content">
              <PreSectionTitle title={badge} />
              <h2 className="mfg-sewing-title">{title}</h2>
              <p className="mfg-sewing-description">{description}</p>
            </FadeIn>

            <FadeIn id="mfg-sewing-media" className="mfg-sewing-media" delay={80}>
              <div className="mfg-sewing-grid">
                {images.map((image) => (
                  <div key={image.src} className="mfg-sewing-image-wrap">
                    <img src={image.src} loading="lazy" alt={image.alt} className="mfg-sewing-image" />
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
