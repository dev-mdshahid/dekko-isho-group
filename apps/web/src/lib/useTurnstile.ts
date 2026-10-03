import { useCallback, useState } from 'react'

/** Token + reset counter for a `<Turnstile>` widget. Call `reset()` after each submit: tokens are single-use. */
export function useTurnstile() {
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const reset = useCallback(() => {
    setToken('')
    setResetKey((k) => k + 1)
  }, [])
  return { token, setToken, resetKey, reset }
}
