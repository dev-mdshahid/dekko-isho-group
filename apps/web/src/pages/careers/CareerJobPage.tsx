import { formatSalary } from '@dekko-isho/shared'
import DOMPurify from 'dompurify'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { careerOpenPositions } from '../../data/career/content'
import { useWebflowClasses } from '../../hooks/useWebflowClasses'
import { SiteLayout } from '../../layouts/SiteLayout'
import { ApiError } from '../../lib/api'
import {
  customFieldText,
  fetchJob,
  fetchJobs,
  formatDeadline,
  isNew,
  locationsLabel,
  postedAgo,
  type PublicJob,
  type PublicJobDetail,
} from '../../lib/careersApi'
import { scrollToElement } from '../../lib/smoothScroll'
import { NotFoundPage } from '../NotFoundPage'
import { ApplicationForm } from './ApplicationForm'
import { Breadcrumbs } from './Breadcrumbs'
import { JobBodySkeleton, JobCardSkeleton, JobHeroSkeleton } from './CareerSkeletons'
import { JobCard, JobDeadline, JobMetaList } from './JobCard'
import { ShareButtons } from './ShareButtons'
import './careers.css'

type State =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'error' }
  | { status: 'ready'; job: PublicJobDetail }

const EMPLOYMENT_TYPES: Record<string, string> = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  contract: 'CONTRACTOR',
  contractual: 'CONTRACTOR',
  internship: 'INTERN',
  intern: 'INTERN',
  temporary: 'TEMPORARY',
}

