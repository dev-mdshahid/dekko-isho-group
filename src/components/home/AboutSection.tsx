import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { solutionPath } from '../../data/solutions/solutions'
import { resetScrollPosition } from '../../lib/resetRouteScroll'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const ABOUT_CARD_GAP = 40
const CAROUSEL_INTERVAL_MS = 3000

const INDUSTRY_DESCRIPTION =
  'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.'

const ISHO_BUSINESS_IMAGE = '/images/home/business-isho.png'
const ISHO_LOGO = '/images/home/isho-logo-white.svg'
const DEKKO_BUSINESS_IMAGE = '/images/home/business-dekko.png'
const DEKKO_LOGO = '/images/home/dekko-logo-white.svg'
const DITECH_BUSINESS_IMAGE = '/images/home/business-ditech.png'
const DITECH_LOGO = '/images/home/ditech-logo-white.svg'
const KLUBHAUS_BUSINESS_IMAGE = '/images/home/business-klubhaus.png'
const KLUBHAUS_LOGO = '/images/home/klubhaus-logo.svg'
const IZAKAYA_BUSINESS_IMAGE = '/images/home/business-izakaya.png'
const IZAKAYA_LOGO = '/images/home/izakaya-logo.svg'
const ECOVIA_BUSINESS_IMAGE = '/images/home/business-ecovia.png'
const ECOVIA_LOGO = '/images/home/ecovia-logo-white.svg'

type IndustryTextItem = {
  type: 'text'
  id: string
  number: string
  title: string
  slug: string
  variant: 'light' | 'dark'
}

type IndustryImageItem = {
  type: 'image'
  src?: string
  alt: string
  variant?: 'default' | 'business'
  logo?: string
  href?: string
}

type IndustryItem = IndustryTextItem | IndustryImageItem

const industries: IndustryItem[] = [
  {
    type: 'image',
    src: ISHO_BUSINESS_IMAGE,
    alt: 'ISHO Ltd.',
    variant: 'business',
    logo: ISHO_LOGO,
    href: '/isho-ltd',
  },
  {
    type: 'image',
    src: DEKKO_BUSINESS_IMAGE,
    alt: 'Dekko ISHO Group',
    variant: 'business',
    logo: DEKKO_LOGO,
    href: 'https://www.di.vc/',
  },
  {
    type: 'image',
    src: DITECH_BUSINESS_IMAGE,
    alt: 'DITECH',
    variant: 'business',
    logo: DITECH_LOGO,
    href: '/dekko-isho',
  },
  {
    type: 'image',
    src: KLUBHAUS_BUSINESS_IMAGE,
    alt: 'Klubhaus',
    variant: 'business',
    logo: KLUBHAUS_LOGO,
    href: '/klubhaus',
  },
  {
    type: 'image',
    src: IZAKAYA_BUSINESS_IMAGE,
    alt: 'IZAKAYA',
    variant: 'business',
    logo: IZAKAYA_LOGO,
    href: '/izakaya',
  },
  {
    type: 'image',
    src: ECOVIA_BUSINESS_IMAGE,
    alt: 'Ecovia',
    variant: 'business',
    logo: ECOVIA_LOGO,
    href: 'https://www.ecoviaglobal.com/',
  },
  // {
  //   type: 'text',
  //   id: '52b525da-7c1b-3a5f-e1d2-3e25e3d423eb',
  //   number: '01',
  //   title: 'Manufacturing',
  //   slug: 'manufacturing',
  //   variant: 'light',
  // },
  // { type: 'image', src: LAUNDRY_IMAGE, alt: 'Industrial laundry' },
  // {
  //   type: 'text',
  //   id: 'a502134d-7170-6735-c416-b637dce64a74',
  //   number: '02',
  //   title: 'Industrial Laundry',
  //   slug: 'industrial-laundry',
  //   variant: 'dark',
  // },
  // { type: 'image', src: COMPLIANCE_IMAGE, alt: 'Compliance and sustainability' },
  // {
  //   type: 'text',
  //   id: 'e0a0517f-1ee8-9dfc-bba2-14c8a6a448da',
  //   number: '03',
  //   title: 'Compliance & Sustainability',
  //   slug: 'compliance-sustainability',
  //   variant: 'light',
  // },
  // { type: 'image', src: DESIGN_IMAGE, alt: 'Design and product development' },
  // {
  //   type: 'text',
  //   id: 'about-industry-04',
  //   number: '04',
  //   title: 'Design & Product Development',
  //   slug: 'design-product-development',
  //   variant: 'light',
  // },
  // { type: 'image', src: INTEGRATION_IMAGE, alt: 'Technology integration' },
  // {
  //   type: 'text',
  //   id: 'about-industry-05',
  //   number: '05',
  //   title: 'Technology Integration',
  //   slug: 'technology-integration',
  //   variant: 'dark',
  // },
]

