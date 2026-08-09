import { useState, type KeyboardEvent } from 'react'
import { strengthIntro, strengthItems } from '../../data/about/strengthItems'
import { splitTitleIntoTwoLines } from '../../lib/splitTitleIntoTwoLines'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

function canHoverFinePointer() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function StrengthCard({
  item,
  delay,
}: {
  item: (typeof strengthItems)[number]
  delay: number
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [titleLine1, titleLine2] = splitTitleIntoTwoLines(item.title)
  const descriptionId = `${item.id}-description`

  return (
    <FadeIn id={item.id} className="about-strength-card" delay={delay}>
      <div
        className={`about-strength-card-inner${isFlipped ? ' is-flipped' : ''}`}
        tabIndex={0}
        aria-describedby={descriptionId}
        onClick={() => {
          if (canHoverFinePointer()) return
          setIsFlipped((flipped) => !flipped)
        }}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsFlipped((flipped) => !flipped)
          }
        }}
        onBlur={() => setIsFlipped(false)}
      >
        <div className="about-strength-card-face about-strength-card-face--front">
          <div className="about-strength-card-top">
            <h3 className="about-strength-card-title">
              <span className="about-strength-card-title-line">{titleLine1}</span>
              <span className="about-strength-card-title-line">{titleLine2}</span>
            </h3>
          </div>
          <img
            src={item.image}
            loading="lazy"
            alt={item.imageAlt}
            className="about-strength-card-image"
          />
        </div>

        <div className="about-strength-card-face about-strength-card-face--back" aria-hidden="true">
          <h3 className="about-strength-card-title about-strength-card-title--back">
            {item.title}
          </h3>
          <p className="about-strength-card-description">{item.description}</p>
        </div>

        <p id={descriptionId} className="about-strength-card-sr-description">
          {item.description}
        </p>
      </div>
    </FadeIn>
  )
}

const STRENGTH_SECTION_BG = '/images/backgrounds/strength-section-bg.jpg'

export function AboutStrengthSection() {
  return (
    <section className="about-strength-section about-strength-section--about section-spacing">
      <img
        src={STRENGTH_SECTION_BG}
        alt=""
        aria-hidden="true"
        className="about-strength-section-bg"
      />
      <div className="container about-strength-container">
        <div className="about-strength-main">
          <FadeIn id="about-strength-header" className="about-strength-header">
            <PreSectionTitle title="Our Strength" />
            <div className="about-strength-title-row">
              <span className="about-strength-accent" aria-hidden="true" />
              <h2 className="section-title about-strength-title">
                Built on{' '}
                <span className="about-strength-title-accent about-strength-title-accent--expertise">
                  Expertise
                </span>
                <br />
                Driven by{' '}
                <span className="about-strength-title-accent about-strength-title-accent--impact">
                  Impact
                </span>
              </h2>
            </div>
            <p className="about-strength-description">{strengthIntro}</p>
          </FadeIn>

          <div className="about-strength-grid">
            {strengthItems.map((item, index) => (
              <StrengthCard key={item.id} item={item} delay={index * 60} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
