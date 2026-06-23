import { clientLogos, whyChooseItems } from '../../data/home/clients'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'

function ClientMarqueeList() {
  return (
    <div className="client-marquee-list">
      {clientLogos.map((logo) => (
        <div key={logo} className="client-marquee-item">
          <img src={legacyImage(logo)} loading="lazy" alt="Client Image" className="client-image" />
        </div>
      ))}
    </div>
  )
}

export function WhyChooseSection() {
  return (
    <section className="why-choose-section">
      <div data-w-id="8b9c8801-a35a-405a-c54c-28f8a68a688b" className="client-marquee">
        <div className="client-marquee-track">
          <ClientMarqueeList />
          <ClientMarqueeList />
          <ClientMarqueeList />
        </div>
      </div>
      <div className="why-choose-info">
        <div className="container">
          <FadeIn id="3bbcdcf0-25d3-d1c7-ebaa-51304b662dba" className="why-choose-content">
            <h2 className="why-choose-title">Manufacturing solutions you can count on</h2>
            <div className="why-choose-list">
              {whyChooseItems.map((item) => (
                <div key={item} className="why-choose-list-item">
                  <img
                    src={legacyImage('list-icon.svg')}
                    loading="lazy"
                    alt="Why Choose Item Icon"
                    className="why-choose-item-icon"
                  />
                  <div className="why-choose-item">{item}</div>
                </div>
              ))}
            </div>
            <div className="why-choose-inner">
              <div className="avatar one">
                <div className="avatar-box">
                  <img
                    src={legacyImage('Client-images-4_1Client-images-4.webp')}
                    loading="lazy"
                    alt="Avatar Image"
                    className="avatar-image"
                  />
                </div>
                <div className="avatar-box one">
                  <img
                    src={legacyImage('Client-images-3_1Client-images-3.webp')}
                    loading="lazy"
                    alt="Avatar Image"
                    className="avatar-image"
                  />
                </div>
                <div className="avatar-box one">
                  <img
                    src={legacyImage('Client-images-1_1Client-images-1.webp')}
                    loading="lazy"
                    alt="Avatar Image"
                    className="avatar-image"
                  />
                </div>
                <div className="avatar-box one">
                  <img
                    src={legacyImage('Client-images-2_1Client-images-2.webp')}
                    loading="lazy"
                    alt="Avatar Image"
                    className="avatar-image"
                  />
                </div>
              </div>
              <div className="rating-info">
                <img src={legacyImage('Star.svg')} loading="lazy" alt="Star" className="rating-image" />
                <div className="rating-text">Happy clients worldwide</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
