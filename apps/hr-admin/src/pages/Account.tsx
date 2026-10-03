import { useState } from 'react'
import { STAFF_ROLE_LABELS } from '@dekko-isho/shared'
import { Button, Switch, initials, useUi } from '../components/ui'
import { api, publicApi } from '../lib/api'
import { useSession } from '../lib/session'

export default function AccountPage() {
  const { me, refreshMe, signOut, can } = useSession()
  const { toast } = useUi()
  const [sending, setSending] = useState(false)
  if (!me) return null

  const setDigest = async (notifyDigest: boolean) => {
    try {
      await api('/api/hr/me', { method: 'PATCH', body: { notifyDigest } })
      await refreshMe()
      toast(notifyDigest ? 'You’ll get the daily summary' : 'Daily summary turned off')
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  const resetPassword = async () => {
    setSending(true)
    try {
      await publicApi('/password-reset', { email: me.email })
      toast(`We sent a password link to ${me.email}`)
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div className="page-head">
        <div>
          <h1>Your account</h1>
        </div>
      </div>
      <section className="card card-pad stack">
        <div className="row" style={{ flexWrap: 'nowrap' }}>
          <span className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
            {initials(me.name)}
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600 }}>{me.name}</div>
            <div className="small muted truncate">{me.email}</div>
          </div>
          <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>
            {STAFF_ROLE_LABELS[me.role]}
          </span>
        </div>
      </section>

      {can('edit') ? (
        <section className="card card-pad stack" style={{ marginTop: 16 }}>
          <h3>Email updates</h3>
          <Switch checked={me.notifyDigest} onChange={(v) => void setDigest(v)} label="Daily summary of new applications at 9 AM" />
          <p className="small muted">Sent only on days with new applications.</p>
        </section>
      ) : null}

      <section className="card card-pad stack" style={{ marginTop: 16 }}>
        <h3>Password</h3>
        <p className="small muted">We’ll email you a secure link to choose a new password.</p>
        <div className="row">
          <Button onClick={() => void resetPassword()} loading={sending}>
            Send password link
          </Button>
          <Button variant="ghost" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </section>
    </div>
  )
}
