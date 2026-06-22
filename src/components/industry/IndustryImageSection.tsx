import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type IndustryImageSectionProps = {
  badge: string
  title: string
  aside: string
  imageSrc: string
  imageAlt: string
  imageNumber: string
  imageLabel: string
}

export function IndustryImageSection({
  badge,
  title,
  aside,
  imageSrc,
  imageAlt,
  imageNumber,
  imageLabel,
}: IndustryImageSectionProps) {
  return (
    <section className="industry-image-section">
      <div className="industry-image-section-container">
        <div className="industry-image-section-layout">
          <FadeIn id="industry-image-copy" className="industry-image-section-copy">
            <PreSectionTitle title={badge} />
            <h2 className="industry-image-section-title">{title}</h2>
          </FadeIn>

          <FadeIn id="industry-image-media" className="industry-image-section-media" delay={60}>
            <img
              src={imageSrc}
              loading="lazy"
              alt={imageAlt}
              className="industry-image-section-photo"
            />
            <div className="industry-image-section-overlay" aria-hidden="true" />
            <div className="industry-image-section-caption">
              <span className="industry-image-section-number">{imageNumber}</span>
              <span className="industry-image-section-label">{imageLabel}</span>
            </div>
          </FadeIn>

          <FadeIn id="industry-image-aside" className="industry-image-section-aside" delay={120}>
            <p className="industry-image-section-aside-text">{aside}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
