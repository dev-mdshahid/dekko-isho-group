import { useCallback, useEffect, useRef, useState } from 'react'

const SLIDE_INTERVAL_MS = 3000
const FIRST_SLIDE_DELAY_MS = 800
const RESET_TRANSITION_MS = 800

type Slide = {
  src: string
  alt: string
}

type Props = {
  images: Slide[]
  isPlaying: boolean
}

export function SustainabilityFocusCardCarousel({ images, isPlaying }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isResetting, setIsResetting] = useState(false)
  const wasPlayingRef = useRef(isPlaying)
  const activeIndexRef = useRef(activeIndex)
  const hasMultiple = images.length > 1

  activeIndexRef.current = activeIndex

  const advance = useCallback(() => {
    setActiveIndex((index) => (index + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!hasMultiple || !isPlaying) return

    const firstTimeout = window.setTimeout(advance, FIRST_SLIDE_DELAY_MS)
    const interval = window.setInterval(advance, SLIDE_INTERVAL_MS)

    return () => {
      window.clearTimeout(firstTimeout)
      window.clearInterval(interval)
    }
  }, [advance, hasMultiple, isPlaying])

  useEffect(() => {
    const wasPlaying = wasPlayingRef.current
    wasPlayingRef.current = isPlaying

    if (wasPlaying && !isPlaying && activeIndexRef.current !== 0) {
      setIsResetting(true)
      setActiveIndex(0)
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isResetting) return

    const timeout = window.setTimeout(() => setIsResetting(false), RESET_TRANSITION_MS)
    return () => window.clearTimeout(timeout)
  }, [isResetting])

  if (!hasMultiple) {
    const image = images[0]
    return (
      <div className="sustain-focus-card-media">
        <div className="sustain-focus-card-shine" aria-hidden="true" />
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="sustain-focus-card-image is-active"
        />
      </div>
    )
  }

  return (
    <div
      className={`sustain-focus-card-media sustain-focus-card-media--carousel${isResetting ? ' is-resetting' : ''}`}
      aria-roledescription="carousel"
    >
      <div className="sustain-focus-card-shine" aria-hidden="true" />
      {images.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading={index === 0 ? 'lazy' : 'lazy'}
          className={`sustain-focus-card-image${index === activeIndex ? ' is-active' : ''}`}
          aria-hidden={index !== activeIndex}
        />
      ))}

      <div className="sustain-focus-card-dots" role="tablist" aria-label="Image slides">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show image ${index + 1} of ${images.length}`}
            className={`sustain-focus-card-dot${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
