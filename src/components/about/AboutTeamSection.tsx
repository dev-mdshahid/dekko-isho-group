import { teamMembers } from '../../data/about/teamMembers'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutTeamSection() {
  return (
    <section id="team-section" className="team-section section-spacing">
      <div className="container">
        <div className="team-main">
          <div className="w-layout-grid grid-team">
            <div className="team-left-info">
              <FadeIn id="9d95fe37-36d6-4041-059e-7691c894a0b2" className="team-section-title">
                <PreSectionTitle title="Meet our experts" />
                <h2 className="section-title">
                  Leaders in <span className="text-linear-gradient">precision</span> work
                </h2>
              </FadeIn>
            </div>
            <div className="team-right-info">
              {teamMembers.map((member) => (
                <div key={member.wrapperId} data-w-id={member.wrapperId} className="team-info-inner">
                  <img
                    src={member.image}
                    loading="lazy"
                    data-w-id={member.imageId}
                    alt="Team Image"
                    className={member.imageClass}
                  />
                  <div data-w-id={member.contentId} className={member.contentClass}>
                    <h3 className="team-member-name">{member.name}</h3>
                    <div className="team-job-title">{member.title}</div>
                    <div className="team-social-info">
                      {member.social.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="social-link w-inline-block"
                        >
                          <img src={link.icon} loading="lazy" alt={link.alt} className="social-icon" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
