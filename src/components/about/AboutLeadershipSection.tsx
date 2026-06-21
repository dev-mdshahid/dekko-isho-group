import { leadershipMembers } from '../../data/about/leadershipMembers'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { SectionLines } from '../ui/SectionDecor'

export function AboutLeadershipSection() {
  return (
    <section id="leadership-section" className="about-leadership-section section-spacing">
      <SectionLines border="dark" />

      <div className="about-leadership-container">
        <FadeIn id="about-leadership-header" className="about-leadership-header">
          <PreSectionTitle title="Leadership" variant="bg-dark" />
          <h2 className="about-leadership-title">The people setting the direction.</h2>
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
                <img
                  src={member.image}
                  loading="lazy"
                  alt={member.imageAlt}
                  className="about-leadership-card-image"
                />
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
