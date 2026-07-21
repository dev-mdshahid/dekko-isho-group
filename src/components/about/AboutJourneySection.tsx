import { useRef, type CSSProperties } from 'react'

import {
  journeyEraColors,
  journeyMilestones,
  type JourneyMilestone,
} from '../../data/about/journeyMilestones'
import { useJourneyTimelineAnimation } from '../../hooks/useJourneyTimelineAnimation'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export function AboutJourneySection() {
  const sectionRef = useRef<HTMLElement>(null)
  useJourneyTimelineAnimation(sectionRef)

  return (
    <section ref={sectionRef} className="about-journey-section">
      <div className="about-journey-stroke-bg" aria-hidden="true" />
      <div className="about-journey-main section-spacing">
        <div className="container">
          <FadeIn id="about-journey-header" className="about-journey-header">
            <PreSectionTitle title="Our journey" />
            <h2 className="section-title about-journey-title">
              A story of{' '}
              <span className="about-journey-accent about-journey-accent--blue">innovation</span>,{' '}
              <span className="about-journey-accent about-journey-accent--pink">diversification</span>{' '}
              &amp;{' '}
              <span className="about-journey-accent about-journey-accent--green">growth</span>
            </h2>
          </FadeIn>

          <div className="about-journey-flow" data-journey-flow>
            <svg
              className="about-journey-spine"
              data-journey-spine-svg
              aria-hidden="true"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="about-journey-flow-grad"
                  gradientUnits="userSpaceOnUse"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={journeyEraColors[1]} />
                  <stop offset="38%" stopColor={journeyEraColors[1]} />
                  <stop offset="48%" stopColor={journeyEraColors[2]} />
                  <stop offset="65%" stopColor={journeyEraColors[2]} />
                  <stop offset="75%" stopColor={journeyEraColors[3]} />
                  <stop offset="100%" stopColor={journeyEraColors[3]} />
                </linearGradient>
              </defs>
              <path
                className="about-journey-spine-track"
                data-journey-spine-track
                d=""
                stroke="var(--journey-line, #e4e4e0)"
                fill="none"
              />
              <path
                className="about-journey-spine-fill"
                data-journey-spine-fill
                d=""
                stroke="url(#about-journey-flow-grad)"
                fill="none"
              />
            </svg>

            <div className="about-journey-mobile-rail" data-journey-mobile-rail aria-hidden="true">
              <div className="about-journey-mobile-rail-track" />
              <div className="about-journey-mobile-rail-fill" data-journey-mobile-fill />
            </div>

            <div className="about-journey-timeline" aria-label="Company history timeline">
              {journeyMilestones.map((milestone, index) => {
                const side = index % 2 === 0 ? 'right' : 'left'
                const eraColor = journeyEraColors[milestone.era]
                const eraStyle = { '--journey-era': eraColor } as CSSProperties

                return (
                  <div
                    key={milestone.id}
                    className={`about-journey-row about-journey-row--${side} about-journey-row--era-${milestone.era}`}
                    data-journey-row
                    data-journey-era={milestone.era}
                    style={eraStyle}
                  >
                    <div className="about-journey-half about-journey-half--left">
                      {side === 'left' ? (
                        <MilestoneCards milestone={milestone} align="right" showYear />
                      ) : (
                        <YearPill year={milestone.year} className="about-journey-year--desktop" />
                      )}
                    </div>

                    <span className="about-journey-dot" data-journey-dot aria-hidden="true" />

                    <div className="about-journey-half about-journey-half--right">
                      {side === 'right' ? (
                        <MilestoneCards milestone={milestone} align="left" showYear />
                      ) : (
                        <YearPill year={milestone.year} className="about-journey-year--desktop" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <svg
        className="about-journey-flourish"
        viewBox="0 0 420 220"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M40 190 C 120 40, 220 40, 320 160"
          fill="none"
          stroke={journeyEraColors[1]}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M70 200 C 150 55, 250 55, 360 175"
          fill="none"
          stroke={journeyEraColors[2]}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M100 205 C 175 70, 275 70, 390 185"
          fill="none"
          stroke={journeyEraColors[3]}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </section>
  )
}

function YearPill({ year, className = '' }: { year: string; className?: string }) {
  return <span className={`about-journey-year ${className}`.trim()}>{year}</span>
}

function MilestoneCards({
  milestone,
  align,
  showYear = false,
}: {
  milestone: JourneyMilestone
  align: 'left' | 'right'
  showYear?: boolean
}) {
  return (
    <div className={`about-journey-entry-stack about-journey-entry-stack--${align}`}>
      {showYear ? <YearPill year={milestone.year} className="about-journey-year--mobile" /> : null}
      {milestone.entries.map((entry) => (
        <article key={entry.title} className="about-journey-card">
          <h3 className="about-journey-item-title">{entry.title}</h3>
          {entry.description ? (
            <p className="about-journey-description">{entry.description}</p>
          ) : null}
        </article>
      ))}
    </div>
  )
}
