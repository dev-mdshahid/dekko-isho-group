import { aboutOverviewStory, capabilityStats } from '../../data/about/capabilities'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const OVERVIEW_IMAGE = '/images/skyview-company.png'

function CapabilityArrow() {
  return (
    <svg
      className="about-capability-arrow"
      width="18"
      height="15"
      viewBox="0 0 18 15"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 7.657L11 1.657M17 7.657L11 13.657M17 7.657H1.58"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AboutOverviewSection() {
  return (
    <section className="about-three-section">
      <div className="about-three-main section-spacing">
        <div className="container">
          <div className="about-three-content-main">
            <FadeIn id="98e1c0be-e54a-df73-2c55-045ce235c20d" className="about-three-header">
              <div className="about-three-header-badge">
                <PreSectionTitle title="Overview" />
              </div>
              <h2 className="section-title about-three-title title-center">
                From Foundation to <span className="text-linear-gradient">Future</span>
              </h2>
            </FadeIn>
            <div className="about-three-content">
              <div className="w-layout-grid grid-about-three-content">
                <FadeIn id="69a2580e-e525-9745-7bb9-9e825aa740ad" className="about-three-author">
                  <img
                    src={OVERVIEW_IMAGE}
                    loading="lazy"
                    alt="Aerial view of Dekko Isho Group facilities with solar panels"
                    className="about-author-image"
                  />
                </FadeIn>
                <div className="about-story-info">
                  <FadeIn id="ff2a1434-ba51-2c54-8317-c7a44458a67e" className="about-story-info-inner">
                    <h3 className="about-story-title">Our story</h3>
                    <p className="about-story-description last">{aboutOverviewStory}</p>
                  </FadeIn>
                  <FadeIn id="9fc530be-4a2d-4d89-45e9-fe7251a5290a" className="service-info-three">
                    <h3 className="about-service-title">Our capabilities</h3>
                    <div className="service-list-three">
                      <div className="service-three-list-wrapper">
                        <div role="list" className="service-three-list">
                          {capabilityStats.map((stat) => (
                            <div key={stat.label} role="listitem" className="service-three-item">
                              <div className="service-link about-capability-link">
                                <div className="service-name-three">
                                  <span className="about-capability-value">{stat.value}</span>{' '}
                                  <span className="about-capability-label">{stat.label}</span>
                                </div>
                                <CapabilityArrow />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="service-three-button">
                        <ButtonArrow to="/" label="View all capabilities" />
                      </div>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
