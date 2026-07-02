import { pillar02 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'
import { SustainabilityGovernanceBanner } from './SustainabilityGovernanceBanner'
import { SustainabilityInitiativeCard } from './SustainabilityInitiativeCard'
import { SustainabilityInitiativesGrid } from './SustainabilityInitiativesGrid'

export function SustainabilityPillar02Section() {
  return (
    <section className="sustain-pillar-section sustain-pillar-section--social">
      <div className="sustain-pillar-texture-overlay" aria-hidden="true" />

      <div className="container-medium sustain-pillar02-container">
        <FadeIn id="sustain-pillar02-header" className="sustain-pillar-header">
          <span className="sustain-pillar-number" aria-hidden="true">
            {pillar02.number}
          </span>
          <div className="sustain-pillar-header-content">
            <SustainabilityBadge title={pillar02.badge} />
            <h2 className="sustain-section-title">{pillar02.title}</h2>
            <p className="sustain-section-description">{pillar02.description}</p>
          </div>
        </FadeIn>

        <SustainabilityInitiativesGrid>
          {pillar02.cards.map((item, index) => (
            <div key={item.id} className="sustain-initiative-card-wrap">
              <SustainabilityInitiativeCard item={item} index={index} />
            </div>
          ))}
        </SustainabilityInitiativesGrid>

        <SustainabilityGovernanceBanner />
      </div>
    </section>
  )
}
