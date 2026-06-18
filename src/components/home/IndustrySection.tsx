import { homeIndustries, industryBackgrounds } from '../../data/home/industries'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function IndustrySection() {
  return (
    <section className="industry-section">
      <div className="container">
        <div className="industry-info-main section-spacing">
          <FadeIn id="cd4d3bf3-e255-714a-a12d-0490dd2d2cf9" className="section-title-center">
            <PreSectionTitle title="Built for every industry" />
            <h2 className="section-title title-center">
              Manufacturing <span className="text-linear-gradient">solutions</span> for every industry
            </h2>
          </FadeIn>
          <div
            data-current="Tab 1"
            data-easing="ease-in"
            data-duration-in="0"
            data-duration-out="0"
            className="industry-tabs w-tabs"
          >
            <FadeIn id="b1ef9828-72eb-84fa-b442-e2f6281f5c8c" className="industry-tabs-menu w-tab-menu">
              {homeIndustries.map((industry, index) => (
                <a
                  key={industry.tab}
                  data-w-tab={industry.tab}
                  className={`industry-tabs-link w-inline-block w-tab-link${index === 0 ? ' w--current' : ''}`}
                >
                  <div>{industry.tabLabel}</div>
                </a>
              ))}
            </FadeIn>
            <FadeIn id="b1ef9828-72eb-84fa-b442-e2f6281f5c96" className="industry-tabs-content w-tab-content">
              {homeIndustries.map((industry, index) => (
                <div
                  key={industry.tab}
                  data-w-tab={industry.tab}
                  className={`industry-tabs-pane w-tab-pane${index === 0 ? ' w--tab-active' : ''}`}
                >
                  <div className="industry-content-info">
                    <div className="industry-image-wrapper">
                      <img
                        sizes="100vw"
                        srcSet={industry.imageSrcSet}
                        alt="Industry Image"
                        src={legacyImage(industry.image)}
                        loading="lazy"
                        className="industry-image"
                      />
                    </div>
                    <div className="industry-content">
                      <div className="industry-icon-box">
                        <img
                          loading="lazy"
                          src={legacyImage(industry.icon)}
                          alt="Industry Icon"
                          className="industry-icon"
                        />
                      </div>
                      <h3 className="industry-name">{industry.name}</h3>
                      <p className="industry-description">{industry.description}</p>
                      <div className="industry-list">
                        {industry.features.map((feature) => (
                          <div key={feature} className="industry-list-item">
                            <img
                              loading="lazy"
                              src={legacyImage('list-icon.svg')}
                              alt="Industry List Icon"
                              className="industry-list-icon"
                            />
                            <div className="industry-list-text">{feature}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </div>
      {industryBackgrounds.map((bg) => (
        <img
          key={bg.id}
          src={legacyImage(bg.image)}
          loading="lazy"
          data-w-id={bg.id}
          alt="Industry image BG"
          className={`industry-image-bg ${bg.className}`}
        />
      ))}
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
