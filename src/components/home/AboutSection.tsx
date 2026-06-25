import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'

import { solutionPath } from '../../data/solutions/solutions'
import { resetScrollPosition } from '../../lib/resetRouteScroll'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const ABOUT_CARD_GAP = 40
const BROCHURE_PDF_FILENAME = 'Dekko_ISHO_Group.pdf'
const BROCHURE_PDF_PATH = `/docs/${BROCHURE_PDF_FILENAME}`

async function downloadBrochure(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()

  try {
    const response = await fetch(BROCHURE_PDF_PATH)
    if (!response.ok) {
      throw new Error(`Brochure request failed: ${response.status}`)
    }

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = BROCHURE_PDF_FILENAME
    link.rel = 'noopener'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(objectUrl)
  } catch {
    window.open(BROCHURE_PDF_PATH, '_blank', 'noopener,noreferrer')
  }
}

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
          aria-label={alt}
          onClick={() => resetScrollPosition()}
        >
          {card}
        </Link>
      )
    }

    return <div className="about-business-card">{card}</div>
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

function DownloadIcon() {
  return (
    <svg
      className="about-download-icon"
      width="18"
      height="17"
      viewBox="0 0 18 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17.4545 14.0089V11.0998C17.4545 10.9069 17.3779 10.7219 17.2415 10.5855C17.1051 10.4491 16.9202 10.3725 16.7273 10.3725C16.5344 10.3725 16.3494 10.4491 16.213 10.5855C16.0766 10.7219 16 10.9069 16 11.0998V14.0089C16 14.2017 15.9234 14.3867 15.787 14.5231C15.6506 14.6595 15.4656 14.7361 15.2727 14.7361H2.18182C1.98893 14.7361 1.80395 14.6595 1.66756 14.5231C1.53117 14.3867 1.45455 14.2017 1.45455 14.0089V11.0998C1.45455 10.9069 1.37792 10.7219 1.24153 10.5855C1.10514 10.4491 0.920157 10.3725 0.727273 10.3725C0.534388 10.3725 0.349404 10.4491 0.213013 10.5855C0.0766233 10.7219 0 10.9069 0 11.0998V14.0089C0 14.5875 0.22987 15.1425 0.63904 15.5516C1.04821 15.9608 1.60316 16.1907 2.18182 16.1907H15.2727C15.8514 16.1907 16.4063 15.9608 16.8155 15.5516C17.2247 15.1425 17.4545 14.5875 17.4545 14.0089ZM12.8145 10.2125L9.17818 13.1216C9.04978 13.223 8.89092 13.2782 8.72727 13.2782C8.56363 13.2782 8.40476 13.223 8.27636 13.1216L4.64 10.2125C4.5075 10.0874 4.42678 9.91718 4.41379 9.73544C4.40081 9.5537 4.45652 9.37371 4.56989 9.23108C4.68327 9.08845 4.84605 8.99357 5.02603 8.96521C5.20601 8.93685 5.39008 8.97708 5.54182 9.07795L8 11.0416V0.917947C8 0.725062 8.07662 0.540077 8.21301 0.403687C8.3494 0.267297 8.53439 0.190674 8.72727 0.190674C8.92016 0.190674 9.10514 0.267297 9.24153 0.403687C9.37792 0.540077 9.45455 0.725062 9.45455 0.917947V11.0416L11.9127 9.07795C11.986 9.00882 12.0728 8.95565 12.1676 8.92182C12.2625 8.88798 12.3633 8.87422 12.4638 8.8814C12.5642 8.88857 12.6621 8.91653 12.7512 8.96351C12.8403 9.01048 12.9186 9.07544 12.9813 9.15428C13.0439 9.23312 13.0895 9.32411 13.1152 9.42149C13.1409 9.51888 13.146 9.62053 13.1304 9.72001C13.1147 9.81949 13.0785 9.91463 13.0242 9.99941C12.9698 10.0842 12.8984 10.1567 12.8145 10.2125Z"
        fill="currentColor"
      />
    </svg>
  )
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
  disabled,
  onClick,
}: {
  direction: 'left' | 'right'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`about-carousel-arrow about-carousel-arrow--${direction}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous card' : 'Next card'}
    >
      <CarouselArrowIcon direction={direction} />
    </button>
  )
}

export function AboutSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useHorizontalScroll(scrollRef, { enableWheel: false })

  const updateScrollButtons = useCallback(() => {
    const element = scrollRef.current
    if (!element) return

    setCanScrollLeft(element.scrollLeft > 1)
    setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth - 1)
  }, [])

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    updateScrollButtons()

    const resizeObserver = new ResizeObserver(updateScrollButtons)
    resizeObserver.observe(element)

    element.addEventListener('scroll', updateScrollButtons, { passive: true })
    window.addEventListener('resize', updateScrollButtons)

    return () => {
      resizeObserver.disconnect()
      element.removeEventListener('scroll', updateScrollButtons)
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [updateScrollButtons])

  const scrollByOneCard = useCallback((direction: 'left' | 'right') => {
    const element = scrollRef.current
    if (!element) return

    const card = element.querySelector<HTMLElement>('.about-business-card')
    if (!card) return

    const distance = card.offsetWidth + ABOUT_CARD_GAP
    element.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    })
  }, [])

  return (
    <section id="About-Section" className="about-section">
      <div className="about-main">
        <div className="about-inner">
          <div className="about-header">
            <FadeIn id="710a89bc-f9dd-2ab9-dd91-b12ed4a78144" className="about-section-title">
              <h2 className="section-title about-section-heading title-center">
                Turning <span className="text-linear-gradient">Possibility</span> into Purpose
              </h2>
            </FadeIn>
            <FadeIn id="017b83dc-7656-67a6-b23e-69b6032ef810" className="about-description">
              <p>Six industries. One vision. We don't follow the future, we craft it.</p>
            </FadeIn>
            <FadeIn id="5a23ee6f-035d-2255-fd4f-73aa8e89689a" className="about-button-wrap">
              <ButtonArrow to="/about" label="Learn more about us" />
              <a
                href={BROCHURE_PDF_PATH}
                className="download-link about-download-link"
                onClick={downloadBrochure}
              >
                Download brochure
                <DownloadIcon />
              </a>
            </FadeIn>
          </div>

          <div className="about-carousel">
            <div ref={scrollRef} className="about-scroll-viewport">
              <div className="about-info-inner is-scroll">
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
              <AboutCarouselArrow
                direction="left"
                disabled={!canScrollLeft}
                onClick={() => scrollByOneCard('left')}
              />
              <AboutCarouselArrow
                direction="right"
                disabled={!canScrollRight}
                onClick={() => scrollByOneCard('right')}
              />
            </div>
          </div>
        </div>
        <SectionLines />
        <NoiseOverlay />
      </div>
    </section>
  )
}
