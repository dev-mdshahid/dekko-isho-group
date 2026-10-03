import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { confirmPasswordReset, signInWithEmailAndPassword, verifyPasswordResetCode } from 'firebase/auth'
import { publicApi } from '../lib/api'
import { auth } from '../lib/firebase'
import { useSession } from '../lib/session'
import { Button, Field, Input } from '../components/ui'

const logo = `${import.meta.env.BASE_URL}logo.svg`

function AuthCard({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children: ReactNode }) {
  return (
    <main className="auth">
      <div className="card auth-card">
        <img className="logo" src={logo} alt="Dekko ISHO Group" />
        <h1>{title}</h1>
        {subtitle ? <p className="muted">{subtitle}</p> : null}
        {children}
      </div>
    </main>
  )
}

function authMessage(err: unknown) {
  const code = err instanceof FirebaseError ? err.code : ''
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(code)) return 'That email and password don’t match. Try again or reset your password.'
  if (code === 'auth/user-disabled') return 'This account has been turned off. Ask an HR Admin to restore access.'
  if (code === 'auth/too-many-requests') return 'Too many attempts. Wait a few minutes, or reset your password.'
  if (code === 'auth/expired-action-code' || code === 'auth/invalid-action-code') return 'This link has expired or was already used. Ask for a new one.'
  if (code === 'auth/weak-password') return 'Choose a stronger password (at least 10 characters).'
  if (code === 'auth/network-request-failed') return 'We couldn’t connect. Check your internet and try again.'
  return err instanceof Error ? err.message : 'Something went wrong. Please try again.'
}

export function LoginPage() {
  const { signIn } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
    } catch (err) {
      setError(authMessage(err))
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Sign in to the HR Portal" subtitle="Manage circulars, review applicants and search the CV Bank.">
      <form className="stack" onSubmit={submit}>
        {error ? <div className="alert alert-error" role="alert">{error}</div> : null}
        <Field label="Work email">{(id) => <Input id={id} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
        <Field label="Password">
          {(id) => <Input id={id} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />}
        </Field>
        <Button type="submit" variant="primary" className="btn-block" loading={busy}>
          Sign in
        </Button>
        <Link to="/forgot-password" className="small" style={{ textAlign: 'center' }}>
          Forgot your password?
        </Link>
      </form>
      <p className="auth-foot">Access is by invitation from your HR Admin.</p>
    </AuthCard>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await publicApi('/password-reset', { email })
      setSent(true)
    } catch (err) {
      setError(authMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Reset your password" subtitle={sent ? undefined : 'Enter your work email and we’ll send you a link to choose a new password.'}>
      {sent ? (
        <div className="stack" style={{ marginTop: 20 }}>
          <div className="alert alert-success">If {email} has HR Portal access, a reset link is on its way. Check your inbox and spam folder.</div>
          <Link to="/login" className="btn btn-block">
            Back to sign in
          </Link>
        </div>
      ) : (
        <form className="stack" onSubmit={submit}>
          {error ? <div className="alert alert-error" role="alert">{error}</div> : null}
          <Field label="Work email">{(id) => <Input id={id} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
          <Button type="submit" variant="primary" className="btn-block" loading={busy}>
            Send reset link
          </Button>
          <Link to="/login" className="small" style={{ textAlign: 'center' }}>
            Back to sign in
          </Link>
        </form>
      )}
    </AuthCard>
  )
}

export function SetPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const code = params.get('code') ?? ''
  const isInvite = params.get('mode') === 'invite'
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 10) return setError('Use at least 10 characters.')
    if (password !== confirm) return setError('The two passwords don’t match.')
    setBusy(true)
    try {
      const email = await verifyPasswordResetCode(auth, code)
      await confirmPasswordReset(auth, code, password)
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(authMessage(err))
      setBusy(false)
    }
  }

  if (!code) {
    return (
      <AuthCard title="This link isn’t complete" subtitle="Open the link from your email again, or ask for a new one.">
        <Link to="/forgot-password" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
          Get a new link
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={isInvite ? 'Welcome to the HR Portal' : 'Choose a new password'}
      subtitle={isInvite ? 'Set a password to activate your account.' : 'Pick something you haven’t used before.'}
    >
      <form className="stack" onSubmit={submit}>
        {error ? <div className="alert alert-error" role="alert">{error}</div> : null}
        {params.get('email') ? (
          <Field label="Email">{(id) => <Input id={id} value={params.get('email') ?? ''} readOnly disabled />}</Field>
        ) : null}
        <Field label="New password" hint="At least 10 characters.">
          {(id) => <Input id={id} type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />}
        </Field>
        <Field label="Confirm password">
          {(id) => <Input id={id} type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />}
        </Field>
        <Button type="submit" variant="primary" className="btn-block" loading={busy}>
          {isInvite ? 'Activate account' : 'Save password'}
        </Button>
      </form>
    </AuthCard>
  )
}

export function NoAccessPage() {
  const { signOut, user } = useSession()
  return (
    <AuthCard title="No HR Portal access" subtitle={`${user?.email ?? 'This account'} isn’t set up for the HR Portal. Ask an HR Admin to invite you.`}>
      <Button className="btn-block" style={{ marginTop: 20 }} onClick={() => void signOut()}>
        Sign out
      </Button>
    </AuthCard>
  )
}
