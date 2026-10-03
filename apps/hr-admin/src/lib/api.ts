import { auth } from './firebase'

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8794').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  fields: Record<string, string>
  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

type Options = { method?: string; body?: unknown; query?: Record<string, string | number | undefined | null>; form?: FormData }

async function request(path: string, opts: Options = {}): Promise<Response> {
  const token = await auth.currentUser?.getIdToken()
  const url = new URL(`${API_BASE}${path}`)
  for (const [k, v] of Object.entries(opts.query ?? {})) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v))
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(url, {
      method: opts.method ?? (opts.body !== undefined || opts.form ? 'POST' : 'GET'),
      headers,
      body: opts.form ?? (opts.body !== undefined ? JSON.stringify(opts.body) : undefined),
    })
  } catch {
    throw new ApiError(0, "We couldn't reach the server. Check your connection and try again.")
  }
  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string; details?: { fields?: Record<string, string> } }
    if (res.status === 401) window.dispatchEvent(new Event('hr:unauthorized'))
    throw new ApiError(res.status, data.error ?? 'Something went wrong. Please try again.', data.details?.fields ?? {})
  }
  return res
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const res = await request(path, opts)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export async function apiDownload(path: string, query: Options['query'], fallbackName: string) {
  const res = await request(path, { query })
  const blob = await res.blob()
  const name = /filename="([^"]+)"/.exec(res.headers.get('Content-Disposition') ?? '')?.[1] ?? fallbackName
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function publicApi<T>(path: string, body: unknown): Promise<T> {
  return api<T>(`/api/public${path}`, { body })
}
