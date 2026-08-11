import { useRef } from 'react'

import { careerLifeAt } from '../../data/career/content'
import { useMomentumCarousel } from '../../hooks/useMomentumCarousel'
import { FadeIn } from '../ui/FadeIn'

export function CareerLifeSection() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { title, subtitle, cards } = careerLifeAt
  useMomentumCarousel(viewportRef, trackRef)

  return (
    <section className="career-life-section" aria-labelledby="career-life-title">
      <div className="career-content-container">
        <FadeIn id="career-life-header" className="career-life-header">
          <h2 id="career-life-title" className="career-life-title">
            {title}
          </h2>
          <p className="career-life-subtitle">{subtitle}</p>
        </FadeIn>
      </div>

      <div
        ref={viewportRef}
        className="career-life-scroll"
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
      >
        <div ref={trackRef} className="career-life-track">
          {cards.map((card) => (
            <article key={card.id} id={card.id} className="career-life-card">
              <img
                src={card.image}
                alt={card.imageAlt}
                width={480}
                height={720}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="career-life-card-image"
              />
              <div className="career-life-card-overlay" aria-hidden="true" />
              <div className="career-life-card-content">
                <h3 className="career-life-card-title">{card.title}</h3>
                <p className="career-life-card-description">{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
