import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type IndustryFeatureGalleryImage = {
  src: string
  alt: string
}

export type IndustryFeatureGalleryProps = {
  id?: string
  badge: string
  title: string
  descriptions: string[]
  primaryImage: IndustryFeatureGalleryImage
  secondaryImages: [IndustryFeatureGalleryImage, IndustryFeatureGalleryImage]
}

export function IndustryFeatureGallery({
  id = 'industry-feature-gallery',
  badge,
  title,
  descriptions,
  primaryImage,
  secondaryImages,
}: IndustryFeatureGalleryProps) {
  return (
    <section className="industry-feature-gallery">
      <div className="industry-feature-gallery-container">
        <div className="industry-feature-gallery-layout">
          <FadeIn id={`${id}-copy`} className="industry-feature-gallery-copy">
            <PreSectionTitle title={badge} />
            <div className="industry-feature-gallery-body">
              <h2 className="industry-feature-gallery-title">{title}</h2>
              <div className="industry-feature-gallery-descriptions">
                {descriptions.map((paragraph) => (
                  <p key={paragraph} className="industry-feature-gallery-description">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn id={`${id}-media`} className="industry-feature-gallery-media" delay={60}>
            <div className="industry-feature-gallery-primary">
              <img
                src={primaryImage.src}
                loading="lazy"
                alt={primaryImage.alt}
                className="industry-feature-gallery-image"
              />
            </div>
            <div className="industry-feature-gallery-stack">
              {secondaryImages.map((image) => (
                <div key={image.src} className="industry-feature-gallery-stack-item">
                  <img
                    src={image.src}
                    loading="lazy"
                    alt={image.alt}
                    className="industry-feature-gallery-image"
                  />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
