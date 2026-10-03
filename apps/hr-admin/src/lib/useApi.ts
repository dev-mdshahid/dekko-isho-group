import { useCallback, useEffect, useState } from 'react'
import { api } from './api'

type Query = Record<string, string | number | undefined | null>

/** Fetches on mount and whenever `path` or `query` change. Keeps the previous data while refetching. */
export function useApi<T>(path: string | null, query?: Query) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [tick, setTick] = useState(0)
  const [doneKey, setDoneKey] = useState<string | null>(null)
  const key = path ? `${path}?${JSON.stringify(query ?? {})}#${tick}` : null

  useEffect(() => {
    if (!path || !key) return
    let live = true
    api<T>(path, { query })
      .then((result) => {
        if (!live) return
        setData(result)
        setError(null)
      })
      .catch((err: unknown) => {
        if (live) setError(err)
      })
      .finally(() => {
        if (live) setDoneKey(key)
      })
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const reload = useCallback(() => setTick((t) => t + 1), [])

  return { data, error, loading: Boolean(key) && doneKey !== key, reload, setData }
}
