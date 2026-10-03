import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionSpotlightContent = {
  badge: string
  title: string
  description: string
  image: string
  imageAlt: string
  imageLabel?: string
}

type SolutionSpotlightSectionProps = {
  idPrefix: string
  content: SolutionSpotlightContent
}

export function SolutionSpotlightSection({ idPrefix, content }: SolutionSpotlightSectionProps) {
  const { badge, title, description, image, imageAlt, imageLabel } = content

  return (
    <section className="service-inner-section solution-spotlight-section">
      <div className="container">
        <div className="solution-spotlight-layout">
          <FadeIn id={`${idPrefix}-spotlight-intro`} className="solution-spotlight-intro">
            <PreSectionTitle title={badge} variant="bg-dark" />
            <h2 className="solution-spotlight-title">{title}</h2>
          </FadeIn>

          <FadeIn id={`${idPrefix}-spotlight-image`} className="solution-spotlight-image-col" delay={60}>
            <div className="solution-spotlight-image-wrap">
              <img src={image} loading="lazy" alt={imageAlt} className="solution-spotlight-image" />
              {imageLabel ? (
                <span className="solution-spotlight-image-label">{imageLabel}</span>
              ) : null}
            </div>
          </FadeIn>

          <FadeIn id={`${idPrefix}-spotlight-copy`} className="solution-spotlight-copy-col" delay={120}>
            <p className="solution-spotlight-description">{description}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
