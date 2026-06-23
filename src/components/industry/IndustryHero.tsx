import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

export type IndustryHeroProps = {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  videoSrc?: string
  imageSrc?: string
  imageAlt?: string
}

export function IndustryHero({
  title,
  description,
  ctaLabel,
  ctaHref,
  videoSrc,
  imageSrc,
  imageAlt,
}: IndustryHeroProps) {
  return (
    <section className="industry-hero">
      <div className="industry-hero-content">
        <div className="industry-hero-copy">
          <div className="industry-hero-text">
            <FadeIn id="industry-hero-heading" className="industry-hero-heading">
              <h1 className="industry-hero-title">{title}</h1>
              <p className="industry-hero-description">{description}</p>
            </FadeIn>
            <FadeIn id="industry-hero-cta" delay={80}>
              <ButtonArrow
                to={ctaHref}
                label={ctaLabel}
                variant="button-primary-bg"
                className="industry-hero-button primary-button w-variant-5ae0b7d1-2e18-9989-4375-c73c98041680 w-inline-block"
              />
            </FadeIn>
          </div>
        </div>
      </div>

      <div className="industry-hero-media-wrap">
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt ?? ''} className="industry-hero-image" />
        ) : (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="industry-hero-video"
          />
        )}
      </div>
    </section>
  )
}
