import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, ExternalLink, Plus, Search } from 'lucide-react'
import type { Job, JobStatus } from '@dekko-isho/shared'
import { Button, Empty, ErrorNote, Input, JobStatusBadge, SkeletonRows, useUi } from '../components/ui'
import { api } from '../lib/api'
import { daysLeft, formatDate } from '../lib/format'
import { useSession } from '../lib/session'
import { useApi } from '../lib/useApi'

type Row = Omit<Job, 'form' | 'descriptionHtml' | 'descriptionJson'> & { departmentName: string; locationNames: string[]; jobTypeName: string }

const TABS: Array<{ key: 'active' | JobStatus | 'all'; label: string }> = [
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Drafts' },
  { key: 'closed', label: 'Closed' },
  { key: 'archived', label: 'Archived' },
  { key: 'all', label: 'All' },
]

const SITE = import.meta.env.VITE_SITE_URL || (import.meta.env.DEV ? 'http://localhost:5173' : window.location.origin)

export default function CircularsPage() {
  const { can } = useSession()
  const { toast } = useUi()
  const navigate = useNavigate()
  const { data, error, loading } = useApi<{ jobs: Row[] }>('/api/hr/jobs')
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('active')
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    const c: Record<string, number> = { active: 0, draft: 0, closed: 0, archived: 0, all: 0 }
    for (const j of data?.jobs ?? []) {
      c.all += 1
      if (j.status === 'published' || j.status === 'scheduled') c.active += 1
      else c[j.status] += 1
    }
    return c
  }, [data])

  const rows = (data?.jobs ?? []).filter((j) => {
    const inTab = tab === 'all' || (tab === 'active' ? j.status === 'published' || j.status === 'scheduled' : j.status === tab)
    const needle = q.trim().toLowerCase()
    return inTab && (!needle || `${j.title} ${j.departmentName} ${j.locationNames.join(' ')}`.toLowerCase().includes(needle))
  })

  const duplicate = async (id: string) => {
    try {
      const job = await api<Job>(`/api/hr/jobs/${id}/duplicate`, { method: 'POST' })
      toast('Copy created as a draft')
      navigate(`/circulars/${job.id}`)
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Circulars</h1>
          <p>Create, publish and manage job openings on the careers site.</p>
        </div>
        {can('edit') ? (
          <Link to="/circulars/new" className="btn btn-primary">
            <Plus size={16} /> New circular
          </Link>
        ) : null}
      </div>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
            <span className="count">{counts[t.key] ?? 0}</span>
          </button>
        ))}
      </div>

      <section className="card">
        <div className="filter-bar">
          <div className="input-group">
            <Search size={16} />
            <Input placeholder="Search by title, department or location" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search circulars" />
          </div>
        </div>
        <ErrorNote error={error} />
        {loading && !data ? (
          <SkeletonRows />
        ) : rows.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Deadline</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((j) => {
                  const left = daysLeft(j.deadline)
                  return (
                    <tr key={j.id} className="clickable" onClick={() => navigate(`/circulars/${j.id}`)}>
                      <td style={{ maxWidth: 360 }}>
                        <div className="t-title truncate">{j.isTalentPool ? `${j.title} (CV drop)` : j.title}</div>
                        <div className="t-sub truncate">{[j.departmentName, j.locationNames.join(', '), j.jobTypeName].filter(Boolean).join(' · ')}</div>
                      </td>
                      <td>
                        <JobStatusBadge status={j.status} />
                      </td>
                      <td className="num">
                        <Link to={`/cv-bank?jobId=${j.id}`} onClick={(e) => e.stopPropagation()}>
                          {j.applicationsCount}
                        </Link>
                        {j.newApplicationsCount ? <span className="badge badge-blue plain" style={{ marginLeft: 8 }}>{j.newApplicationsCount} new</span> : null}
                      </td>
                      <td className="small num">
                        {j.deadline ? (
                          <>
                            {formatDate(j.deadline)}
                            {j.status === 'published' && left != null && left <= 7 && left >= 0 ? <div className="muted">{left === 0 ? 'Closes today' : `${left} days left`}</div> : null}
                          </>
                        ) : (
                          <span className="muted">Open until filled</span>
                        )}
                      </td>
                      <td className="small muted num">{formatDate(j.updatedAt)}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                        {j.status === 'published' ? (
                          <a className="btn btn-ghost btn-sm btn-icon" href={`${SITE}/career/jobs/${j.slug}`} target="_blank" rel="noreferrer" aria-label="View on careers site" title="View on careers site">
                            <ExternalLink size={15} />
                          </a>
                        ) : null}
                        {can('edit') ? (
                          <Button variant="ghost" size="sm" icon aria-label="Duplicate" title="Duplicate" onClick={() => void duplicate(j.id)}>
                            <Copy size={15} />
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty
            title={q ? 'No circulars match your search' : 'Nothing here yet'}
            action={can('edit') && !q ? <Link to="/circulars/new" className="btn btn-primary">Create a circular</Link> : undefined}
          >
            {q ? 'Try a different keyword.' : 'Circulars you create will show up here.'}
          </Empty>
        )}
      </section>
    </div>
  )
}
