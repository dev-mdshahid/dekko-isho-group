import { homeTestimonials } from '../../data/home/testimonials'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay } from '../ui/SectionDecor'

export function TestimonialSection() {
  return (
    <section className="testimonial-section section-spacing">
      <div className="container-full">
        <div className="testimonial-info-main">
          <FadeIn id="70c67abc-bbb2-0225-8b62-b34415172d4c" className="section-title-center _01">
            <PreSectionTitle title="Built on trust" />
            <h2 className="section-title title-center">
              Trusted by <span className="text-linear-gradient">clients</span>, proven by results
            </h2>
          </FadeIn>
          <div className="w-layout-grid grid-testimonial">
            <div
              data-w-id="5b9d076c-a381-6e6a-9705-5ca5cc1c9344"
              data-current="Tab 1"
              data-easing="ease"
              data-duration-in="300"
              data-duration-out="100"
              className="testimonial-tabs w-tabs"
            >
              <div className="testimonial-tabs-menu w-tab-menu">
                {homeTestimonials.map((item, index) => (
                  <a
                    key={item.tab}
                    data-w-tab={item.tab}
                    className={`testimonial-tabs-link w-inline-block w-tab-link${index === 0 ? ' w--current' : ''}`}
                  >
                    <img loading="lazy" src={legacyImage(item.image)} alt="Testimonial Image" className="testimonial-image" />
                  </a>
                ))}
              </div>
              <div className="testimonial-tabs-content w-tab-content">
                {homeTestimonials.map((item, index) => (
                  <div
                    key={item.tab}
                    data-w-tab={item.tab}
                    className={`testimonial-tabs-pane w-tab-pane${index === 0 ? ' w--tab-active' : ''}`}
                  >
                    <div className="testimonial-info">
                      <div className="testimonial-info-inner">
                        <img
                          loading="lazy"
                          src={legacyImage('Testimonial-Star.svg')}
                          alt="Testimonial Star"
                          className="testimonial-star"
                        />
                        <p className="testimonial-description">{item.quote}</p>
                      </div>
                      <div className="author-details">
                        <h3 className="author-name">{item.name}</h3>
                        <div className="author-job-title">{item.title}</div>
                      </div>
                    </div>
                    {index === 2 && <NoiseOverlay />}
                  </div>
                ))}
              </div>
            </div>
            <div className="testimonial-more-info">
              <FadeIn id="3c0ff7e9-dac1-81ef-d189-54acdf24a6e9" className="testimonial-inner">
                <div className="testimonial-image-wrap">
                  <img
                    src={legacyImage('01.webp')}
                    loading="lazy"
                    sizes="100vw"
                    srcSet="/legacy/images/01-p-500.webp 500w, /legacy/images/01.webp 524w"
                    alt="Testimonial Info  Image "
                    className="testimonial-info-image"
                  />
                  <div className="testimonial-layout">
                    <div className="logo-info-text">// 2005-2K25 //</div>
                    <img src={legacyImage('Brand-White.svg')} loading="lazy" alt="Logo  Image" className="logo-image" />
                  </div>
                </div>
                <div className="testimonial-counter-wrapper">
                  <div className="counter-inner-wrap">
                    <div className="counter">
                      <div className="inner-number testimonial-counter">
                        <div className="numbers-counts">
                          <div data-target="98" className="count">
                            98
                          </div>
                        </div>
                        <div className="counter-symbol text-dark">
                          <div>%</div>
                        </div>
                      </div>
                      <div className="counter-text">On-Time delivery rate</div>
                    </div>
                    <div className="counter">
                      <div className="inner-number testimonial-counter">
                        <div className="numbers-counts">
                          <div data-target="50" className="count">
                            50
                          </div>
                        </div>
                        <div className="counter-symbol text-dark">
                          <div>+</div>
                        </div>
                      </div>
                      <div className="counter-text">Skilled professionals</div>
                    </div>
                  </div>
                </div>
              </FadeIn>
              <FadeIn id="875f79ed-bce3-0f38-c930-0a98b0b95d77" className="support-info-wrap">
                <img src={legacyImage('shadow.png')} loading="lazy" alt="Box Shadow" className="box-shadow" />
                <div className="support-info-inner">
                  <img src={legacyImage('Icon.svg')} loading="lazy" alt="Support Icon" className="support-icon" />
                  <div>
                    <h3 className="support-title">Need help choosing the right product?</h3>
                    <p className="support-description">
                      Always ready with guidance, product details, and after-sales support.
                    </p>
                  </div>
                  <div className="support-button">
                    <ButtonArrow to="/contact" label="Contact Support" variant="button-white-bg" />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
