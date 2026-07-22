import { CompanyLogosSection } from '../home/CompanyLogosSection'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function ManufacturingClientsSection() {
  return (
    <section className="mfg-clients-section section-spacing">
      <div className="container">
        <FadeIn id="mfg-clients-header" className="mfg-clients-header">
          <PreSectionTitle title="Our Clients" />
          <h2 className="section-title title-center mfg-clients-title">Trusted By</h2>
        </FadeIn>
      </div>

      <CompanyLogosSection />

      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
