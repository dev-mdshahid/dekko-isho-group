import { leadershipMembers } from '../../data/about/leadershipMembers'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

export function AboutLeadershipSection() {
  return (
    <section id="leadership-section" className="about-leadership-section about-leadership-section--about section-spacing">
      <div className="about-leadership-section-glow" aria-hidden="true" />
      <SectionLines border="dark" />

      <div className="container about-leadership-container">
        <FadeIn id="about-leadership-header" className="about-leadership-header">
          <PreSectionTitle title="Leadership" />
          <h2 className="about-leadership-title">
            The people setting the <span className="about-leadership-title-accent">direction</span>.
          </h2>
        </FadeIn>

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
      </div>
    </section>
  )
}
