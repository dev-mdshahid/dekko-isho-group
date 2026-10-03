export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  fields: Record<string, string>

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

const NETWORK_MESSAGE = 'We could not reach our servers. Please check your connection and try again.'

async function toApiError(res: Response): Promise<ApiError> {
  let message = 'Something went wrong. Please try again.'
  let fields: Record<string, string> = {}
  try {
    const body = (await res.json()) as { error?: string; message?: string; details?: { fields?: Record<string, string> } }
    message = body.error ?? body.message ?? message
    fields = body.details?.fields ?? {}
  } catch {
    // Non-JSON error body; keep the generic message.
  }
  if (res.status === 429) message = 'Too many attempts. Please wait a minute and try again.'
  return new ApiError(res.status, message, fields)
}

export async function apiGet<T>(path: string, init?: { signal?: AbortSignal }): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, { signal: init?.signal, headers: { Accept: 'application/json' } })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    throw new ApiError(0, NETWORK_MESSAGE)
  }
  if (!res.ok) throw await toApiError(res)
  return (await res.json()) as T
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, NETWORK_MESSAGE)
  }
  if (!res.ok) throw await toApiError(res)
  return (await res.json()) as T
}

/** Multipart upload with progress (0–1). Resolves with the parsed JSON body. */
export function apiUpload<T>(
  path: string,
  data: FormData,
  onProgress?: (fraction: number) => void,
): { promise: Promise<T>; abort: () => void } {
  const xhr = new XMLHttpRequest()
  const promise = new Promise<T>((resolve, reject) => {
    xhr.open('POST', `${API_BASE}${path}`)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(event.loaded / event.total)
    }
    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as T)
        } catch {
          reject(new ApiError(xhr.status, 'Something went wrong. Please try again.'))
        }
        return
      }
      reject(await toApiError(new Response(xhr.responseText, { status: xhr.status })))
    }
    xhr.onerror = () => reject(new ApiError(0, NETWORK_MESSAGE))
    xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'))
    xhr.send(data)
  })
  return { promise, abort: () => xhr.abort() }
}
