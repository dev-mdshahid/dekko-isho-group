import { pillar02 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'
import { SustainabilityInitiativeCard } from './SustainabilityInitiativeCard'

function CheckIcon() {
  return (
    <svg
      className="sustain-governance-check"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12L10 17L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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

        <div className="sustain-initiatives-grid">
          {pillar02.cards.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`sustain-p02-${item.id}`}
              className="sustain-initiative-card-wrap"
              delay={index * 50}
            >
              <SustainabilityInitiativeCard item={item} />
            </FadeIn>
          ))}
        </div>

        <FadeIn id="sustain-pillar02-governance" className="sustain-governance-banner">
          <div className="sustain-governance-header">
            <SustainabilityBadge title={pillar02.governanceBadge} />
            <h3 className="sustain-governance-title">{pillar02.governanceTitle}</h3>
          </div>
          <div className="sustain-governance-rows">
            {pillar02.governanceRows.map((row) => (
              <div key={row.id} className="sustain-governance-row">
                <div className="sustain-governance-row-media">
                  <img
                    src={row.image}
                    loading="lazy"
                    alt={row.imageAlt}
                    className="sustain-governance-row-image"
                  />
                  <div className="sustain-governance-row-overlay">
                    <span className="sustain-governance-row-title">{row.title}</span>
                    <span className="sustain-governance-row-count">
                      <span className="sustain-governance-row-count-value">{row.count}</span> policies
                    </span>
                  </div>
                </div>
                {row.policies.map((column) => (
                  <ul key={column.join('-')} className="sustain-governance-list">
                    {column.map((policy) => (
                      <li key={policy} className="sustain-governance-item">
                        <CheckIcon />
                        <span>{policy}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
