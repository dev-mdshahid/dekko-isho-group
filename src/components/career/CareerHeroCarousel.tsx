import { useCallback, useEffect, useState } from 'react'

import type { CareerHeroCarouselSlide } from '../../data/career/content'

const SLIDE_INTERVAL_MS = 4200

type Props = {
  images: CareerHeroCarouselSlide[]
}

export function CareerHeroCarousel({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [autoplayKey, setAutoplayKey] = useState(0)
  const hasMultiple = images.length > 1

  const advance = useCallback(() => {
    setActiveIndex((index) => (index + 1) % images.length)
  }, [images.length])

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % images.length) + images.length) % images.length)
      setAutoplayKey((key) => key + 1)
    },
    [images.length],
  )

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1)
  }, [activeIndex, goTo])

  const goNext = useCallback(() => {
    goTo(activeIndex + 1)
  }, [activeIndex, goTo])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!hasMultiple || isPaused || prefersReducedMotion) return

    const interval = window.setInterval(advance, SLIDE_INTERVAL_MS)
    return () => window.clearInterval(interval)
  }, [advance, autoplayKey, hasMultiple, isPaused, prefersReducedMotion])

  if (!hasMultiple) {
    const image = images[0]
    return (
      <div className="career-hero-carousel">
        <img
          src={image.src}
          alt={image.alt}
          loading="eager"
          decoding="async"
          className="career-hero-carousel__image is-active"
        />
      </div>
    )
  }

  return (
    <div
      className="career-hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Life at Dekko Isho"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        setIsPaused(false)
      }}
    >
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={`career-hero-carousel__image${index === activeIndex ? ' is-active' : ''}`}
          aria-hidden={index !== activeIndex}
          draggable={false}
        />
      ))}

      <button
        type="button"
        className="career-hero-carousel__arrow career-hero-carousel__arrow--prev"
        aria-label="Previous image"
        onClick={goPrev}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        className="career-hero-carousel__arrow career-hero-carousel__arrow--next"
        aria-label="Next image"
        onClick={goNext}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 18l6-6-6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="career-hero-carousel__dots" role="tablist" aria-label="Carousel slides">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show image ${index + 1} of ${images.length}`}
            className={`career-hero-carousel__dot${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
