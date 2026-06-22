import { manufacturingCapacity } from '../../data/manufacturing/content'
import { ButtonArrow } from '../ui/ButtonArrow'
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
          <div className="w-layout-grid grid-step mfg-capacity-grid">
            <FadeIn id="mfg-capacity-left" className="step-title mfg-capacity-left">
              <div className="step-title-inner">
                <PreSectionTitle title={badge} />
                <h2 className="section-title mfg-capacity-title">
                  {titleBefore}{' '}
                  <span className="mfg-capacity-accent">{titleAccent}</span> {titleAfter}
                </h2>
              </div>
              <div className="step-button">
                <ButtonArrow to={ctaHref} label={ctaLabel} />
              </div>
            </FadeIn>

            <div className="step-right-info mfg-capacity-circles">
              {stats.map((stat, index) => (
                <FadeIn
                  key={stat.id}
                  id={`mfg-capacity-${stat.id}`}
                  className={`step-info-inner mfg-capacity-circle mfg-capacity-circle--${stat.variant}`}
                  delay={index * 80}
                >
                  <div className="step-title-wrap mfg-capacity-circle-inner">
                    <div className="step-number mfg-capacity-value">{stat.value}</div>
                    <h3 className="step-title-one mfg-capacity-label">{stat.label}</h3>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}
