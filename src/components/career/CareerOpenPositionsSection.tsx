import { careerOpenPositions } from '../../data/career/content'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

function CareerPositionArrow() {
  return (
    <span className="career-position-arrow" aria-hidden="true">
      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
        <path
          d="M1 5.5H12.5M12.5 5.5L8.25 1.25M12.5 5.5L8.25 9.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function CareerOpenPositionsSection() {
  return (
    <section id="open-positions" className="career-positions-section section-spacing">
      <div className="career-content-container">
        <div className="career-positions-main">
          <FadeIn id="career-positions-header" className="career-positions-header">
            <div className="career-positions-header-text">
              <PreSectionTitle title={careerOpenPositions.badge} />
              <h2 className="section-title career-positions-title">
                {careerOpenPositions.heading}
              </h2>
            </div>
            <div className="career-positions-header-cta">
              <ButtonArrow to={careerOpenPositions.ctaHref} label={careerOpenPositions.ctaLabel} />
            </div>
          </FadeIn>

          <div className="career-positions-list">
            {careerOpenPositions.jobs.map((job, index) => (
              <FadeIn
                key={job.id}
                id={job.id}
                className="career-position-row"
                delay={index * 40}
              >
                <a
                  href={careerOpenPositions.applicationFormUrl}
                  className="career-position-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="career-position-badge">{job.department}</span>
                  <h3 className="career-position-title">{job.title}</h3>
                  <span className="career-position-location">{job.location}</span>
                  <span className="career-position-type">{job.employmentType}</span>
                  <CareerPositionArrow />
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
