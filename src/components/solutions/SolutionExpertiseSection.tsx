import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionFeature = {
  id: string
  icon?: string
  logo?: string
  logoAlt?: string
  title: string
  description: string
}

export type SolutionExpertiseContent = {
  id: string
  badge?: string
  title: string
  paragraphs: string[]
  features: SolutionFeature[]
}

type SolutionExpertiseSectionProps = SolutionExpertiseContent & {
  idPrefix: string
}

export function SolutionExpertiseSection({
  idPrefix,
  id,
  badge,
  title,
  paragraphs,
  features,
}: SolutionExpertiseSectionProps) {
  const hasLogoCards = features.some((feature) => Boolean(feature.logo))
  const featureGridClassName = [
    'w-layout-grid',
    'grid-feature',
    'solution-feature-grid',
    hasLogoCards ? 'solution-feature-grid--logos' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div id={id} className="service-more-info section-spacing solution-expertise-section">
      <div className="container">
        <div className="more-info-inner solution-expertise-inner">
          <div className="solution-expertise-block">
            {badge ? (
              <FadeIn id={`${idPrefix}-expertise-badge`} className="solution-expertise-badge">
                <PreSectionTitle title={badge} />
              </FadeIn>
            ) : null}

            <FadeIn id={`${idPrefix}-expertise-title`} className="solution-expertise-title-wrap">
              <h2 className="section-title solution-expertise-title">{title}</h2>
            </FadeIn>

            <FadeIn id={`${idPrefix}-expertise-copy`} className="solution-expertise-copy" delay={80}>
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="solution-expertise-description">
                  {paragraph}
                </p>
              ))}
            </FadeIn>
          </div>

          <div className="service-feature-info solution-feature-info">
            <div className={featureGridClassName}>
              {features.map((feature, index) => (
                <FadeIn
                  key={feature.id}
                  id={`${idPrefix}-feature-${feature.id}`}
                  className="feature-main"
                  delay={index * 60}
                >
                  {feature.logo ? (
                    <div className="feature-logo-wrap">
                      <img
                        src={feature.logo}
                        loading="lazy"
                        alt={feature.logoAlt ?? ''}
                        className="feature-logo"
                      />
                    </div>
                  ) : feature.icon ? (
                    <div className="feature-icon-wrap">
                      <img src={feature.icon} loading="lazy" alt="" className="feature-icon" />
                    </div>
                  ) : null}
                  <h2 className="feature-name">{feature.title}</h2>
                  <p className="feature-description">{feature.description}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
