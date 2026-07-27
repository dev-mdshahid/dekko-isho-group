import { manufacturingClients } from '../../data/manufacturing/content'
import { CompanyLogosSection } from '../home/CompanyLogosSection'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function ManufacturingClientsSection() {
  const { id, badge, title, description, regions } = manufacturingClients

  return (
    <section id={id} className="mfg-clients-section">
      <div className="mfg-clients-container">
        <FadeIn id="mfg-clients-header" className="mfg-clients-header">
          <PreSectionTitle title={badge} />
          <h2 className="mfg-clients-title">{title}</h2>
          <p className="mfg-clients-description">{description}</p>
        </FadeIn>

        <FadeIn id="mfg-clients-logos" className="mfg-clients-logos" delay={40}>
          <CompanyLogosSection />
        </FadeIn>

        <div className="mfg-clients-regions">
          {regions.map((region, index) => (
            <FadeIn
              key={region.id}
              id={`mfg-clients-region-${region.id}`}
              className="mfg-clients-region"
              delay={index * 50}
            >
              <span
                className="mfg-clients-region-accent"
                style={{ backgroundColor: region.accent }}
                aria-hidden="true"
              />
              <h3 className="mfg-clients-region-title">{region.title}</h3>
              <p className="mfg-clients-region-description">{region.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
