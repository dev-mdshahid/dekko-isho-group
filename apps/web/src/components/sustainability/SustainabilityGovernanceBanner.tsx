import { useRef } from 'react'

import { pillar02 } from '../../data/sustainability/content'
import { useGovernanceBannerAnimation } from '../../hooks/useGovernanceBannerAnimation'
import { SustainabilityBadge } from './SustainabilityBadge'

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

export function SustainabilityGovernanceBanner() {
  const bannerRef = useRef<HTMLElement>(null)

  useGovernanceBannerAnimation(bannerRef)

  return (
    <section ref={bannerRef} className="sustain-governance-banner" aria-labelledby="sustain-governance-title">
      <div className="sustain-card-glow" aria-hidden="true" />
      <div className="sustain-governance-header">
        <SustainabilityBadge title={pillar02.governanceBadge} />
        <h3 id="sustain-governance-title" className="sustain-governance-title">
          {pillar02.governanceTitle}
        </h3>
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
    </section>
  )
}
