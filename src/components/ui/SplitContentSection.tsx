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
  /** Optional pink/accent callout below the description */
  highlightTitle?: string
  /** Optional supporting line under the highlight */
  highlightDetail?: string
}

export function SplitContentSection({
  badge,
  title,
  description,
  image,
  imageAlt,
  id,
  className,
  highlightTitle,
  highlightDetail,
}: SplitContentSectionProps) {
  return (
    <section
      id={id}
      className={`split-content-section${className ? ` ${className}` : ''}`}
    >
      <div className="split-content-section-container">
        <div className="split-content-section-layout">
          <FadeIn
            id={`${id ?? 'split-content'}-copy`}
            className="split-content-section-copy"
            variant="slide-in-bottom"
          >
            <PreSectionTitle title={badge} />
            <h2 className="split-content-section-title">{title}</h2>
            <p className="split-content-section-description">{description}</p>
            {highlightTitle ? (
              <p className="split-content-section-highlight">{highlightTitle}</p>
            ) : null}
            {highlightDetail ? (
              <p className="split-content-section-highlight-detail">{highlightDetail}</p>
            ) : null}
          </FadeIn>

          <FadeIn
            id={`${id ?? 'split-content'}-media`}
            className="split-content-section-media"
            delay={60}
            variant="slide-in-bottom"
          >
            <img
              src={image}
              loading="lazy"
              alt={imageAlt}
              className="split-content-section-image"
              data-solution-animate="media-parallax"
            />
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
