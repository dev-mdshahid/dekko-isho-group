import { useState } from 'react'
import { MoreHorizontal, Plus } from 'lucide-react'
import { STAFF_ROLES, STAFF_ROLE_LABELS, type StaffRole, type StaffUser } from '@dekko-isho/shared'
import { Button, Empty, ErrorNote, Field, Input, Modal, Select, SkeletonRows, initials, useUi } from '../components/ui'
import { api, ApiError } from '../lib/api'
import { formatDate, timeAgo } from '../lib/format'
import { useSession } from '../lib/session'
import { useApi } from '../lib/useApi'

const ROLE_HINTS: Record<StaffRole, string> = {
  hr_admin: 'Everything, including team members and settings.',
  recruiter: 'Create and publish circulars, manage candidates.',
  viewer: 'Read-only access to circulars and the CV Bank.',
}

export default function UsersPage() {
  const { me } = useSession()
  const { confirm, toast } = useUi()
  const { data, error, loading, reload } = useApi<{ users: StaffUser[] }>('/api/hr/users')
  const [inviting, setInviting] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)

  const patch = async (u: StaffUser, body: Partial<Pick<StaffUser, 'role' | 'disabled' | 'name'>>, message: string) => {
    try {
      await api(`/api/hr/users/${u.uid}`, { method: 'PATCH', body })
      toast(message)
      reload()
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  const changeRole = async (u: StaffUser, role: StaffRole) => {
    if (role === u.role) return
    await patch(u, { role }, `${u.name} is now ${STAFF_ROLE_LABELS[role]}`)
  }

  const toggleDisabled = async (u: StaffUser) => {
    setMenu(null)
    if (!u.disabled) {
      const ok = await confirm({ title: `Turn off access for ${u.name}?`, body: 'They’ll be signed out right away and won’t be able to sign in until you turn access back on.', confirmLabel: 'Turn off access', danger: true })
      if (!ok) return
    }
    await patch(u, { disabled: !u.disabled }, u.disabled ? `${u.name} can sign in again` : `${u.name} can no longer sign in`)
  }

  const resend = async (u: StaffUser) => {
    setMenu(null)
    try {
      await api(`/api/hr/users/${u.uid}/resend-invite`, { method: 'POST' })
      toast(`Invite sent to ${u.email}`)
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  const remove = async (u: StaffUser) => {
    setMenu(null)
    const ok = await confirm({ title: `Remove ${u.name}?`, body: 'Their account is deleted. Notes they wrote stay on candidate records.', confirmLabel: 'Remove', danger: true })
    if (!ok) return
    try {
      await api(`/api/hr/users/${u.uid}`, { method: 'DELETE' })
      toast(`${u.name} removed`)
      reload()
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Team</h1>
          <p>People who can sign in to the HR portal.</p>
        </div>
        <Button variant="primary" onClick={() => setInviting(true)}>
          <Plus size={15} /> Invite
        </Button>
      </div>
      <ErrorNote error={error} />
      <section className="card">
        {loading && !data ? (
          <SkeletonRows rows={4} />
        ) : data?.users.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Last sign-in</th>
                  <th>Added</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {data.users.map((u) => {
                  const self = u.uid === me?.uid
                  return (
                    <tr key={u.uid} style={u.disabled ? { opacity: 0.6 } : undefined}>
                      <td>
                        <div className="row" style={{ flexWrap: 'nowrap' }}>
                          <span className="avatar">{initials(u.name)}</span>
                          <div style={{ minWidth: 0 }}>
                            <div className="t-title truncate">
                              {u.name}
                              {self ? <span className="muted"> (you)</span> : null}
                              {u.disabled ? <span className="badge" style={{ marginLeft: 8 }}>No access</span> : null}
                            </div>
                            <div className="t-sub truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Select value={u.role} disabled={self} onChange={(e) => void changeRole(u, e.target.value as StaffRole)} aria-label={`Role for ${u.name}`} style={{ width: 'auto' }}>
                          {STAFF_ROLES.map((r) => (
                            <option key={r} value={r}>
                              {STAFF_ROLE_LABELS[r]}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="small muted">{u.lastLoginAt ? timeAgo(u.lastLoginAt) : 'Not yet'}</td>
                      <td className="small muted num">{formatDate(u.createdAt)}</td>
                      <td style={{ textAlign: 'right', position: 'relative' }}>
                        {self ? null : (
                          <>
                            <Button variant="ghost" size="sm" icon aria-label={`More actions for ${u.name}`} aria-expanded={menu === u.uid} onClick={() => setMenu(menu === u.uid ? null : u.uid)}>
                              <MoreHorizontal size={16} />
                            </Button>
                            {menu === u.uid ? (
                              <div className="menu" role="menu" onMouseLeave={() => setMenu(null)}>
                                {!u.lastLoginAt ? (
                                  <button role="menuitem" onClick={() => void resend(u)}>
                                    Resend invite
                                  </button>
                                ) : null}
                                <button role="menuitem" onClick={() => void toggleDisabled(u)}>
                                  {u.disabled ? 'Turn access back on' : 'Turn off access'}
                                </button>
                                <button role="menuitem" className="danger" onClick={() => void remove(u)}>
                                  Remove
                                </button>
                              </div>
                            ) : null}
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty title="No team members yet" />
        )}
      </section>
      <div className="card card-pad" style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 10 }}>Roles</h3>
        <dl className="kv">
          {STAFF_ROLES.map((r) => (
            <div key={r} style={{ display: 'contents' }}>
              <dt>{STAFF_ROLE_LABELS[r]}</dt>
              <dd>{ROLE_HINTS[r]}</dd>
            </div>
          ))}
        </dl>
      </div>
      {inviting ? (
        <InviteDialog
          onClose={() => setInviting(false)}
          onDone={() => {
            setInviting(false)
            reload()
          }}
        />
      ) : null}
    </div>
  )
}

function InviteDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const { toast } = useUi()
  const [form, setForm] = useState({ name: '', email: '', role: 'recruiter' as StaffRole })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Enter a valid email'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      await api('/api/hr/users', { body: { ...form, email: form.email.trim() } })
      toast(`Invite sent to ${form.email.trim()}`)
      onDone()
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) setErrors(err.fields)
      else toast((err as Error).message, 'error')
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Invite a team member"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={busy} onClick={() => void submit()}>
            Send invite
          </Button>
        </>
      }
    >
      <form className="stack" onSubmit={(e) => void submit(e)}>
        <p className="small muted">They’ll get an email with a link to set their password.</p>
        <Field label="Name" required error={errors.name}>
          {(id) => <Input id={id} autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} invalid={!!errors.name} />}
        </Field>
        <Field label="Work email" required error={errors.email}>
          {(id) => <Input id={id} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} invalid={!!errors.email} />}
        </Field>
        <Field label="Role" hint={ROLE_HINTS[form.role]}>
          {(id) => (
            <Select id={id} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}>
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {STAFF_ROLE_LABELS[r]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  )
}
