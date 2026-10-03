import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { STAFF_ROLE_LABELS, type StaffRole } from '@dekko-isho/shared'
import { Empty, ErrorNote, Input, SkeletonRows } from '../components/ui'
import { formatDateTime, timeAgo } from '../lib/format'
import { useApi } from '../lib/useApi'

type Entry = { id: string; actorEmail: string | null; action: string; target: string; meta: Record<string, unknown>; at: string }

const ACTIONS: Record<string, string> = {
  'job.create': 'created a circular',
  'job.update': 'edited a circular',
  'job.duplicate': 'duplicated a circular',
  'job.delete': 'deleted a circular',
  'job.publish': 'published a circular',
  'job.close': 'closed a circular',
  'job.unpublish': 'unpublished a circular',
  'job.reopen': 'reopened a circular',
  'job.archive': 'archived a circular',
  'job.unarchive': 'restored a circular',
  'application.status': 'moved an application',
  'application.profile': 'edited a candidate profile',
  'application.cv.view': 'opened a CV',
  'application.attachment.view': 'opened an attachment',
  'cvbank.export': 'exported the CV Bank',
  'user.invite': 'invited a team member',
  'user.update': 'updated a team member',
  'user.resendInvite': 'resent an invite',
  'user.delete': 'removed a team member',
  'template.create': 'saved a form template',
  'template.update': 'updated a form template',
  'template.delete': 'deleted a form template',
}

function describe(e: Entry) {
  if (ACTIONS[e.action]) return ACTIONS[e.action]
  const m = /^settings\.(\w+)\.(create|update|delete)$/.exec(e.action)
  if (m) {
    const what = { departments: 'department', locations: 'location', jobTypes: 'job type', customField: 'custom field' }[m[1]] ?? 'setting'
    return `${m[2] === 'create' ? 'added' : m[2] === 'update' ? 'edited' : 'deleted'} a ${what}`
  }
  return e.action
}

function detail(e: Entry) {
  const m = e.meta ?? {}
  if (typeof m.status === 'string') return m.status.replace(/_/g, ' ')
  if (typeof m.action === 'string') return m.action
  if (typeof m.email === 'string') return m.email
  if (typeof m.role === 'string') return `role: ${STAFF_ROLE_LABELS[m.role as StaffRole] ?? m.role}`
  if (typeof m.disabled === 'boolean') return m.disabled ? 'access paused' : 'access restored'
  if (typeof m.name === 'string') return m.name
  if (typeof m.title === 'string') return m.title
  if (typeof m.key === 'string') return m.key
  return null
}

function targetLink(e: Entry) {
  if (e.action.startsWith('application.')) return `/applications/${e.target}`
  if (e.action.startsWith('job.') && e.action !== 'job.delete') return `/circulars/${e.target}`
  return null
}

export default function ActivityPage() {
  const { data, error, loading } = useApi<{ entries: Entry[] }>('/api/hr/audit', { limit: 500 })
  const [q, setQ] = useState('')
  const [hideViews, setHideViews] = useState(true)

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return (data?.entries ?? []).filter((e) => {
      if (hideViews && e.action.endsWith('.view')) return false
      if (!needle) return true
      return [e.actorEmail, describe(e), detail(e)].some((s) => s?.toLowerCase().includes(needle))
    })
  }, [data, q, hideViews])

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Activity log</h1>
          <p>Who did what in the HR portal, newest first.</p>
        </div>
      </div>
      <section className="card">
        <div className="filter-bar">
          <div className="input-group">
            <Search size={16} />
            <Input placeholder="Search by person or action" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search activity" />
          </div>
          <label className="row small" style={{ flexWrap: 'nowrap' }}>
            <input type="checkbox" checked={hideViews} onChange={(e) => setHideViews(e.target.checked)} /> Hide CV views
          </label>
        </div>
        <ErrorNote error={error} />
        {loading && !data ? (
          <SkeletonRows rows={8} />
        ) : rows.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Who</th>
                  <th>What</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => {
                  const link = targetLink(e)
                  const extra = detail(e)
                  return (
                    <tr key={e.id}>
                      <td className="small muted" title={formatDateTime(e.at)} style={{ whiteSpace: 'nowrap' }}>
                        {timeAgo(e.at)}
                      </td>
                      <td className="truncate" style={{ maxWidth: 240 }}>
                        {e.actorEmail ?? 'System'}
                      </td>
                      <td>
                        {link ? <Link to={link}>{describe(e)}</Link> : describe(e)}
                        {extra ? <span className="muted"> · {extra}</span> : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title={q ? 'Nothing matches' : 'No activity yet'} />
        )}
      </section>
    </div>
  )
}
