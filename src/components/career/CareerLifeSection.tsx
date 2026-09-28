import {
  useRef,
  useState,
} from 'react'

import { careerLifeAt } from '../../data/career/content'
import { useMomentumCarousel } from '../../hooks/useMomentumCarousel'
import { FadeIn } from '../ui/FadeIn'

export function CareerLifeSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)

  const { title, subtitle, cards } = careerLifeAt

  const { goToIndex, positionCount } = useMomentumCarousel(viewportRef, trackRef, {
    onActiveIndexChange: setActiveIndex,
  })
  const visibleCardCount = cards.length - positionCount + 1

  return (
    <section
      className="career-life-section"
      aria-labelledby="career-life-title"
    >
      {/* ================================
          HEADER
      ================================= */}
      <div className="career-content-container">
        <FadeIn
          id="career-life-header"
          className="career-life-header"
        >
          <h2
            id="career-life-title"
            className="career-life-title"
          >
            {title}
          </h2>

          <p className="career-life-subtitle">
            {subtitle}
          </p>
        </FadeIn>
      </div>

      {/* ================================
          CAROUSEL
      ================================= */}
      <div className="career-life-carousel">
        <div
          ref={viewportRef}
          className="career-life-scroll"
          role="region"
          aria-roledescription="carousel"
          aria-label={title}
          tabIndex={0}
        >
          <div
            ref={trackRef}
            id="career-life-track"
            className="career-life-track"
          >
            {cards.map((card, index) => (
              <article
                key={card.id}
                id={card.id}
                className="career-life-card"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${cards.length}`}
              >
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  width={480}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="career-life-card-image"
                  style={{ objectPosition: card.imagePosition }}
                />

                <div
                  className="career-life-card-overlay"
                  aria-hidden="true"
                />

                <div className="career-life-card-content">
                  <h3 className="career-life-card-title">
                    {card.title}
                  </h3>

                  <p className="career-life-card-description">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ================================
          CAROUSEL CONTROLS
      ================================= */}
      {positionCount > 1 && (
        <div
          className="career-life-carousel-controls"
          role="group"
          aria-label="Life at Dekko carousel navigation"
        >
          {Array.from({ length: positionCount }, (_, index) => {
            const isActive =
              index === activeIndex

            return (
              <button
                key={index}
                type="button"
                aria-current={isActive ? 'true' : undefined}
                aria-controls="career-life-track"
                aria-label={`Show cards ${index + 1} to ${index + visibleCardCount} of ${cards.length}`}
                className={`career-life-carousel-control${isActive ? ' is-active' : ''
                  }`}
                onClick={() => goToIndex(index)}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
