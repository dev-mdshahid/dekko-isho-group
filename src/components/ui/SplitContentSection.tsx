import { FadeIn } from './FadeIn'
import { PreSectionTitle } from './PreSectionTitle'

export type SplitContentSectionProps = {
  badge: string
  title: string
  description: string
  image: string
  imageAlt: string
  id?: string
  className?: string
}

export function SplitContentSection({
  badge,
  title,
  description,
  image,
  imageAlt,
  id,
  className,
}: SplitContentSectionProps) {
  return (
    <section
      id={id}
      className={`split-content-section${className ? ` ${className}` : ''}`}
    >
      <div className="split-content-section-container">
        <div className="split-content-section-layout">
          <FadeIn id={`${id ?? 'split-content'}-copy`} className="split-content-section-copy">
            <PreSectionTitle title={badge} />
            <h2 className="split-content-section-title">{title}</h2>
            <p className="split-content-section-description">{description}</p>
          </FadeIn>

          <FadeIn
            id={`${id ?? 'split-content'}-media`}
            className="split-content-section-media"
            delay={60}
          >
            <img
              src={image}
              loading="lazy"
              alt={imageAlt}
              className="split-content-section-image"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
