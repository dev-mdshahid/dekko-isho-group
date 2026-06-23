import { pillar02 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'

function CheckIcon() {
  return (
    <svg
      className="sustain-governance-check"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 6L5 9L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SustainabilityPillar02Section() {
  return (
    <section className="sustain-pillar-section sustain-pillar-section--light sustain-pillar-section--social">
      <div className="container-medium">
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

        <div className="sustain-social-grid">
          {pillar02.cards.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`sustain-p02-${item.id}`}
              className="sustain-social-card"
              delay={index * 50}
            >
              <div className="sustain-initiative-number">{item.number}</div>
              <div className="sustain-initiative-content">
                <h3 className="sustain-initiative-title">{item.title}</h3>
                <p className="sustain-initiative-description">{item.description}</p>
                <div className="sustain-initiative-metric">
                  <span className="sustain-initiative-metric-value">{item.metricValue}</span>{' '}
                  <span className="sustain-initiative-metric-label">{item.metricLabel}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn id="sustain-pillar02-governance" className="sustain-governance-banner">
          <div className="sustain-governance-header">
            <SustainabilityBadge title={pillar02.governanceBadge} variant="dark" />
            <h3 className="sustain-governance-title">{pillar02.governanceTitle}</h3>
          </div>
          <div className="sustain-governance-rows">
            {pillar02.governanceRows.map((row) => (
              <div key={row.id} className="sustain-governance-row">
                <div className="sustain-governance-row-label">
                  <span className="sustain-governance-row-title">{row.title}</span>
                  <span className="sustain-governance-row-count">{row.count} policies</span>
                </div>
                <div className="sustain-governance-row-policies">
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
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
