import { journeyMilestones, journeySummary } from '../../data/about/journeyMilestones'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutJourneySection() {
  return (
    <section className="about-journey-section section-spacing">
      <div className="about-journey-container">
        <div className="about-journey-main">
          <FadeIn id="about-journey-header" className="about-journey-header">
            <PreSectionTitle title="Our journey" />
            <h2 className="section-title about-journey-title">
              A story of <span className="text-linear-gradient">innovation</span>, diversification
              &amp; growth.
            </h2>
          </FadeIn>

          <div className="about-journey-timeline" aria-label="Company history timeline">
            {journeyMilestones.map((milestone, index) => (
              <FadeIn
                key={milestone.id}
                id={milestone.id}
                className="about-journey-item"
                delay={index * 80}
              >
                <div className="about-journey-year">{milestone.year}</div>
                <div className="about-journey-marker" aria-hidden="true">
                  <span className="about-journey-dot" />
                </div>
                <div className="about-journey-content">
                  <h3 className="about-journey-item-title">{milestone.title}</h3>
                  <p className="about-journey-description">{milestone.description}</p>
                  <img
                    src={milestone.image}
                    loading="lazy"
                    alt={milestone.imageAlt}
                    className="about-journey-image"
                  />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn id="about-journey-footer" className="about-journey-footer">
            <p className="about-journey-summary">{journeySummary}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
