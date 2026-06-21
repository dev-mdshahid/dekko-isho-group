import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function AboutJourneySection() {
  return (
    <section className="about-three-section">
      <div className="about-three-main section-spacing">
        <div className="container">
          <div className="about-three-content-main">
            <FadeIn id="98e1c0be-e54a-df73-2c55-045ce235c20d" className="w-layout-grid grid-about-three">
              <PreSectionTitle title="Our journey" />
              <div className="about-three-info">
                <h2 className="section-title">
                  Engineering trust and <span className="text-linear-gradient">quality</span> through years
                  of manufacturing experience
                </h2>
              </div>
            </FadeIn>
            <div className="about-three-content">
              <div className="w-layout-grid grid-about-three-content">
                <FadeIn id="69a2580e-e525-9745-7bb9-9e825aa740ad" className="about-three-author">
                  <img
                    src={legacyImage('A.png')}
                    loading="lazy"
                    alt="About Author Image"
                    className="about-author-image"
                  />
                  <div className="about-author-info">
                    <h3 className="about-author-name">Michael r. bennett</h3>
                    <div className="about-author-job">Founder &amp; CEO</div>
                  </div>
                </FadeIn>
                <div className="about-story-info">
                  <FadeIn id="ff2a1434-ba51-2c54-8317-c7a44458a67e" className="about-story-info-inner">
                    <h3 className="about-story-title">Our story</h3>
                    <p className="about-story-description">
                      We started with a vision to redefine manufacturing standards and provide solutions
                      that industries can rely on. Over the years, we have grown into a team of skilled
                      professionals equipped with cutting-edge technology, serving clients across diverse
                      sectors and geographies.
                    </p>
                    <p className="about-story-description last">
                      What drives us is not just producing components, but delivering value — ensuring
                      every part we manufacture contributes to our client&apos;s success. Our commitment
                      to quality, timely delivery, and innovation has helped us establish long-term
                      partnerships with leading businesses worldwide
                    </p>
                  </FadeIn>
                  <FadeIn id="9fc530be-4a2d-4d89-45e9-fe7251a5290a" className="service-info-three">
                    <h3 className="about-service-title">Our capabilities</h3>
                    <div className="service-list-three">
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
