import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const SLIDE_INTERVAL_MS = 5500
const TRANSITION_DURATION = 1.75

const ABOUT_SLIDES = [
  {
    src: '/images/about/about-1.png',
    alt: 'Dekko Isho team collaborating in a modern corporate office',
  },
  {
    src: '/images/about/about-2.png',
    alt: 'Garment manufacturing team working at industrial sewing stations',
  },
  {
    src: '/images/about/about-3.png',
    alt: 'Dekko Isho production facility showcasing operational excellence',
  },
  {
    src: '/images/about/about-4.png',
    alt: 'Employees engaged in quality-focused manufacturing work',
  },
  {
    src: '/images/about/about-5.png',
    alt: 'Dekko Isho workspace reflecting decades of industry leadership',
  },
] as const

export function AboutImageSlideshow() {
  const slideshowRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const mediaRefs = useRef<(HTMLImageElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const kenBurnsTweenRef = useRef<gsap.core.Tween | null>(null)
  const intervalRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const killKenBurns = useCallback(() => {
    kenBurnsTweenRef.current?.kill()
    kenBurnsTweenRef.current = null
  }, [])

  const startKenBurns = useCallback(
    (index: number) => {
      if (prefersReducedMotion) return

      const media = mediaRefs.current[index]
      if (!media) return

      killKenBurns()
      gsap.set(media, { scale: 1.04, transformOrigin: 'center center' })
      kenBurnsTweenRef.current = gsap.to(media, {
        scale: 1.12,
        duration: SLIDE_INTERVAL_MS / 1000 + TRANSITION_DURATION,
        ease: 'none',
      })
    },
    [killKenBurns, prefersReducedMotion],
  )

  const transitionTo = useCallback(
    (nextIndex: number) => {
      if (isTransitioningRef.current || nextIndex === activeIndexRef.current) return

      const currentIndex = activeIndexRef.current
      const currentSlide = slideRefs.current[currentIndex]
      const nextSlide = slideRefs.current[nextIndex]
      const currentMedia = mediaRefs.current[currentIndex]
      const nextMedia = mediaRefs.current[nextIndex]

      if (!currentSlide || !nextSlide || !currentMedia || !nextMedia) return

      isTransitioningRef.current = true
      killKenBurns()

      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)

      if (prefersReducedMotion) {
        gsap.to(currentSlide, { opacity: 0, duration: 0.35, ease: 'power1.out' })
        gsap.fromTo(
          nextSlide,
          { opacity: 0, zIndex: 2 },
          { opacity: 1, duration: 0.35, ease: 'power1.out', onComplete: () => {
            gsap.set(currentSlide, { zIndex: 0 })
            gsap.set(nextMedia, { scale: 1, filter: 'blur(0px)' })
            isTransitioningRef.current = false
          }},
        )
        return
      }

      gsap.set(nextSlide, { opacity: 0, zIndex: 2 })
      gsap.set(currentSlide, { zIndex: 1 })
      gsap.set(nextMedia, {
        scale: 1.14,
        filter: 'blur(10px)',
        transformOrigin: 'center center',
      })
      gsap.set(currentMedia, { transformOrigin: 'center center' })

      const timeline = gsap.timeline({
        defaults: { duration: TRANSITION_DURATION, ease: 'power3.inOut' },
        onComplete: () => {
          gsap.set(currentSlide, { opacity: 0, zIndex: 0 })
          gsap.set(currentMedia, { scale: 1, filter: 'blur(0px)' })
          isTransitioningRef.current = false
          startKenBurns(nextIndex)
        },
      })

      timeline
        .to(
          currentSlide,
          {
            opacity: 0,
          },
          0,
        )
        .to(
          currentMedia,
          {
            scale: 1.02,
            filter: 'blur(4px)',
          },
          0,
        )
        .to(
          nextSlide,
          {
            opacity: 1,
          },
          0,
        )
        .to(
          nextMedia,
          {
            scale: 1.04,
            filter: 'blur(0px)',
          },
          0,
        )
    },
    [killKenBurns, prefersReducedMotion, startKenBurns],
  )

  const advanceSlide = useCallback(() => {
    const nextIndex = (activeIndexRef.current + 1) % ABOUT_SLIDES.length
    transitionTo(nextIndex)
  }, [transitionTo])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    ABOUT_SLIDES.forEach((slide) => {
      const image = new Image()
      image.src = slide.src
    })
  }, [])

  useEffect(() => {
    const firstSlide = slideRefs.current[0]
    const firstMedia = mediaRefs.current[0]
    if (!firstSlide || !firstMedia) return

    gsap.set(firstSlide, { opacity: 1, zIndex: 2 })
    gsap.set(firstMedia, { scale: prefersReducedMotion ? 1 : 1.04, filter: 'blur(0px)' })
    startKenBurns(0)

    return () => {
      killKenBurns()
      gsap.killTweensOf([...slideRefs.current, ...mediaRefs.current].filter(Boolean))
    }
  }, [killKenBurns, prefersReducedMotion, startKenBurns])

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = window.setInterval(advanceSlide, SLIDE_INTERVAL_MS)

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [advanceSlide, isPaused])

  return (
    <div
      ref={slideshowRef}
      className="about-image-slideshow"
      role="region"
      aria-roledescription="carousel"
      aria-label="About Dekko Isho Group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
    >
      {ABOUT_SLIDES.map((slide, index) => (
        <div
          key={slide.src}
          ref={(element) => {
            slideRefs.current[index] = element
          }}
          className={`about-image-slide${index === activeIndex ? ' is-active' : ''}`}
          aria-hidden={index !== activeIndex}
        >
          <img
            ref={(element) => {
              mediaRefs.current[index] = element
            }}
            src={slide.src}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            alt={slide.alt}
            className="about-image about-image-slide__media"
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}
