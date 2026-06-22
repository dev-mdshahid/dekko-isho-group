import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import { SectionLines } from '../components/ui/SectionDecor'
import {
  dekkoFashionsCapabilityIntro,
  dekkoFashionsCapabilityItems,
} from '../data/industry/dekkoFashionsCapability'

export function DekkoFashionsCapabilitySection() {
  return (
    <section className="dekko-fashions-capability">
      <SectionLines border="dark" />

      <div className="dekko-fashions-capability-container">
        <div className="dekko-fashions-capability-layout">
          <FadeIn id="dekko-fashions-capability-intro" className="dekko-fashions-capability-intro">
            <PreSectionTitle title={dekkoFashionsCapabilityIntro.badge} variant="bg-dark" />
            <h2 className="dekko-fashions-capability-title">{dekkoFashionsCapabilityIntro.title}</h2>
            <p className="dekko-fashions-capability-description">
              {dekkoFashionsCapabilityIntro.description}
            </p>
          </FadeIn>

          <div className="dekko-fashions-capability-grid">
            {dekkoFashionsCapabilityItems.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`dekko-fashions-capability-${item.id}`}
                className="dekko-fashions-capability-card"
                delay={index * 50}
              >
                <span className="dekko-fashions-capability-number">{item.number}</span>
                <h3 className="dekko-fashions-capability-card-title">{item.title}</h3>
                <p className="dekko-fashions-capability-card-description">{item.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
