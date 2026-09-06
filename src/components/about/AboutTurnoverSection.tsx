import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { GrowthComboChart } from './GrowthComboChart'

export function AboutTurnoverSection() {
  return (
    <section
      className="about-turnover-section--about"
      aria-labelledby="about-turnover-title"
    >
      <div className="about-turnover-main section-spacing">
        <div className="container">
          <div className="about-turnover-chart-wrap">
            <div className="about-turnover-heading">
              <span className="about-turnover-heading-line" aria-hidden="true" />
              <h2 id="about-turnover-title" className="about-turnover-title">
                Annual Turnover
              </h2>
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
