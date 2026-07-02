import { topExecutives, topExecutivesIntro } from '../../data/about/topExecutives'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutTopExecutivesSection() {
  return (
    <section className="about-top-executives-section about-top-executives-section--about section-spacing">
      <div className="container about-top-executives-container">
        <FadeIn id="about-top-executives-header" className="about-top-executives-header">
          <PreSectionTitle title="Top Executives" />
          <h2 className="about-top-executives-title">{topExecutivesIntro}</h2>
        </FadeIn>

        <div className="about-top-executives-grid">
          {topExecutives.map((executive, index) => (
            <FadeIn
              key={executive.id}
              id={executive.id}
              className="about-top-executive-card-wrap"
              delay={index * 40}
            >
              <article className="about-top-executive-card">
                <div className="about-top-executive-image-wrap">
                  <img
                    src={executive.image}
                    loading="lazy"
                    alt={executive.imageAlt}
                    className="about-top-executive-image"
                  />
                </div>
                <div className="about-top-executive-content">
                  <h3 className="about-top-executive-name">{executive.name}</h3>
                  <p className="about-top-executive-role">{executive.title}</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
