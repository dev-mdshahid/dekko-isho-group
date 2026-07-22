import { manufacturingCapacity } from '../../data/manufacturing/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { CapacityStatCircles } from '../ui/CapacityStatCircles'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

export function ManufacturingCapacitySection() {
  const { badge, titleBefore, titleAccent, titleAfter, ctaLabel, ctaHref, stats } =
    manufacturingCapacity

  return (
    <section className="service-step-section mfg-capacity-section">
      <div className="container">
        <div className="service-step-main section-spacing">
          <div className="mfg-capacity-grid">
            <FadeIn id="mfg-capacity-left" className="mfg-capacity-left">
              <PreSectionTitle title={badge} />
              <h2 className="section-title mfg-capacity-title">
                {titleBefore}{' '}
                <span className="mfg-capacity-accent">{titleAccent}</span> {titleAfter}
              </h2>
              <div className="mfg-capacity-cta">
                <ButtonArrow to={ctaHref} label={ctaLabel} />
              </div>
            </FadeIn>

            <FadeIn id="mfg-capacity-cluster" className="mfg-capacity-cluster">
              <CapacityStatCircles stats={stats} />
            </FadeIn>
          </div>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
