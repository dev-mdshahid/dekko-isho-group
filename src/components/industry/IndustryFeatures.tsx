import type { ReactNode } from 'react'

import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type IndustryFeatureItem = {
  id: string
  icon: ReactNode
  title: string
  description: string
}

export type IndustryFeaturesProps = {
  badge: string
  title: string
  description?: string
  descriptions?: string[]
  features?: IndustryFeatureItem[]
  showFeatureCards?: boolean
}

export function IndustryFeatures({
  badge,
  title,
  description,
  descriptions,
  features = [],
  showFeatureCards,
}: IndustryFeaturesProps) {
  const shouldShowFeatureCards = showFeatureCards ?? features.length > 0
  const descriptionParagraphs =
    descriptions ?? (description ? [description] : [])

  return (
    <section
      className={`industry-features${shouldShowFeatureCards ? '' : ' industry-features--intro-only'}`}
    >
      <div className="industry-features-container">
        <div className="industry-features-main">
          <FadeIn id="industry-features-header" className="industry-features-header">
            <PreSectionTitle title={badge} />
            <h2 className="industry-features-title">{title}</h2>
            {descriptionParagraphs.length > 0 ? (
              <div className="industry-features-descriptions">
                {descriptionParagraphs.map((paragraph) => (
                  <p key={paragraph} className="industry-features-description">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
          </FadeIn>

          {shouldShowFeatureCards ? (
            <div className="industry-features-grid">
              {features.map((feature, index) => (
                <FadeIn
                  key={feature.id}
                  id={`industry-feature-${feature.id}`}
                  className="industry-feature-card"
                  delay={index * 60}
                >
                  <div className="industry-feature-icon-wrap" aria-hidden="true">
                    {feature.icon}
                  </div>
                  <h3 className="industry-feature-title">{feature.title}</h3>
                  <p className="industry-feature-description">{feature.description}</p>
                </FadeIn>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
