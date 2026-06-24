import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { solutionPath } from '../../data/solutions/solutions'
import { resetScrollPosition } from '../../lib/resetRouteScroll'
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

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
const LAUNDRY_IMAGE = '/images/about/laundry.jpg'
const COMPLIANCE_IMAGE = '/images/about/compliance.jpg'
const DESIGN_IMAGE = '/images/about/design.jpg'
const INTEGRATION_IMAGE = '/images/about/integration.jpg'

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
    href: '/about',
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

export function AboutSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useHorizontalScroll(scrollRef, { enableWheel: false })

  return (
    <section id="About-Section" className="about-section">
      <div className="about-main">
        <div className="about-info">
          <div className="about-info-content">
            <div className="about-right-wrap">
              <div className="about-section-title">
                <FadeIn id="710a89bc-f9dd-2ab9-dd91-b12ed4a78144" className="section-title">
                  <h2>
                    Turning <span className="text-linear-gradient">Possibility</span> into Purpose
                  </h2>
                </FadeIn>
              </div>
              <FadeIn id="017b83dc-7656-67a6-b23e-69b6032ef810" className="about-description">
                <p>
                  Five industries. One shared vision. At Dekko ISHO Group, we do not simply follow the
                  future, we shape it with innovation, craft it with purpose, and build it through
                  generations of excellence.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
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
        <SectionLines />
        <NoiseOverlay />
      </div>
    </section>
  )
}
