import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { onIdTokenChanged, signInWithEmailAndPassword, signOut as fbSignOut, type User } from 'firebase/auth'
import type { StaffRole } from '@dekko-isho/shared'
import { api, ApiError } from './api'
import { auth } from './firebase'

export type Me = { uid: string; email: string; name: string; role: StaffRole; notifyDigest: boolean }

type Session = {
  status: 'loading' | 'signed-out' | 'signed-in' | 'no-access'
  user: User | null
  me: Me | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshMe: () => Promise<void>
  can: (action: 'edit' | 'admin') => boolean
}

const SessionContext = createContext<Session | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [status, setStatus] = useState<Session['status']>('loading')

  const loadedUid = useRef<string | null>(null)
  const retryTimer = useRef<number | undefined>(undefined)
  const retry = useRef<(u: User) => void>(() => {})

  const loadMe = useCallback(async (u: User | null, force = false) => {
    window.clearTimeout(retryTimer.current)
    if (!u) {
      loadedUid.current = null
      setMe(null)
      setStatus('signed-out')
      return
    }
    // Hourly token refreshes fire this too; the profile only needs loading once per sign-in.
    if (!force && loadedUid.current === u.uid) return
    try {
      const token = await u.getIdTokenResult()
      if (!token.claims.role) {
        loadedUid.current = null
        setMe(null)
        setStatus('no-access')
        return
      }
      setMe(await api<Me>('/api/hr/me'))
      loadedUid.current = u.uid
      setStatus('signed-in')
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        loadedUid.current = null
        setMe(null)
        setStatus(err.status === 403 ? 'no-access' : 'signed-out')
        return
      }
      // Network blip or API restart: keep the current session and try again shortly.
      if (loadedUid.current !== u.uid) retryTimer.current = window.setTimeout(() => retry.current(u), 4000)
    }
  }, [])

  useEffect(() => {
    retry.current = (u) => void loadMe(u, true)
    return () => window.clearTimeout(retryTimer.current)
  }, [loadMe])

  useEffect(() => {
    return onIdTokenChanged(auth, (u) => {
      setUser(u)
      void loadMe(u)
    })
  }, [loadMe])

  useEffect(() => {
    const onUnauthorized = () => void fbSignOut(auth)
    window.addEventListener('hr:unauthorized', onUnauthorized)
    return () => window.removeEventListener('hr:unauthorized', onUnauthorized)
  }, [])

  const value = useMemo<Session>(
    () => ({
      status,
      user,
      me,
      signIn: async (email, password) => {
        await signInWithEmailAndPassword(auth, email.trim(), password)
      },
      signOut: () => fbSignOut(auth),
      refreshMe: () => loadMe(auth.currentUser, true),
      can: (action) => (action === 'admin' ? me?.role === 'hr_admin' : me?.role === 'hr_admin' || me?.role === 'recruiter'),
    }),
    [status, user, me, loadMe],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}
