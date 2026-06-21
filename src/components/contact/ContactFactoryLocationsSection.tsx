import { FACTORY_DUMMY_MAP_IMAGE, factoryLocations } from '../../data/contact/factoryLocations'
import { FadeIn } from '../ui/FadeIn'

export function ContactFactoryLocationsSection() {
  return (
    <section className="page-contact-factories" aria-label="Factory locations">
      <div className="page-contact-factories-gradient page-contact-factories-gradient--top-left" aria-hidden="true" />
      <div className="page-contact-factories-gradient page-contact-factories-gradient--bottom-right" aria-hidden="true" />

      <div className="page-contact-factories-container">
        <FadeIn id="contact-factories-header" className="page-contact-factories-header">
          <h2 className="page-contact-factories-title">Factory Locations</h2>
          <p className="page-contact-factories-subtitle">
            Get in touch with us with your queries or visit our premises.
          </p>
        </FadeIn>

        <div className="page-contact-factories-grid">
          {factoryLocations.map((factory, index) => (
            <FadeIn
              key={factory.id}
              id={`contact-factory-${factory.id}`}
              className="page-contact-factory-card"
              delay={index * 60}
            >
              <div className="page-contact-factory-map-wrap">
                <img
                  src={FACTORY_DUMMY_MAP_IMAGE}
                  loading="lazy"
                  decoding="async"
                  alt=""
                  className="page-contact-factory-map"
                />
              </div>
              <div className="page-contact-factory-body">
                <h3 className="page-contact-factory-name">{factory.name}</h3>
                <p className="page-contact-factory-address">{factory.address}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
