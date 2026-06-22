import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type IndustryImageSectionProps = {
  badge?: string
  title: string
  description?: string
  aside?: string
  imageSrc: string
  imageAlt: string
  imageNumber?: string
  imageLabel?: string
  showBadge?: boolean
  showCaption?: boolean
  className?: string
}

export function IndustryImageSection({
  badge,
  title,
  description,
  aside,
  imageSrc,
  imageAlt,
  imageNumber,
  imageLabel,
  showBadge = true,
  showCaption = true,
  className,
}: IndustryImageSectionProps) {
  const hasAside = Boolean(aside)
  const hasCaption = showCaption && imageNumber && imageLabel

  return (
    <section className={`industry-image-section${hasAside ? '' : ' industry-image-section--split'}${className ? ` ${className}` : ''}`}>
      <div className="industry-image-section-container">
        <div className="industry-image-section-layout">
          <FadeIn id="industry-image-copy" className="industry-image-section-copy">
            {showBadge && badge ? <PreSectionTitle title={badge} /> : null}
            <h2 className="industry-image-section-title">{title}</h2>
            {description ? (
              <p className="industry-image-section-description">{description}</p>
            ) : null}
          </FadeIn>

          <FadeIn id="industry-image-media" className="industry-image-section-media" delay={60}>
            <img
              src={imageSrc}
              loading="lazy"
              alt={imageAlt}
              className="industry-image-section-photo"
            />
            {hasCaption ? (
              <>
                <div className="industry-image-section-overlay" aria-hidden="true" />
                <div className="industry-image-section-caption">
                  <span className="industry-image-section-number">{imageNumber}</span>
                  <span className="industry-image-section-label">{imageLabel}</span>
                </div>
              </>
            ) : null}
          </FadeIn>

          {hasAside ? (
            <FadeIn id="industry-image-aside" className="industry-image-section-aside" delay={120}>
              <p className="industry-image-section-aside-text">{aside}</p>
            </FadeIn>
          ) : null}
        </div>
      </div>
    </section>
  )
}
