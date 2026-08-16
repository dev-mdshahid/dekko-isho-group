import { useEffect, useRef, type CSSProperties } from 'react'

import {
  sdgInteractiveGoals,
  strategySection,
  sustainabilityHeroImage,
} from '../../data/sustainability/content'
import { SustainabilitySdgGoals } from './SustainabilitySdgGoals'
import { setupImageInfoExpand } from '../../lib/animations/about/imageInfo'
import { setupSdgFrameworkAnimations } from '../../lib/animations/sustainability/sdgGoals'
import { FadeIn } from '../ui/FadeIn'

const SUSTAIN_HERO_VIDEO = '/videos/dekko-isho-factory-drone-shot.mp4'

export function SustainabilityHeroImageSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)
  const frameworkRef = useRef<HTMLElement>(null)

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
            <div className="sustain-hero-image-backdrop" aria-hidden="true">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="sustain-hero-image-video"
              >
                <source src={SUSTAIN_HERO_VIDEO} type="video/mp4" />
              </video>
              <div className="sustain-hero-image-overlay" />
              <div className="sustain-hero-image-dark-overlay" />
            </div>
            <div className="sustain-hero-image-content">
              <div className="sustain-hero-image-inner sustain-hero-image-inner--quote-only">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        ref={frameworkRef}
        className="sustain-sdg-section"
        style={{ '--sdg-bg-image': `url('${strategySection.backgroundImage}')` } as CSSProperties}
        aria-labelledby="sustain-sdg-title"
      >
        <div className="sustain-sdg-bg" aria-hidden="true" />
        <div className="sustain-sdg-inner">
          <header className="sustain-sdg-head">
            <h2 className="sustain-sdg-title" id="sustain-sdg-title" data-sdg-animate="title">
              {strategySection.titlePrefix}{' '}
              <span className="sustain-sdg-title-accent">{strategySection.titleHighlight}</span>{' '}
              {strategySection.titleSuffix}
            </h2>
            <p className="sustain-sdg-description" data-sdg-animate="description">
              {strategySection.description}
            </p>
          </header>

          <div className="sustain-sdg-framework" data-sdg-animate="pillar">
            <SustainabilitySdgGoals goals={sdgInteractiveGoals} />
          </div>
        </div>
      </section>
    </div>
  )
}
