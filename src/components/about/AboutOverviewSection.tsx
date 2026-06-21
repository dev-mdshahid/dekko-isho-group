import { capabilityStats } from '../../data/about/capabilities'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const OVERVIEW_IMAGE = '/images/skyview-company.png'

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
              <h2 className="section-title about-three-title">
                Leadership through <span className="text-linear-gradient">excellence</span>
                <br />
                Phenomenal growth,
                Conservative ambition.
              </h2>
            </FadeIn>
            <div className="about-three-content">
              <div className="w-layout-grid grid-about-three-content">
                <FadeIn id="69a2580e-e525-9745-7bb9-9e825aa740ad" className="about-three-author">
                  <img
                    src={OVERVIEW_IMAGE}
                    loading="lazy"
                    alt="Aerial view of Dekko Isho Group facilities"
                    className="about-author-image"
                  />
                </FadeIn>
                <div className="about-story-info">
                  <FadeIn id="ff2a1434-ba51-2c54-8317-c7a44458a67e" className="about-story-info-inner">
                    <h3 className="about-story-title">Our story</h3>
                    <p className="about-story-description">
                      Dekko Isho Group has experienced phenomenal growth in apparel manufacturing,
                      becoming a market leader on the strength of its goods, its services, and the
                      efficiency of its human capital. We are a distinct apparel group with strategic
                      ventures in furniture, restaurants, bio-degradable packaging, and tech.
                    </p>
                    <p className="about-story-description last">
                      We strive for excellence through a culture of innovation and continuous
                      improvement. We believe in well thought-out, consistent growth and a consciously
                      conservative approach – committed to investing in the business with initiatives
                      directed at long-term sustainability.
                    </p>
                  </FadeIn>
                  <FadeIn id="9fc530be-4a2d-4d89-45e9-fe7251a5290a" className="service-info-three">
                    <h3 className="about-service-title">Our capabilities</h3>
                    <div className="service-list-three">
                      <div className="service-three-list-wrapper">
                        <div role="list" className="service-three-list">
                          {capabilityStats.map((stat) => (
                            <div key={stat.label} role="listitem" className="service-three-item">
                              <a href="/services" className="service-link w-inline-block">
                                <div className="service-name-three">
                                  {stat.label} <strong>{stat.value}</strong>
                                </div>
                                <img
                                  src={legacyImage('Link-Arrow.svg')}
                                  loading="lazy"
                                  alt=""
                                  className="service-link-arrow"
                                />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="service-three-button">
                        <ButtonArrow to="/services" label="View all capabilities" />
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
