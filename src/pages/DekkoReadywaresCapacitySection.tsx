import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import { SectionLines } from '../components/ui/SectionDecor'
import { dekkoReadywaresCapacityStats } from '../data/industry/dekkoReadywaresCapacity'

export function DekkoReadywaresCapacitySection() {
  return (
    <section className="dekko-readywares-capacity">
      <SectionLines />

      <div className="dekko-readywares-capacity-container">
        <FadeIn id="dekko-readywares-capacity-header" className="dekko-readywares-capacity-header">
          <PreSectionTitle title="Capacity Snapshot" />
          <h2 className="dekko-readywares-capacity-title">
            Built for reliable volume and{' '}
            <span className="dekko-readywares-capacity-title-accent">controlled execution.</span>
          </h2>
        </FadeIn>

        <FadeIn id="dekko-readywares-capacity-circles" className="dekko-readywares-capacity-circles" delay={60}>
          {dekkoReadywaresCapacityStats.map((stat, index) => (
            <div
              key={stat.id}
              className={`dekko-readywares-capacity-circle dekko-readywares-capacity-circle--${stat.variant}`}
              style={{ zIndex: index + 1 }}
            >
              <div className="dekko-readywares-capacity-value">{stat.value}</div>
              <div className="dekko-readywares-capacity-label">{stat.label}</div>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}
