import { Fragment, useRef } from 'react'

import { careerStats } from '../../data/career/content'
import { useScrollCounter } from '../../hooks/useScrollCounter'
import { FadeIn } from '../ui/FadeIn'

export function CareerStatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  useScrollCounter(sectionRef)

  return (
    <section ref={sectionRef} className="career-stats-section" aria-label="Company statistics">
      <div className="career-content-container">
        <FadeIn className="career-stats-grid-wrap">
          <div id="career-stats-grid" className="career-stats-grid">
            {careerStats.map((stat, index) => {
              const numericTarget =
                (stat.countTarget ?? Number.parseInt(stat.value.replace(/\D/g, ''), 10)) || 0
              const formattedTarget = numericTarget.toLocaleString()

              return (
                <Fragment key={stat.id}>
                  <div className="career-stat-item">
                    <div className="career-stat-value-wrap">
                      <div
                        className="career-stat-counter"
                        aria-label={`${stat.value} ${stat.label}`}
                      >
                        <span className="career-stat-value-reserve" aria-hidden="true">
                          <span className="career-stat-number">{formattedTarget}</span>
                          {stat.suffix ? (
                            <span className="career-stat-suffix">{stat.suffix}</span>
                          ) : null}
                        </span>
                        <span className="career-stat-value-animated">
                          <span
                            className="count career-stat-number"
                            data-target={numericTarget}
                            data-duration="1.25"
                            data-scroll-trigger="#career-stats-grid"
                            data-scroll-start="top bottom"
                            data-delay={String(index * 0.1)}
                          >
                            0
                          </span>
                          {stat.suffix ? (
                            <span className="career-stat-suffix">{stat.suffix}</span>
                          ) : null}
                        </span>
                      </div>
                    </div>
                    <div className="career-stat-label">{stat.label}</div>
                  </div>
                  {index < careerStats.length - 1 ? (
                    <div className="career-stat-divider" aria-hidden="true" />
                  ) : null}
                </Fragment>
              )
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
