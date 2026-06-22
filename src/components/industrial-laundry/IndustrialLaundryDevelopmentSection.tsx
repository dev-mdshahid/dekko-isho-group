import { industrialLaundryDevelopment } from '../../data/industrial-laundry/content'
import { FadeIn } from '../ui/FadeIn'

export function IndustrialLaundryDevelopmentSection() {
  const { title, description, image, imageAlt, imageLabel } = industrialLaundryDevelopment

  return (
    <section className="service-inner-section il-development-section">
      <div className="container">
        <div className="il-development-layout">
          <FadeIn id="il-development-title" className="il-development-title-col">
            <h2 className="il-development-title">{title}</h2>
          </FadeIn>

          <FadeIn id="il-development-image" className="il-development-image-col" delay={60}>
            <div className="il-development-image-wrap">
              <img src={image} loading="lazy" alt={imageAlt} className="il-development-image" />
              <span className="il-development-image-label">{imageLabel}</span>
            </div>
          </FadeIn>

          <FadeIn id="il-development-copy" className="il-development-copy-col" delay={120}>
            <p className="il-development-description">{description}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
