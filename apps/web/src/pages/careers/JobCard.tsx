import { formatSalary } from '@dekko-isho/shared'
import { ArrowRight, BriefcaseBusiness, Clock, MapPin, Signal, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  closingSoon,
  customFieldText,
  formatDeadline,
  isNew,
  locationsLabel,
  postedAgo,
  type PublicJob,
} from '../../lib/careersApi'

export function JobMetaList({ job, className = '' }: { job: PublicJob; className?: string }) {
  const salary = formatSalary(job.salary)
  return (
    <ul className={`careers-meta ${className}`}>
      {job.locations.length > 0 && (
        <li>
          <MapPin size={16} aria-hidden="true" />
          <span className="careers-visually-hidden">Location: </span>
          {locationsLabel(job)}
        </li>
      )}
      {job.jobType && (
        <li>
          <BriefcaseBusiness size={16} aria-hidden="true" />
          <span className="careers-visually-hidden">Job type: </span>
          {job.jobType.name}
        </li>
      )}
      {job.experienceLevel && (
        <li>
          <Signal size={16} aria-hidden="true" />
          <span className="careers-visually-hidden">Experience: </span>
          {job.experienceLevel}
        </li>
      )}
      {salary && (
        <li>
          <Wallet size={16} aria-hidden="true" />
          <span className="careers-visually-hidden">Salary: </span>
          {salary}
        </li>
      )}
    </ul>
  )
}

export function JobDeadline({ job }: { job: PublicJob }) {
  if (!job.deadline) return null
  const soon = closingSoon(job.deadline)
  return (
    <span className={`careers-deadline${soon ? ' is-soon' : ''}`}>
      <Clock size={14} aria-hidden="true" />
      {soon ? 'Closing soon · ' : ''}Apply by {formatDeadline(job.deadline)}
    </span>
  )
}

export function JobCard({ job, headingLevel = 2 }: { job: PublicJob; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  const cardFields = job.customFields.filter((f) => f.showOnCard)
  return (
    <article className="careers-card">
      <div className="careers-card-top">
        {job.department && <span className="careers-card-dept">{job.department.name}</span>}
        {isNew(job.publishedAt) && <span className="careers-tag careers-tag--new">New</span>}
      </div>
      <Heading className="careers-card-title">
        <Link to={`/career/jobs/${job.slug}`} className="careers-card-link">
          {job.title}
        </Link>
      </Heading>
      <JobMetaList job={job} />
      {cardFields.length > 0 && (
        <ul className="careers-card-fields">
          {cardFields.map((f) => (
            <li key={f.key}>
              <span>{f.label}:</span> {customFieldText(f.value)}
            </li>
          ))}
        </ul>
      )}
      {job.summary && <p className="careers-card-summary">{job.summary}</p>}
      <div className="careers-card-footer">
        <span className="careers-card-dates">
          <span>{postedAgo(job.publishedAt)}</span>
          <JobDeadline job={job} />
        </span>
        <span className="careers-card-cta" aria-hidden="true">
          View role <ArrowRight size={16} />
        </span>
      </div>
    </article>
  )
}
