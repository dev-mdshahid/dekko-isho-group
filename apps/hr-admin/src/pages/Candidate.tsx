import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone } from 'lucide-react'
import type { CvBankRow, CvProfile } from '@dekko-isho/shared'
import { AppStatusBadge, ErrorNote, SkeletonRows } from '../components/ui'
import { formatDate } from '../lib/format'
import { useApi } from '../lib/useApi'

type CandidateDetail = {
  id: string
  email: string
  fullName: string
  phoneE164?: string | null
  createdAt: string
  latestProfile?: CvProfile
  applications: CvBankRow[]
}

export default function CandidatePage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data, error, loading } = useApi<CandidateDetail>(`/api/hr/candidates/${id}`)

  if (error) {
    return (
      <div className="page">
        <ErrorNote error={error} />
      </div>
    )
  }
  if (loading || !data) {
    return (
      <div className="page">
        <SkeletonRows rows={6} />
      </div>
    )
  }

  const p = data.latestProfile
  return (
    <div className="page">
      <Link to="/cv-bank" className="back">
        <ArrowLeft size={16} /> CV Bank
      </Link>
      <div className="page-head">
        <div>
          <h1>{data.fullName}</h1>
          <p>
            First applied {formatDate(data.createdAt)} · {data.applications.length} {data.applications.length === 1 ? 'application' : 'applications'}
          </p>
        </div>
        <div className="page-actions">
          <a className="btn" href={`mailto:${data.email}`}>
            <Mail size={15} /> {data.email}
          </a>
          {data.phoneE164 ? (
            <a className="btn" href={`tel:${data.phoneE164}`}>
              <Phone size={15} /> <span className="num">{data.phoneE164}</span>
            </a>
          ) : null}
        </div>
      </div>

      <div className="split">
        <section className="card">
          <div className="card-head">
            <h3>Applications</h3>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Applied for</th>
                  <th>Stage</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {data.applications.map((a) => (
                  <tr key={a.applicationId} className="clickable" onClick={() => navigate(`/applications/${a.applicationId}`)}>
                    <td>
                      <div className="t-title">{a.source === 'talent_pool' ? 'Future roles (CV drop)' : a.jobTitle}</div>
                      <div className="t-sub">{a.departmentName}</div>
                    </td>
                    <td>
                      <AppStatusBadge status={a.status} />
                    </td>
                    <td className="small muted num">{formatDate(a.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {p ? (
          <section className="card card-pad stack">
            <h3>Latest CV</h3>
            <dl className="kv">
              <dt>Current role</dt>
              <dd>{[p.currentTitle, p.currentCompany].filter(Boolean).join(' at ') || '—'}</dd>
              <dt>Experience</dt>
              <dd className="num">{p.totalExperienceYears != null ? `${p.totalExperienceYears} years` : '—'}</dd>
              <dt>Education</dt>
              <dd>{p.highestEducationLevel ?? '—'}</dd>
              <dt>Lives in</dt>
              <dd>{p.location.city ?? '—'}</dd>
            </dl>
            {p.skills.length ? (
              <div className="chips">
                {p.skills.slice(0, 20).map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  )
}
