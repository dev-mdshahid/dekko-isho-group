import { manufacturingSewing } from '../../data/manufacturing/content'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingSewingSection() {
  const { badge, title, description, images } = manufacturingSewing

  return (
    <section className="section-spacing mfg-sewing-section">
      <div className="container">
        <div className="section-title-wrap one">
          <FadeIn id="mfg-sewing-text" className="section-title-intro">
            <PreSectionTitle title={badge} />
            <h2 className="section-title">{title}</h2>
            <p className="service-info-description">{description}</p>
          </FadeIn>

          <div className="mfg-sewing-grid">
            {images.map((image, index) => (
              <FadeIn
                key={image.src}
                id={`mfg-sewing-img-${index}`}
                className="mfg-sewing-image-wrap"
                delay={index * 60}
              >
                <img src={image.src} loading="lazy" alt={image.alt} className="mfg-sewing-image" />
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
