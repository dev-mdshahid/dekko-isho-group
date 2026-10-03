import { useEffect, useRef } from 'react'

import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export function CompanySection() {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current

    if (!section) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let rafId: number | null = null

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

    const updateParallax = () => {
      rafId = null

      if (
        prefersReducedMotion.matches ||
        window.innerWidth < 768
      ) {
        section.style.setProperty('--company-bg-y', '0px')
        section.style.setProperty('--company-awards-y', '0px')
        section.style.setProperty('--company-content-y', '0px')
        return
      }

      const rect = section.getBoundingClientRect()

      const viewportCenter = window.innerHeight / 2
      const sectionCenter = rect.top + rect.height / 2

      const distance = viewportCenter - sectionCenter


      const bgY = clamp(distance * 0.72, -260, 260)

      const awardsY = clamp(distance * -0.14, -110, 110)

      const contentY = clamp(distance * -0.018, -14, 14)

      section.style.setProperty('--company-bg-y', `${bgY}px`)


      section.style.setProperty('--company-awards-y', `${awardsY}px`)
      section.style.setProperty('--company-content-y', `${contentY}px`)
    }

    const requestUpdate = () => {
      if (rafId !== null) return

      rafId = window.requestAnimationFrame(updateParallax)
    }

    updateParallax()

    window.addEventListener('scroll', requestUpdate, { passive: true })

    window.addEventListener('resize', requestUpdate)

    prefersReducedMotion.addEventListener?.('change', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)

      window.removeEventListener('resize', requestUpdate)

      prefersReducedMotion.removeEventListener?.('change', requestUpdate)

      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="company-section"
    >
      {/* Background parallax image */}
      <div
        className="company-section-background"
        aria-hidden="true"
      >
        <img
          className="company-section-background-image"
          src="/images/awards/awards-cluster-background.png"
          alt=""
          decoding="async"
        />
      </div>

      {/* Background readability / lighting */}
      <div
        className="company-section-atmosphere"
        aria-hidden="true"
      />

      <div className="company-section-inner">
        {/* Content */}
        <FadeIn
          id="company-section-content"
          variant="slide-in-bottom"
          className="company-section-content"
        >
          <div className="company-section-content-parallax">

            <h2 className="company-section-title section-title">
              <span className="company-section-title-line">
                The Relentless{' '}
                <span className="company-section-accent company-section-accent--pursuit">
                  Pursuit
                </span>
              </span>

              <span className="company-section-title-line">
                of Making a{' '}
                <span className="company-section-accent company-section-accent--difference">
                  Difference
                </span>
              </span>
            </h2>

            <p className="company-section-description">
              Driven by purpose and powered by
              progress, we continue to raise the
              bar in creating value for people,
              partners, and the planet.
            </p>

            <div className="company-section-button">
              <ButtonArrow
                to="/awards"
                label="Explore Achievements"
                variant="button-white-bg"
              />
            </div>
          </div>
        </FadeIn>

        {/* Right-side awards */}
        <div
          className="company-section-awards"
          aria-hidden="true"
        >
          <div className="company-section-awards-parallax">
            <img
              className="company-section-awards-image"
              src="/images/awards/awards-cluster-transparent.png"
              alt=""
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Foreground atmosphere */}
      <div
        className="company-section-depth company-section-depth--left"
        aria-hidden="true"
      />

      <div
        className="company-section-depth company-section-depth--right"
        aria-hidden="true"
      />
    </section>
  )
}