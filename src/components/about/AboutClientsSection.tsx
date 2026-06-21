import { awardImages, clientLogos } from '../../data/about/clients'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutClientsSection() {
  return (
    <section className="client-section section-spacing">
      <div className="container">
        <div className="client-main">
          <div className="client-title">
            <FadeIn id="fe5fdc30-0977-ab3c-0ac8-efd3fd77d71c" className="section-title-center">
              <PreSectionTitle title="Our clients" />
              <h2 className="section-title title-center">
                Trusted by <span className="text-linear-gradient">industry</span> leaders
              </h2>
            </FadeIn>
          </div>
          <div className="w-layout-grid grid-client">
            {clientLogos.map((client) => (
              <FadeIn key={client.id} id={client.id} className="client-item">
                <img src={client.src} loading="lazy" alt={client.alt} className="client-image" />
              </FadeIn>
            ))}
          </div>
          <div className="client-line" />
          <div className="award-info-inner two">
            <FadeIn
              id="e70ef908-c95e-399b-b056-334af5fefe21"
              className="award-title-wrap"
            >
              <h3 className="award-title">
                <span className="text-linear-gradient">20 Years</span> of manufacturing excellence
                &amp; recognition
              </h3>
            </FadeIn>
            <div className="award-image-wrap">
              {awardImages.map((award) => (
                <FadeIn key={award.id} id={award.id}>
                  <img src={award.src} loading="lazy" alt={award.alt} className="award-image" />
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
