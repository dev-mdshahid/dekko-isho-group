import { useRef } from 'react'

import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const INDUSTRY_DESCRIPTION =
  'Innovation to advance fashion sustainably. Customer satisfaction through true partnership.'

const MANUFACTURING_IMAGE = '/images/about/manufacturing.jpg'
const LAUNDRY_IMAGE = '/images/about/laundry.jpg'
const COMPLIANCE_IMAGE = '/images/about/compliance.jpg'
const DESIGN_IMAGE = '/images/about/design.jpg'
const INTEGRATION_IMAGE = '/images/about/integration.jpg'

type IndustryTextItem = {
  type: 'text'
  id: string
  number: string
  title: string
  variant: 'light' | 'dark'
}

type IndustryImageItem = {
  type: 'image'
  src?: string
  alt: string
}

type IndustryItem = IndustryTextItem | IndustryImageItem

const industries: IndustryItem[] = [
  { type: 'image', src: MANUFACTURING_IMAGE, alt: 'Manufacturing facility' },
  {
    type: 'text',
    id: '52b525da-7c1b-3a5f-e1d2-3e25e3d423eb',
    number: '01',
    title: 'Manufacturing',
    variant: 'light',
  },
  { type: 'image', src: LAUNDRY_IMAGE, alt: 'Industrial laundry' },
  {
    type: 'text',
    id: 'a502134d-7170-6735-c416-b637dce64a74',
    number: '02',
    title: 'Industrial Laundry',
    variant: 'dark',
  },
  { type: 'image', src: COMPLIANCE_IMAGE, alt: 'Compliance and sustainability' },
  {
    type: 'text',
    id: 'e0a0517f-1ee8-9dfc-bba2-14c8a6a448da',
    number: '03',
    title: 'Compliance & Sustainability',
    variant: 'light',
  },
  { type: 'image', src: DESIGN_IMAGE, alt: 'Design and product development' },
  { type: 'text', id: 'about-industry-04', number: '04', title: 'Design & Product Development', variant: 'light' },
  { type: 'image', src: INTEGRATION_IMAGE, alt: 'Technology integration' },
  { type: 'text', id: 'about-industry-05', number: '05', title: 'Technology Integration', variant: 'dark' },
]

function IndustryTextCircle({ id, number, title, variant }: IndustryTextItem) {
  const boxClass = variant === 'dark' ? 'about-info-box box-bg-dark' : 'about-info-box box-bg-white'
  const descriptionClass =
    variant === 'dark' ? 'about-info-description' : 'about-content-description'

  return (
    <FadeIn id={id} className={boxClass}>
      <div className="about-info-inner-wrap">
        <div className="about-content">{number}</div>
        <div className="about-info-text">{title}</div>
        <p className={descriptionClass}>{INDUSTRY_DESCRIPTION}</p>
      </div>
    </FadeIn>
  )
}

function IndustryImageCircle({ src, alt }: IndustryImageItem) {
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
  useHorizontalScroll(scrollRef)

  return (
    <section id="About-Section" className="about-section">
      <div className="about-main section-spacing">
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
