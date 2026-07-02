import { useRef } from 'react'

import { AboutImageInfoSection } from './AboutImageInfoSection'
import { useAboutHeroAnimation } from '../../hooks/useAboutHeroAnimation'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useAboutHeroAnimation(sectionRef)

  return (
    <section className="about-hero-section" ref={sectionRef}>
      <div className="about-hero-inner">
        <div className="container-full">
          <div className="about-hero-title-wrap">
            <h1 className="about-hero-title">
              <span className="hero-title-line">
                <span className="hero-title-word" data-about-animate="hero-word">
                  Creating
                </span>{' '}
                <span
                  className="hero-title-word hero-title-accent hero-title-accent--primary"
                  data-about-animate="hero-word"
                >
                  Impact
                </span>
              </span>
              <span className="hero-title-line">
                <span className="hero-title-word" data-about-animate="hero-word">
                  Across
                </span>{' '}
                <span className="hero-title-word" data-about-animate="hero-word">
                  Generations
                </span>
              </span>
            </h1>
            <p className="about-hero-subtitle" data-about-animate="hero-subtitle">
              For over seven decades, we have transformed ambition into progress through innovation,
              resilience, and responsible growth. Today, we continue to create lasting value for our
              people, partners and communities while shaping a better future for all.
            </p>
          </div>
        </div>
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
      <AboutImageInfoSection />
    </section>
  )
}
