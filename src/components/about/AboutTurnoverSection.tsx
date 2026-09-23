import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { GrowthComboChart } from './GrowthComboChart'

export function AboutTurnoverSection() {
  return (
    <section
      className="about-turnover-section--about"
      aria-labelledby="about-turnover-section-title"
    >
      <div className="about-turnover-main section-spacing">
        <div className="container">
          <FadeIn id="about-turnover-header" className="about-turnover-header">
            <PreSectionTitle title="Business Growth" />
            <h2 id="about-turnover-section-title" className="about-turnover-section-title">
              Crafting Excellence at Scale
            </h2>
            <p className="about-turnover-description">
              Our annual turnover reflects the strength of our diversified businesses and our
              commitment to resilient, responsible growth.
            </p>
          </FadeIn>

          <div className="about-turnover-chart-wrap">
            <div className="about-turnover-heading">
              <span className="about-turnover-heading-line" aria-hidden="true" />
              <h3 className="about-turnover-title">
                Annual Turnover
              </h3>
              <span className="about-turnover-heading-line" aria-hidden="true" />
            </div>

            <GrowthComboChart />

            <p className="about-turnover-caption">
              Total Business Turnover in Millions (M)
            </p>
          </div>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