function IndustryTextCircle({ id, number, title, slug, variant }: IndustryTextItem) {
  const boxClass = variant === 'dark' ? 'about-info-box box-bg-dark' : 'about-info-box box-bg-white'
  const descriptionClass =
    variant === 'dark' ? 'about-info-description' : 'about-content-description'

  return (
    <FadeIn id={id}>
      <Link
        to={solutionPath(slug)}
        className={boxClass}
        onClick={() => resetScrollPosition()}
      >
        <div className="about-info-inner-wrap">
          <div className="about-content">{number}</div>
          <div className="about-info-text">{title}</div>
          <p className={descriptionClass}>{INDUSTRY_DESCRIPTION}</p>
        </div>
      </Link>
    </FadeIn>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg
      className="about-business-card__arrow"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function isExternalHref(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

function IndustryImageCircle({ src, alt, variant = 'default', logo, href }: IndustryImageItem) {
  if (variant === 'business' && src) {
    const card = (
      <>
        <img src={src} loading="lazy" alt="" className="about-business-card__media" />
        <div className="about-business-card__overlay" aria-hidden="true" />
        {logo ? <img src={logo} alt="" className="about-business-card__logo" aria-hidden="true" /> : null}
        <ArrowUpRightIcon />
      </>
    )

    if (href) {
      if (isExternalHref(href)) {
        return (
          <a
            href={href}
            className="about-business-card"
            data-home-animate="about-card"
            aria-label={alt}
            target="_blank"
            rel="noopener noreferrer"
          >
            {card}
          </a>
        )
      }

      return (
        <Link
          to={href}
          className="about-business-card"
          data-home-animate="about-card"
          aria-label={alt}
          onClick={() => resetScrollPosition()}
        >
          {card}
        </Link>
      )
    }

    return (
      <div className="about-business-card" data-home-animate="about-card">
        {card}
      </div>
    )
  }

  if (src) {
    return (
      <img
        src={src}
        loading="lazy"
        alt={alt}
        draggable={false}
        className="about-image-box"
      />
    )
  }

  return <div className="about-image-box about-image-placeholder" role="img" aria-label={alt} />
}

function CarouselArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="about-carousel-arrow__icon"
      viewBox="0 0 16 12"
      fill="none"
      aria-hidden="true"
    >
      {direction === 'left' ? (
        <path
          d="M1.57496 6.22461L6.57496 1.22461M1.57496 6.22461L6.57496 11.2246M1.57496 6.22461H14.425"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M14.425 6.22461L9.42501 1.22461M14.425 6.22461L9.42501 11.2246M14.425 6.22461H1.57501"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function AboutCarouselArrow({
  direction,
  onClick,
}: {
  direction: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`about-carousel-arrow about-carousel-arrow--${direction}`}
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous card' : 'Next card'}
    >
      <CarouselArrowIcon direction={direction} />
    </button>
  )
}

function getVisibleCardCount(viewportWidth: number) {
  if (viewportWidth <= 767) return 1
  if (viewportWidth <= 991) return 2
  return 3
}

export function AboutSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [slideStep, setSlideStep] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const slideCount = Math.max(1, industries.length - visibleCount + 1)
  const maxIndex = slideCount - 1

  const goToSlide = useCallback((index: number) => {
    setActiveIndex(((index % slideCount) + slideCount) % slideCount)
  }, [slideCount])

  const goToPrevious = useCallback(() => {
    goToSlide(activeIndex - 1)
  }, [activeIndex, goToSlide])

  const goToNext = useCallback(() => {
    goToSlide(activeIndex + 1)
  }, [activeIndex, goToSlide])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const updateLayout = () => {
      const nextVisibleCount = getVisibleCardCount(viewport.clientWidth)
      setVisibleCount(nextVisibleCount)

      const card = trackRef.current?.querySelector<HTMLElement>('.about-business-card')
      if (!card) return

      setSlideStep(card.offsetWidth + ABOUT_CARD_GAP)
    }

    updateLayout()

    const resizeObserver = new ResizeObserver(updateLayout)
    resizeObserver.observe(viewport)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    if (isPaused || prefersReducedMotion || slideCount <= 1) return

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1))
    }, CAROUSEL_INTERVAL_MS)

    return () => window.clearInterval(timerId)
  }, [activeIndex, isPaused, maxIndex, prefersReducedMotion, slideCount])

  const pauseCarousel = useCallback(() => setIsPaused(true), [])
  const resumeCarousel = useCallback(() => setIsPaused(false), [])

  return (
    <section id="About-Section" className="about-section">
      <div className="about-main">
        <div className="about-inner">
          <div className="about-header">
            <FadeIn id="710a89bc-f9dd-2ab9-dd91-b12ed4a78144" variant="slide-in-bottom" className="about-section-title">
              <h2 className="section-title about-section-heading title-center">
                Turning <span className="text-linear-gradient">Possibility</span> into Purpose
              </h2>
            </FadeIn>
            <FadeIn id="017b83dc-7656-67a6-b23e-69b6032ef810" variant="slide-in-bottom" delay={150} className="about-description">
              <p>Six industries. One vision. We don't follow the future, we craft it.</p>
            </FadeIn>
            <FadeIn id="5a23ee6f-035d-2255-fd4f-73aa8e89689a" variant="slide-in-bottom" delay={300} className="about-button-wrap">
              <ButtonArrow to="/about" label="Learn more about us" />
            </FadeIn>
          </div>

          <div className="about-carousel" data-home-animate="about-carousel">
            <div
              ref={viewportRef}
              className="about-scroll-viewport about-carousel-viewport"
              onMouseEnter={pauseCarousel}
              onMouseLeave={resumeCarousel}
              onFocusCapture={pauseCarousel}
              onBlurCapture={resumeCarousel}
            >
              <div
                ref={trackRef}
                className={`about-info-inner is-scroll about-carousel-track${prefersReducedMotion ? ' is-reduced-motion' : ''}`}
                style={
                  slideStep
                    ? { transform: `translate3d(-${activeIndex * slideStep}px, 0, 0)` }
                    : undefined
                }
              >
                {industries.map((item, index) =>
                  item.type === 'text' ? (
                    <IndustryTextCircle key={item.id} {...item} />
                  ) : (
                    <IndustryImageCircle key={`${item.alt}-${index}`} {...item} />
                  ),
                )}
              </div>
            </div>
            <div className="about-carousel-nav">
              <AboutCarouselArrow direction="left" onClick={goToPrevious} />
              <AboutCarouselArrow direction="right" onClick={goToNext} />
            </div>
          </div>
        </div>
        <SectionLines />
        <NoiseOverlay />
      </div>
    </section>
  )
}
