import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import {
  agamiWashingTypeItems,
  agamiWashingTypesIntro,
} from '../data/industry/agamiWashingTypes'

export function AgamiWashingTypesSection() {
  return (
    <section className="agami-washing-types">
      <div className="agami-washing-types-glow" aria-hidden="true" />

      <div className="agami-washing-types-container">
        <FadeIn id="agami-washing-types-header" className="agami-washing-types-header">
          <PreSectionTitle title={agamiWashingTypesIntro.badge} variant="bg-dark" />
          <h2 className="agami-washing-types-title">{agamiWashingTypesIntro.title}</h2>
          <p className="agami-washing-types-description">{agamiWashingTypesIntro.description}</p>
        </FadeIn>

        <div className="agami-washing-types-grid-wrap">
          <div className="agami-washing-types-grid-glow" aria-hidden="true" />
          <div className="agami-washing-types-grid">
            {agamiWashingTypeItems.map((item, index) => (
              <FadeIn
                key={item.id}
                id={`agami-washing-type-${item.id}`}
                className="agami-washing-types-card"
                delay={index * 20}
              >
                <span className="agami-washing-types-card-number">{item.number}</span>
                <h3 className="agami-washing-types-card-title">{item.title}</h3>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
