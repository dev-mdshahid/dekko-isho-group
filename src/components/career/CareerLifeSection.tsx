import { careerLifeAt } from '../../data/career/content'
import { FadeIn } from '../ui/FadeIn'

export function CareerLifeSection() {
  const { title, subtitle, cards } = careerLifeAt

  return (
    <section className="career-life-section" aria-labelledby="career-life-title">
      <div className="career-content-container">
        <FadeIn id="career-life-header" className="career-life-header">
          <h2 id="career-life-title" className="career-life-title">
            {title}
          </h2>
          <p className="career-life-subtitle">{subtitle}</p>
        </FadeIn>

        <div className="career-life-grid">
          {cards.map((card, index) => (
            <FadeIn
              key={card.id}
              id={card.id}
              className={`career-life-card${index < 2 ? ' career-life-card--wide' : ''}`}
              delay={index * 50}
            >
              <img
                src={card.image}
                alt={card.imageAlt}
                loading="lazy"
                decoding="async"
                className="career-life-card-image"
              />
              <div className="career-life-card-overlay" aria-hidden="true" />
              <div className="career-life-card-content">
                <h3 className="career-life-card-title">{card.title}</h3>
                <p className="career-life-card-description">{card.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
