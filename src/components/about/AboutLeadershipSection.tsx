import { leadershipMembers, topExecutivesContent } from '../../data/about/leadershipMembers'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutLeadershipSection() {
  return (
    <section id="leadership-section" className="about-leadership-section about-leadership-section--about section-spacing">
      <div className="about-leadership-section-glow" aria-hidden="true">
        <div className="about-leadership-glow about-leadership-glow--left" />
        <div className="about-leadership-glow about-leadership-glow--top-right" />
      </div>
      <SectionLines />
      <NoiseOverlay />

      <div className="container about-leadership-container">
        <FadeIn id="about-leadership-header" className="about-leadership-header">
          <PreSectionTitle title="Leadership" />
          <h2 className="about-leadership-title">
            The people setting the <span className="text-linear-gradient">direction</span>.
          </h2>
        </FadeIn>

        <div className="about-leadership-layout">
          <div className="about-leadership-grid">
            {leadershipMembers.map((member, index) => (
              <FadeIn
                key={member.id}
                id={member.id}
                className="about-leadership-card-wrap"
                delay={index * 80}
              >
                <article className="about-leadership-card">
                  <div className="about-leadership-card-image-wrap">
                    <img
                      src={member.image}
                      loading="lazy"
                      alt={member.imageAlt}
                      className="about-leadership-card-image"
                    />
                  </div>
                  <div className="about-leadership-card-body">
                    <h3 className="about-leadership-card-name">{member.name}</h3>
                    <p className="about-leadership-card-role">{member.title}</p>
                    <p className="about-leadership-card-description">{member.description}</p>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>

          <FadeIn id="about-leadership-top-executives" className="about-leadership-executives-wrap">
            <article className="about-leadership-card about-leadership-executives-card">
              <div className="about-leadership-executives-image-wrap">
                <img
                  src={topExecutivesContent.image}
                  loading="lazy"
                  alt={topExecutivesContent.imageAlt}
                  className="about-leadership-executives-image"
                />
              </div>
              <div className="about-leadership-card-body">
                <p className="about-leadership-card-role">{topExecutivesContent.title}</p>
                <p className="about-leadership-card-description">{topExecutivesContent.description}</p>
              </div>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
