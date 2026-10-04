import { BriefcaseBusiness, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { careerOpenPositions } from '../../data/career/content'
import { fetchJobs, locationsLabel, type PublicJob } from '../../lib/careersApi'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import { Bone } from '../ui/Skeleton'

const LATEST_COUNT = 6
const SKELETON_TITLE_WIDTHS = ['min(16rem, 90%)', 'min(12rem, 75%)', 'min(14rem, 85%)']

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

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; jobs: PublicJob[] }

export function CareerOpenPositionsSection() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let live = true
    fetchJobs()
      .then((jobs) => live && setState({ status: 'ready', jobs: jobs.slice(0, LATEST_COUNT) }))
      .catch(() => live && setState({ status: 'error' }))
    return () => {
      live = false
    }
  }, [attempt])

  const { futureRole, empty, error } = careerOpenPositions
  const noRoles = state.status === 'ready' && state.jobs.length === 0

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

          {state.status === 'loading' && (
            <div className="career-positions-list" role="status" aria-busy="true" aria-label="Loading open roles">
              {SKELETON_TITLE_WIDTHS.map((titleWidth, i) => (
                <div key={i} className="career-position-row" aria-hidden="true">
                  <div className="career-position-link is-skeleton">
                    <span className="career-position-badge">
                      <Bone block width="6.5rem" height="1.75rem" radius="var(--border-radius--xl)" />
                    </span>
                    <span className="career-position-title">
                      <Bone width={titleWidth} />
                    </span>
                    <span className="career-position-location">
                      <Bone width="3.5rem" />
                    </span>
                    <span className="career-position-type">
                      <Bone width="4.25rem" />
                    </span>
                    <span className="career-position-apply">
                      <span>
                        <Bone width="5.5rem" />
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {noRoles && (
            <div className="career-positions-state" role="status">
              <span className="career-positions-state-icon" aria-hidden="true">
                <BriefcaseBusiness size={26} strokeWidth={1.75} />
              </span>
              <h3 className="career-positions-state-title">{empty.title}</h3>
              <p className="career-positions-state-text">{empty.description}</p>
              <ButtonArrow to={futureRole.href} label={empty.ctaLabel} />
            </div>
          )}

          {state.status === 'error' && (
            <div className="career-positions-state" role="alert">
              <span className="career-positions-state-icon" aria-hidden="true">
                <RefreshCw size={24} strokeWidth={1.75} />
              </span>
              <h3 className="career-positions-state-title">{error.title}</h3>
              <p className="career-positions-state-text">{error.description}</p>
              <button
                type="button"
                className="career-positions-retry"
                onClick={() => {
                  setState({ status: 'loading' })
                  setAttempt((n) => n + 1)
                }}
              >
                {error.retryLabel}
              </button>
            </div>
          )}

          {state.status === 'ready' && state.jobs.length > 0 && (
            <div className="career-positions-list">
              {state.jobs.map((job, index) => (
                <FadeIn
                  key={job.id}
                  id={`career-job-${job.id}`}
                  className="career-position-row"
                  delay={index * 40}
                >
                  <Link to={`/career/jobs/${job.slug}`} className="career-position-link">
                    <span className="career-position-badge">{job.department?.name ?? 'Dekko ISHO'}</span>
                    <h3 className="career-position-title">{job.title}</h3>
                    <span className="career-position-location">{locationsLabel(job)}</span>
                    <span className="career-position-type">{job.jobType?.name ?? ''}</span>
                    <span className="career-position-apply">
                      Apply Now
                      <CareerPositionArrow />
                    </span>
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}

          {!noRoles && (
            <FadeIn id="career-future-role" className="career-future-role">
              <div className="career-future-role-text">
                <h3 className="career-future-role-question">{futureRole.question}</h3>
                <p className="career-future-role-description">{futureRole.description}</p>
              </div>
              <ButtonArrow
                to={futureRole.href}
                label={futureRole.linkLabel}
                variant="button-primary-bg"
              />
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
