import { useEffect, useRef } from 'react'

import {
  sdgGoals,
  strategySection,
  sustainabilityHeroImage,
} from '../../data/sustainability/content'
import { SustainabilitySdgGoals } from './SustainabilitySdgGoals'
import { setupImageInfoExpand } from '../../lib/animations/about/imageInfo'
import { setupSdgFrameworkAnimations } from '../../lib/animations/sustainability/sdgGoals'
import { FadeIn } from '../ui/FadeIn'

export function SustainabilityHeroImageSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)
  const frameworkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scaler = scalerRef.current
    if (!section || !scaler) return

    return setupImageInfoExpand({ section, scaler })
  }, [])

  useEffect(() => {
    const framework = frameworkRef.current
    if (!framework) return

    return setupSdgFrameworkAnimations(framework)
  }, [])

  return (
    <div className="sustain-hero-image" ref={sectionRef}>
      <div className="sustain-hero-image-stage">
        <div className="sustain-hero-image-scaler" ref={scalerRef}>
          <div className="sustain-hero-image-section">
            <div className="sustain-hero-image-content">
              <div className="sustain-hero-image-inner">
                <div className="sustain-hero-image-top">
                  <FadeIn id="sustain-hero-image-quote" className="sustain-hero-image-quote-wrap">
                    <span className="sustain-hero-image-eyebrow">{sustainabilityHeroImage.strategy}</span>
                    <div className="sustain-hero-image-quote-row">
                      <span className="sustain-accent-line" aria-hidden="true" />
                      <p className="sustain-hero-image-quote">
                        {sustainabilityHeroImage.quoteLines[0]}
                        <br />
                        {sustainabilityHeroImage.quoteLines[1]}
                      </p>
                    </div>
                  </FadeIn>
                </div>

                <div className="sustain-hero-image-middle">
                  <FadeIn id="sustain-hero-image-brand" delay={80} className="sustain-hero-image-brand">
                    <div className="sustain-hero-image-company">{sustainabilityHeroImage.company}</div>
                  </FadeIn>
                </div>

                <div ref={frameworkRef} className="sustain-impact-framework">
                  <h2 className="sustain-impact-framework-title" data-sdg-animate="title">
                    {strategySection.titlePrefix}{' '}
                    <span className="sustain-impact-framework-title-accent">{strategySection.titleHighlight}</span>{' '}
                    {strategySection.titleSuffix}
                  </h2>
                  <p className="sustain-impact-framework-description" data-sdg-animate="description">
                    {strategySection.description}
                  </p>

                  <SustainabilitySdgGoals pillars={sdgGoals} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
