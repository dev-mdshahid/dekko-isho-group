import { useEffect, useRef } from 'react'
import { TURNSTILE_SITE_KEY } from '../../lib/turnstile'

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  remove: (id: string) => void
  reset: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null

function loadScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')))
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('turnstile failed to load'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

type Props = {
  onToken: (token: string) => void
  /** Changing this forces a fresh challenge (tokens are single-use). */
  resetKey?: number
  /** `interaction-only` stays invisible unless Cloudflare needs the visitor to click. */
  appearance?: 'always' | 'interaction-only'
  className?: string
}

/** Renders nothing when no site key is configured. */
export function Turnstile({ onToken, resetKey, appearance = 'always', className = 'apply-turnstile' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const onTokenRef = useRef(onToken)

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !ref.current) return
    let widgetId: string | null = null
    let cancelled = false
    loadScript()
      .then((api) => {
        if (cancelled || !ref.current) return
        widgetId = api.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance,
          callback: (token: string) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        })
      })
      .catch(() => onTokenRef.current(''))
    return () => {
      cancelled = true
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [resetKey, appearance])

  if (!TURNSTILE_SITE_KEY) return null
  return <div ref={ref} className={className} />
}
