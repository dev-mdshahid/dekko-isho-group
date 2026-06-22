import { careerStats } from '../../data/career/content'
import { FadeIn } from '../ui/FadeIn'

export function CareerStatsSection() {
  return (
    <section className="career-stats-section">
      <div className="container-full">
        <FadeIn id="career-stats-grid" className="career-stats-grid">
          {careerStats.map((stat, index) => (
            <div key={stat.id} className="career-stat-item">
              <div className="career-stat-value-wrap">
                {stat.countTarget !== undefined ? (
                  <div className="career-stat-counter">
                    <div data-target={stat.countTarget} className="count career-stat-number">
                      {stat.countTarget.toLocaleString()}
                    </div>
                    {stat.suffix ? <span className="career-stat-suffix">{stat.suffix}</span> : null}
                  </div>
                ) : (
                  <div className="career-stat-number">{stat.value}</div>
                )}
              </div>
              <div className="career-stat-label">{stat.label}</div>
              {index < careerStats.length - 1 ? (
                <div className="career-stat-divider" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}
