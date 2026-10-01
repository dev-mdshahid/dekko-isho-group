import { useCallback, useEffect, useState } from 'react'

import type { CareerHeroCarouselSlide } from '../../data/career/content'

const SLIDE_INTERVAL_MS = 2500

type Props = {
  images: CareerHeroCarouselSlide[]
}

export function CareerHeroCarousel({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [autoplayKey, setAutoplayKey] = useState(0)
  const hasMultiple = images.length > 1
  const isPaused = isHovered || isFocused

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
      aria-label="Life at Dekko ISHO"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
        setIsFocused(false)
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
        onClick={(event) => {
          goPrev()
          if (event.detail > 0) event.currentTarget.blur()
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m15 18-6-6 6-6"
            stroke="#ffffff"
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
        onClick={(event) => {
          goNext()
          if (event.detail > 0) event.currentTarget.blur()
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="m9 18 6-6-6-6"
            stroke="#ffffff"
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
            onClick={(event) => {
              goTo(index)
              if (event.detail > 0) event.currentTarget.blur()
            }}
          />
        ))}
      </div>
    </div>
  )
}
