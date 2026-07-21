import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type RefObject,
  type SetStateAction,
} from 'react'

import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'
import { getLenis } from '../lib/smoothScroll'

export type SplashPhase = 'idle' | 'loading' | 'transitioning' | 'complete' | 'skipped'

type SplashContextValue = {
  phase: SplashPhase
  setPhase: Dispatch<SetStateAction<SplashPhase>>
  isActive: boolean
  logoTargetRef: RefObject<HTMLElement | null>
  registerLogoTarget: (el: HTMLElement | null) => void
  completeSplash: () => void
}

const SplashContext = createContext<SplashContextValue | null>(null)

function getInitialPhase(): SplashPhase {
  if (typeof window === 'undefined') return 'skipped'
  if (prefersReducedMotion()) return 'skipped'
  // If the boot splash was already skipped in index.html, stay skipped.
  if (document.documentElement.classList.contains('splash-done')) return 'skipped'
  return 'idle'
}

export function SplashProvider({ children }: PropsWithChildren) {
  const logoTargetRef = useRef<HTMLElement | null>(null)
  const [phase, setPhase] = useState<SplashPhase>(getInitialPhase)

  const isActive = phase === 'idle' || phase === 'loading' || phase === 'transitioning'

  const registerLogoTarget = useCallback((el: HTMLElement | null) => {
    logoTargetRef.current = el
  }, [])

  const completeSplash = useCallback(() => {
    setPhase('complete')
  }, [])

  // Lock scroll while splash covers the viewport.
  useEffect(() => {
    if (!isActive) return

    const { body, documentElement } = document
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    const scrollbarGap = window.innerWidth - documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`
    }

    getLenis()?.stop()

    return () => {
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
      getLenis()?.start()
    }
  }, [isActive])

  useEffect(() => {
    if (phase !== 'idle') return
    setPhase('loading')
  }, [phase])

  // Drop any leftover once-per-session flag from earlier builds.
  useEffect(() => {
    try {
      sessionStorage.removeItem('dig-splash-complete')
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo<SplashContextValue>(
    () => ({
      phase,
      setPhase,
      isActive,
      logoTargetRef,
      registerLogoTarget,
      completeSplash,
    }),
    [phase, isActive, registerLogoTarget, completeSplash],
  )

  return <SplashContext.Provider value={value}>{children}</SplashContext.Provider>
}

export function useSplash() {
  const ctx = useContext(SplashContext)
  if (!ctx) {
    throw new Error('useSplash must be used within SplashProvider')
  }
  return ctx
}

export function useSplashOptional() {
  return useContext(SplashContext)
}