function jobPostingJsonLd(job: PublicJobDetail): string {
  const s = job.salary
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.descriptionHtml || job.summary,
    datePosted: job.publishedAt ?? undefined,
    validThrough: job.deadline ?? undefined,
    employmentType: job.jobType ? (EMPLOYMENT_TYPES[job.jobType.slug] ?? job.jobType.name) : undefined,
    directApply: true,
    identifier: { '@type': 'PropertyValue', name: 'Dekko ISHO Group', value: job.id },
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Dekko ISHO Group',
      sameAs: window.location.origin,
      logo: `${window.location.origin}/images/footer-logo.png`,
    },
    jobLocation: job.locations.map((l) => ({
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: l.name, addressCountry: 'BD' },
    })),
  }
  if (s.display === 'range' && (s.min != null || s.max != null)) {
    data.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: s.currency,
      value: {
        '@type': 'QuantitativeValue',
        ...(s.min != null ? { minValue: s.min } : {}),
        ...(s.max != null ? { maxValue: s.max } : {}),
        unitText: s.period === 'month' ? 'MONTH' : 'YEAR',
      },
    }
  }
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default function CareerJobPage() {
  useWebflowClasses()
  const { slug = '' } = useParams()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [loadedSlug, setLoadedSlug] = useState(slug)
  const [attempt, setAttempt] = useState(0)
  const [similarFor, setSimilarFor] = useState<{ jobId: string; jobs: PublicJob[] } | null>(null)
  const [applyVisible, setApplyVisible] = useState(false)
  const applyRef = useRef<HTMLElement>(null)

  if (loadedSlug !== slug) {
    setLoadedSlug(slug)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchJob(slug, controller.signal)
      .then((job) => setState({ status: 'ready', job }))
      .catch((error) => {
        if ((error as Error).name === 'AbortError') return
        setState({ status: error instanceof ApiError && error.status === 404 ? 'missing' : 'error' })
      })
    return () => controller.abort()
  }, [slug, attempt])

  const job = state.status === 'ready' ? state.job : null
  const deptId = job?.department?.id
  const jobId = job?.id

  useEffect(() => {
    if (!jobId) return
    let live = true
    fetchJobs()
      .then((jobs) => {
        if (!live) return
        const others = jobs.filter((j) => j.id !== jobId)
        const same = others.filter((j) => deptId && j.department?.id === deptId)
        setSimilarFor({ jobId, jobs: [...same, ...others.filter((j) => !same.includes(j))].slice(0, 3) })
      })
      .catch(() => live && setSimilarFor({ jobId, jobs: [] }))
    return () => {
      live = false
    }
  }, [jobId, deptId])

  const similarLoading = Boolean(jobId) && similarFor?.jobId !== jobId
  const similar = similarFor && similarFor.jobId === jobId ? similarFor.jobs : []

  useEffect(() => {
    const el = applyRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setApplyVisible(entry.isIntersecting), {
      rootMargin: '0px 0px -30% 0px',
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [job])

  const html = job?.descriptionHtml ? DOMPurify.sanitize(job.descriptionHtml, { USE_PROFILES: { html: true } }) : ''

  if (state.status === 'missing') return <NotFoundPage />

  function goToApply() {
    if (applyRef.current) scrollToElement(applyRef.current, { offset: -110 })
  }

  const { futureRole } = careerOpenPositions
  const salary = job ? formatSalary(job.salary) : null

  return (
    <SiteLayout>
      <PageMeta title={job ? `${job.title} | Careers at Dekko ISHO Group` : 'Careers | Dekko ISHO Group'} />
      {job && (
        <Helmet>
          <meta name="description" content={job.summary} />
          <meta property="og:description" content={job.summary} />
          <link rel="canonical" href={`${window.location.origin}/career/jobs/${job.slug}`} />
          {job.isOpen && <script type="application/ld+json">{jobPostingJsonLd(job)}</script>}
        </Helmet>
      )}
      <main className="careers-page">
        <section className="careers-hero careers-hero--job">
          <div className="career-content-container">
            <Breadcrumbs
              items={[
                { label: 'Careers', to: '/career' },
                { label: 'Jobs', to: '/career/jobs' },
                ...(job ? [{ label: job.title }] : []),
              ]}
            />

            {state.status === 'loading' && <JobHeroSkeleton />}

            {state.status === 'error' && (
              <div className="careers-empty careers-empty--hero">
                <h1 className="careers-empty-title">We couldn’t load this role</h1>
                <p>Please check your connection and try again.</p>
                <button type="button" className="apply-button" onClick={() => setAttempt((n) => n + 1)}>
                  Try again
                </button>
              </div>
            )}

            {job && (
              <div className="careers-hero-stack careers-loaded">
                <div className="careers-card-top">
                  {job.department && <span className="careers-card-dept">{job.department.name}</span>}
                  {!job.isOpen && <span className="careers-tag careers-tag--closed">Closed</span>}
                  {job.isOpen && isNew(job.publishedAt) && <span className="careers-tag careers-tag--new">New</span>}
                </div>
                <h1 className="careers-hero-title careers-job-title">{job.title}</h1>
                <JobMetaList job={job} className="careers-meta--hero" />
                <div className="careers-job-dates">
                  <span>{postedAgo(job.publishedAt)}</span>
                  {job.isOpen && <JobDeadline job={job} />}
                </div>
                {job.isOpen && (
                  <div className="careers-job-actions">
                    <button type="button" className="apply-button" onClick={goToApply}>
                      Apply now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {state.status === 'loading' && <JobBodySkeleton />}

        {job && (
          <>
            <section className="careers-body careers-loaded">
              <div className="career-content-container careers-job-layout">
                <div className="careers-job-main">
                  <article>
                    {html ? (
                      <div className="careers-prose" dangerouslySetInnerHTML={{ __html: html }} />
                    ) : (
                      <p className="careers-job-summary">{job.summary}</p>
                    )}
                  </article>

                  {job.isOpen ? (
                    <section id="apply" ref={applyRef} className="careers-apply careers-apply--inline" aria-labelledby="apply-title">
                      <div className="careers-apply-inner">
                        <h2 id="apply-title" className="careers-apply-title">
                          Apply for this role
                        </h2>
                        <p className="careers-apply-lead">
                          Start with your CV and we’ll fill in as much of the form as we can. It only takes a few minutes.
                        </p>
                        <ApplicationForm job={job} />
                      </div>
                    </section>
                  ) : (
                    <section className="careers-apply careers-apply--inline" aria-labelledby="closed-title">
                      <div className="careers-apply-inner careers-closed">
                        <h2 id="closed-title" className="careers-apply-title">
                          This role is no longer accepting applications
                        </h2>
                        <p className="careers-apply-lead">
                          Take a look at our other open roles, or share your CV and we’ll contact you when something similar opens up.
                        </p>
                        <div className="careers-closed-actions">
                          <Link to="/career/jobs" className="apply-button">
                            See open roles
                          </Link>
                          <Link to={futureRole.href} className="apply-button apply-button--secondary">
                            {futureRole.linkLabel}
                          </Link>
                        </div>
                      </div>
                    </section>
                  )}
                </div>

                <aside className="careers-job-aside">
                  <div className="careers-glance">
                    <h2 className="careers-glance-title">Role at a glance</h2>
                    <dl className="careers-glance-list">
                      {job.department && (
                        <div>
                          <dt>Department</dt>
                          <dd>{job.department.name}</dd>
                        </div>
                      )}
                      {job.locations.length > 0 && (
                        <div>
                          <dt>Location</dt>
                          <dd>{locationsLabel(job)}</dd>
                        </div>
                      )}
                      {job.jobType && (
                        <div>
                          <dt>Job type</dt>
                          <dd>{job.jobType.name}</dd>
                        </div>
                      )}
                      {job.experienceLevel && (
                        <div>
                          <dt>Experience</dt>
                          <dd>{job.experienceLevel}</dd>
                        </div>
                      )}
                      {salary && (
                        <div>
                          <dt>Salary</dt>
                          <dd>{salary}</dd>
                        </div>
                      )}
                      {job.customFields.map((f) => (
                        <div key={f.key}>
                          <dt>{f.label}</dt>
                          <dd>{customFieldText(f.value)}</dd>
                        </div>
                      ))}
                      {job.isOpen && job.deadline && (
                        <div>
                          <dt>Apply by</dt>
                          <dd>{formatDeadline(job.deadline)}</dd>
                        </div>
                      )}
                    </dl>
                    {job.isOpen && (
                      <button type="button" className="apply-button careers-glance-apply" onClick={goToApply}>
                        Apply now
                      </button>
                    )}
                    <ShareButtons slug={job.slug} title={job.title} />
                  </div>
                </aside>
              </div>
            </section>

            {(similarLoading || similar.length > 0) && (
              <section className="careers-similar" aria-labelledby="similar-title">
                <div className="career-content-container">
                  <h2 id="similar-title" className="careers-similar-title">
                    {job.isOpen ? 'More roles you might like' : 'Similar open roles'}
                  </h2>
                  {similarLoading ? (
                    <div className="careers-similar-grid" role="status" aria-busy="true" aria-label="Loading more roles">
                      {['58%', '46%', '52%'].map((w) => (
                        <JobCardSkeleton key={w} titleWidth={w} />
                      ))}
                    </div>
                  ) : (
                    <div className="careers-similar-grid careers-loaded">
                      {similar.map((j) => (
                        <JobCard key={j.id} job={j} headingLevel={3} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {job.isOpen && (
              <div className={`careers-sticky-apply${applyVisible ? ' is-hidden' : ''}`} aria-hidden={applyVisible}>
                <div className="careers-sticky-text">
                  <span className="careers-sticky-title">{job.title}</span>
                  {job.deadline && <span className="careers-sticky-sub">Apply by {formatDeadline(job.deadline)}</span>}
                </div>
                <button type="button" className="apply-button" onClick={goToApply} tabIndex={applyVisible ? -1 : 0}>
                  Apply now
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </SiteLayout>
  )
}
