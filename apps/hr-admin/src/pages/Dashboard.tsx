import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { ApplicationStatus, CvBankRow, JobStatus } from '@dekko-isho/shared'
import { AppStatusBadge, Button, Empty, ErrorNote, SkeletonRows } from '../components/ui'
import { daysLeft, formatDate, plural, timeAgo } from '../lib/format'
import { useSession } from '../lib/session'
import { useApi } from '../lib/useApi'

type Dashboard = {
  jobs: Record<JobStatus, number>
  applications: { total: number; byStatus: Partial<Record<ApplicationStatus, number>>; last7: number }
  recent: CvBankRow[]
  closingSoon: Array<{ id: string; title: string; deadline: string; applicationsCount: number }>
  topCirculars: Array<{ id: string; title: string; applicationsCount: number; newApplicationsCount: number; isTalentPool: boolean }>
}

export default function DashboardPage() {
  const { me, can } = useSession()
  const navigate = useNavigate()
  const { data, error, loading } = useApi<Dashboard>('/api/hr/dashboard')
  const firstName = me?.name.split(' ')[0] ?? ''

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Good to see you, {firstName}</h1>
          <p>Here’s what’s happening with hiring today.</p>
        </div>
        {can('edit') ? (
          <div className="page-actions">
            <Link to="/circulars/new" className="btn btn-primary">
              <Plus size={16} /> New circular
            </Link>
          </div>
        ) : null}
      </div>

      <ErrorNote error={error} />

      <div className="grid-24" style={{ marginBottom: 20 }}>
        <div className="col-9">
          <Stat label="Live circulars" value={data?.jobs.published} hint={data ? `${data.jobs.scheduled} scheduled · ${data.jobs.draft} drafts` : ''} />
        </div>
        <div className="col-9">
          <Stat label="New applications" value={data?.applications.byStatus.new ?? (data ? 0 : undefined)} hint="Waiting for review" />
        </div>
        <div className="col-6">
          <Stat label="CVs in the bank" value={data?.applications.total} hint={data ? `${data.applications.byStatus.shortlisted ?? 0} shortlisted` : ''} />
        </div>
      </div>

      <div className="grid-24">
        <section className="card col-18">
          <div className="card-head">
            <h2>Latest applications</h2>
            <Link to="/cv-bank" className="small">
              Open CV Bank
            </Link>
          </div>
          {loading && !data ? (
            <SkeletonRows />
          ) : data?.recent.length ? (
            <div className="table-wrap">
              <table className="table">
                <tbody>
                  {data.recent.map((r) => (
                    <tr key={r.applicationId} className="clickable" onClick={() => navigate(`/applications/${r.applicationId}`)}>
                      <td>
                        <div className="t-title">{r.fullName}</div>
                        <div className="t-sub truncate">{r.jobTitle}</div>
                      </td>
                      <td className="muted small num">{r.expYears != null ? `${r.expYears} yrs` : '—'}</td>
                      <td>
                        <AppStatusBadge status={r.status} />
                      </td>
                      <td className="muted small" style={{ textAlign: 'right' }}>
                        {timeAgo(r.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No applications yet" action={can('edit') ? <Link to="/circulars/new" className="btn btn-primary">Publish a circular</Link> : undefined}>
              Applications appear here as soon as candidates apply.
            </Empty>
          )}
        </section>

        <div className="stack col-6">
          <section className="card">
            <div className="card-head">
              <h2>Most active circulars</h2>
            </div>
            <div className="card-body stack-sm">
              {data?.topCirculars.length ? (
                data.topCirculars.map((j) => (
                  <Link key={j.id} to={`/cv-bank?jobId=${j.id}`} className="spread" style={{ color: 'inherit', textDecoration: 'none', padding: '6px 0' }}>
                    <span className="truncate" style={{ fontWeight: 500 }}>
                      {j.isTalentPool ? 'Future roles (CV drop)' : j.title}
                    </span>
                    <span className="row num small" style={{ flex: 'none' }}>
                      {j.newApplicationsCount ? <span className="badge badge-blue plain">{j.newApplicationsCount} new</span> : null}
                      <span className="muted">{j.applicationsCount}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="muted small">{loading ? 'Loading…' : 'No live circulars.'}</p>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-head">
              <h2>Closing this week</h2>
            </div>
            <div className="card-body stack-sm">
              {data?.closingSoon.length ? (
                data.closingSoon.map((j) => {
                  const left = daysLeft(j.deadline) ?? 0
                  return (
                    <Link key={j.id} to={`/circulars/${j.id}`} className="spread" style={{ color: 'inherit', textDecoration: 'none', padding: '6px 0' }}>
                      <span style={{ minWidth: 0 }}>
                        <div className="truncate" style={{ fontWeight: 500 }}>
                          {j.title}
                        </div>
                        <div className="muted small">
                          {formatDate(j.deadline)} · {plural(j.applicationsCount, 'applicant')}
                        </div>
                      </span>
                      <span className={`badge plain ${left <= 2 ? 'badge-red' : 'badge-amber'}`}>{left <= 0 ? 'Today' : `${left}d left`}</span>
                    </Link>
                  )
                })
              ) : (
                <p className="muted small">{loading ? 'Loading…' : 'Nothing closes in the next 7 days.'}</p>
              )}
            </div>
          </section>
          {can('edit') ? (
            <Button onClick={() => navigate('/cv-bank?status=new')} className="btn-block">
              Review new applications
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: number | undefined; hint?: string }) {
  return (
    <div className="card stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? '—'}</div>
      {hint ? <div className="stat-hint">{hint}</div> : null}
    </div>
  )
}
