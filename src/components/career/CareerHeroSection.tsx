import { useRef } from 'react'

import { careerHero } from '../../data/career/content'
import { useAboutHeroAnimation } from '../../hooks/useAboutHeroAnimation'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { CareerImageInfoSection } from './CareerImageInfoSection'

export function CareerHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useAboutHeroAnimation(sectionRef)

  return (
    <section className="career-hero-section" ref={sectionRef}>
      <div className="career-hero-inner">
        <div className="container-full">
          <div className="career-hero-title-wrap">
            <PreSectionTitle title={careerHero.badge} />
            <h1 className="career-hero-title">
              <span className="hero-title-line">
                <span className="hero-title-word" data-about-animate="hero-word">
                  Join
                </span>{' '}
                <span className="hero-title-word" data-about-animate="hero-word">
                  a
                </span>{' '}
                <span className="hero-title-word" data-about-animate="hero-word">
                  Team
                </span>{' '}
                <span className="hero-title-word" data-about-animate="hero-word">
                  That
                </span>
              </span>
              <span className="hero-title-line">
                <span className="hero-title-word" data-about-animate="hero-word">
                  Shapes
                </span>{' '}
                <span className="hero-title-word" data-about-animate="hero-word">
                  the
                </span>{' '}
                <span
                  className="hero-title-word hero-title-accent hero-title-accent--primary"
                  data-about-animate="hero-word"
                >
                  Future
                </span>
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
      <CareerImageInfoSection />
    </section>
  )
}
