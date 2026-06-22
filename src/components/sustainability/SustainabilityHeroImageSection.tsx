import { useState } from 'react'

import { sustainabilityHeroImage } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'

export function SustainabilityHeroImageSection() {
  const [imgSrc, setImgSrc] = useState(sustainabilityHeroImage.src)

  return (
    <section className="sustain-hero-image-section">
      <img
        src={imgSrc}
        loading="eager"
        alt=""
        aria-hidden="true"
        className="sustain-hero-image-bg"
        onError={() => setImgSrc(sustainabilityHeroImage.fallbackSrc)}
      />
      <div className="sustain-hero-image-overlay" aria-hidden="true" />

      <div className="sustain-hero-image-content">
        <FadeIn id="sustain-hero-image-quote" className="sustain-hero-image-quote-wrap">
          <div className="sustain-hero-image-quote-row">
            <span className="sustain-accent-line" aria-hidden="true" />
            <p className="sustain-hero-image-quote">{sustainabilityHeroImage.quote}</p>
          </div>
        </FadeIn>

        <FadeIn id="sustain-hero-image-brand" delay={80} className="sustain-hero-image-brand">
          <div className="sustain-hero-image-company">{sustainabilityHeroImage.company}</div>
          <div className="sustain-hero-image-strategy">{sustainabilityHeroImage.strategy}</div>
        </FadeIn>
      </div>
    </section>
  )
}
