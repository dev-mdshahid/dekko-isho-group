import { useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { awardsHeroDescriptionParts } from '../../data/awards/certifications'
import { setupHeroVideoExpand } from '../../lib/animations/home/video'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const AWARDS_BANNER = '/images/awards/awards-banner.jpg'

export function AwardsHeroSection() {
  const bannerSectionRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const scalerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const section = bannerSectionRef.current
    const stage = stageRef.current
    const scaler = scalerRef.current
    if (!section || !stage || !scaler) return

    const cleanup = setupHeroVideoExpand({
      section,
      stage,
      scaler,
      media: imageRef.current,
    })

    return cleanup
  }, [])

  useEffect(() => {
    const image = imageRef.current
    if (!image) return

    const refresh = () => ScrollTrigger.refresh()

    if (image.complete) {
      const frame = requestAnimationFrame(refresh)
      return () => cancelAnimationFrame(frame)
    }

    image.addEventListener('load', refresh)
    return () => image.removeEventListener('load', refresh)
  }, [])

  return (
    <section className="awards-hero-section">
      <div className="container-full">
        <div className="awards-hero-wrap">
          <FadeIn id="awards-hero-title">
            <h1 className="hero-title awards-hero-title">Awards &amp; Certifications</h1>
          </FadeIn>
          <FadeIn id="awards-hero-description" delay={80} className="awards-hero-description-wrap">
            <div className="awards-hero-description">
              {awardsHeroDescriptionParts.map((paragraph) => (
                <p key={paragraph} className="awards-hero-description-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
          <FadeIn id="awards-hero-lines" delay={120}>
            <div className="awards-hero-gradient-lines" aria-hidden="true">
              <span className="awards-hero-gradient-line awards-hero-gradient-line--blue" />
              <span className="awards-hero-gradient-line awards-hero-gradient-line--green" />
              <span className="awards-hero-gradient-line awards-hero-gradient-line--red" />
            </div>
          </FadeIn>
        </div>
      </div>

      <div
        ref={bannerSectionRef}
        className="awards-hero-banner-section"
        aria-label="Awards ceremony"
      >
        <div ref={stageRef} className="awards-hero-banner-stage">
          <div ref={scalerRef} className="awards-hero-banner-scaler">
            <img
              ref={imageRef}
              src={AWARDS_BANNER}
              alt="Dekko Isho Group team at an awards ceremony"
              className="awards-hero-banner-image"
              width={1920}
              height={1080}
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
