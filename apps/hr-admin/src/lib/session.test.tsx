import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

type Listener = (u: unknown) => void
let listener: Listener = () => {}
const signInWithEmailAndPassword = vi.fn(async () => ({}))
const signOut = vi.fn(async () => {})
vi.mock('firebase/auth', () => ({
  onIdTokenChanged: (_auth: unknown, cb: Listener) => {
    listener = cb
    return () => {}
  },
  signInWithEmailAndPassword: (...a: unknown[]) => signInWithEmailAndPassword(...(a as [])),
  signOut: (...a: unknown[]) => signOut(...(a as [])),
}))
const fakeAuth: { currentUser: unknown } = { currentUser: null }
vi.mock('./firebase', () => ({ auth: fakeAuth }))
const api = vi.fn()
vi.mock('./api', async (original) => ({ ...(await original<typeof import('./api')>()), api: (...a: unknown[]) => api(...a) }))

const { SessionProvider, useSession } = await import('./session')
const { ApiError } = await import('./api')

const user = (uid: string, role?: string) => ({ uid, getIdTokenResult: vi.fn(async () => ({ claims: role ? { role } : {} })) })
const me = (role: string) => ({ uid: 'u1', email: 'a@x.com', name: 'Ayesha', role, notifyDigest: true })

function Probe() {
  const s = useSession()
  return (
    <div>
      <span data-testid="status">{s.status}</span>
      <span data-testid="name">{s.me?.name ?? ''}</span>
      <span data-testid="can">{`${s.can('edit')}/${s.can('admin')}`}</span>
      <button onClick={() => void s.signIn(' a@x.com ', 'pw')}>sign in</button>
      <button onClick={() => void s.signOut()}>sign out</button>
      <button onClick={() => void s.refreshMe()}>refresh</button>
    </div>
  )
}

const status = () => screen.getByTestId('status').textContent

beforeEach(() => {
  api.mockReset()
  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>,
  )
})
afterEach(() => vi.useRealTimers())

describe('SessionProvider', () => {
  it('starts loading, then signs out when nobody is signed in', async () => {
    expect(status()).toBe('loading')
    await act(async () => listener(null))
    expect(status()).toBe('signed-out')
  })

  it('loads the staff profile once per sign-in', async () => {
    api.mockResolvedValue(me('recruiter'))
    const u = user('u1', 'recruiter')
    await act(async () => listener(u))
    expect(status()).toBe('signed-in')
    expect(screen.getByTestId('name')).toHaveTextContent('Ayesha')
    expect(screen.getByTestId('can')).toHaveTextContent('true/false')
    await act(async () => listener(u))
    expect(api).toHaveBeenCalledTimes(1)

    fakeAuth.currentUser = u
    api.mockResolvedValue(me('hr_admin'))
    await userEvent.click(screen.getByText('refresh'))
    await waitFor(() => expect(screen.getByTestId('can')).toHaveTextContent('true/true'))
  })

  it('blocks accounts without an HR role', async () => {
    await act(async () => listener(user('u2')))
    expect(status()).toBe('no-access')
    expect(api).not.toHaveBeenCalled()
  })

  it('handles revoked access and expired sessions', async () => {
    api.mockRejectedValueOnce(new ApiError(403, 'No access'))
    await act(async () => listener(user('u3', 'viewer')))
    expect(status()).toBe('no-access')
    api.mockRejectedValueOnce(new ApiError(401, 'Sign in'))
    await act(async () => listener(user('u4', 'viewer')))
    expect(status()).toBe('signed-out')
  })

  it('retries quietly when the server is briefly unreachable', async () => {
    vi.useFakeTimers()
    api.mockRejectedValueOnce(new ApiError(0, 'offline')).mockResolvedValueOnce(me('viewer'))
    await act(async () => listener(user('u5', 'viewer')))
    expect(status()).toBe('loading')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(4000)
    })
    expect(status()).toBe('signed-in')
    expect(screen.getByTestId('can')).toHaveTextContent('false/false')
  })

  it('signs in, signs out and reacts to expired tokens', async () => {
    await userEvent.click(screen.getByText('sign in'))
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(fakeAuth, 'a@x.com', 'pw')
    await userEvent.click(screen.getByText('sign out'))
    expect(signOut).toHaveBeenCalledTimes(1)
    window.dispatchEvent(new Event('hr:unauthorized'))
    expect(signOut).toHaveBeenCalledTimes(2)
  })
})

describe('useSession', () => {
  it('must be used inside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<OutsideProbe />)).toThrow(/inside SessionProvider/)
    spy.mockRestore()
  })
})

function OutsideProbe() {
  useSession()
  return null
}
