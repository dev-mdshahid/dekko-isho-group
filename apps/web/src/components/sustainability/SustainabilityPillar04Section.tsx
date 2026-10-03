import { pillar04 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'
import { SustainabilityGovernanceTopicCard } from './SustainabilityGovernanceTopicCard'

export function SustainabilityPillar04Section() {
  return (
    <section className="sustain-pillar-section sustain-pillar-section--governance">
      <div className="container-medium sustain-pillar04-container">
        <FadeIn id="sustain-pillar04-header" className="sustain-pillar-header">
          <span className="sustain-pillar-number" aria-hidden="true">
            {pillar04.number}
          </span>
          <div className="sustain-pillar-header-content">
            <SustainabilityBadge title={pillar04.badge} />
            <h2 className="sustain-section-title">{pillar04.title}</h2>
            <p className="sustain-section-description">{pillar04.description}</p>
          </div>
        </FadeIn>

        <FadeIn id="sustain-pillar04-hero" className="sustain-pillar04-hero-wrap">
          <img
            src={pillar04.heroImage}
            loading="lazy"
            alt={pillar04.heroImageAlt}
            className="sustain-pillar04-hero-image"
          />
        </FadeIn>

        <div className="sustain-governance-topics-grid">
          {pillar04.topics.map((topic, index) => (
            <FadeIn
              key={topic.id}
              id={`sustain-governance-topic-${topic.id}`}
              className="sustain-governance-topic-wrap"
              delay={index * 60}
            >
              <SustainabilityGovernanceTopicCard topic={topic} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
