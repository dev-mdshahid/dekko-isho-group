import { journeyMilestones } from '../../data/about/journeyMilestones'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutJourneySection() {
  return (
    <section className="about-journey-section">
      <div className="hero-section-overlay" aria-hidden="true" />
      <div className="about-journey-main section-spacing">
        <div className="container">
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
                delay={index * 60}
              >
                <div className="about-journey-year">{milestone.year}</div>
                <div className="about-journey-marker" aria-hidden="true">
                  <span className="about-journey-dot" />
                </div>
                <div className="about-journey-content">
                  {milestone.entries.map((entry) => (
                    <div key={entry.title} className="about-journey-entry">
                      <h3 className="about-journey-item-title">{entry.title}</h3>
                      {entry.description ? (
                        <p className="about-journey-description">{entry.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
