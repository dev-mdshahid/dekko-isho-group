import { useEffect, useRef } from 'react'

import { careerBanner } from '../../data/career/content'
import { setupImageInfoExpand } from '../../lib/animations/about/imageInfo'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

const CAREER_HERO_IMAGE = '/images/career-bg.png'

export function CareerImageInfoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const scaler = scalerRef.current
    if (!section || !scaler) return

    return setupImageInfoExpand({ section, scaler })
  }, [])

  return (
    <div className="image-info-career" ref={sectionRef}>
      <div className="career-info-stage">
        <div className="career-info-scaler" ref={scalerRef}>
          <div className="w-layout-grid grid-hero-about">
            <div className="about-info-right">
              <FadeIn id="career-hero-content" className="about-hero-content">
                <div className="about-content-inner">
                  <p className="about-hero-description">{careerBanner.description}</p>
                  <div className="about-hero-button">
                    <ButtonArrow to={careerBanner.ctaHref} label={careerBanner.ctaLabel} />
                  </div>
                </div>
              </FadeIn>
              <div className="about-hero-text-marquee">
                <h2 className="marquee-text">{careerBanner.watermark}</h2>
              </div>
            </div>
            <div className="career-image-right">
              <img
                src={CAREER_HERO_IMAGE}
                loading="eager"
                decoding="async"
                alt="Renewable innovation manufacturing facility"
                className="about-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
