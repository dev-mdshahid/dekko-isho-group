import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE, ApiError, apiGet, apiPost, apiUpload } from './api'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

afterEach(() => vi.unstubAllGlobals())

describe('apiGet / apiPost', () => {
  it('calls the API and returns JSON', async () => {
    const fetch = vi.fn(async () => json({ ok: true }))
    vi.stubGlobal('fetch', fetch)
    expect(await apiGet('/api/health')).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/api/health`, expect.objectContaining({ headers: { Accept: 'application/json' } }))
    await apiPost('/api/public/contact', { a: 1 })
    expect(fetch).toHaveBeenLastCalledWith(`${API_BASE}/api/public/contact`, expect.objectContaining({ method: 'POST', body: '{"a":1}' }))
  })

  it('turns API errors into friendly messages with field details', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json({ error: 'Please check the highlighted fields', details: { fields: { email: 'Bad' } } }, 400)))
    const err = await apiPost('/x', {}).catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ status: 400, message: 'Please check the highlighted fields', fields: { email: 'Bad' } })
  })

  it('explains rate limits, non-JSON errors and network failures', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json({ error: 'slow down' }, 429)))
    await expect(apiGet('/x')).rejects.toThrow(/Too many attempts/)
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>oops</html>', { status: 502 })))
    await expect(apiGet('/x')).rejects.toThrow('Something went wrong. Please try again.')
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))))
    await expect(apiGet('/x')).rejects.toMatchObject({ status: 0, message: expect.stringMatching(/could not reach/) })
    await expect(apiPost('/x', {})).rejects.toMatchObject({ status: 0 })
  })

  it('lets aborted requests through untouched', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new DOMException('Aborted', 'AbortError'))))
    await expect(apiGet('/x')).rejects.toMatchObject({ name: 'AbortError' })
  })
})

class FakeXhr {
  static last: FakeXhr
  upload: { onprogress?: (e: { lengthComputable: boolean; loaded: number; total: number }) => void } = {}
  status = 0
  responseText = ''
  onload?: () => void
  onerror?: () => void
  onabort?: () => void
  url = ''
  constructor() {
    FakeXhr.last = this
  }
  open(_method: string, url: string) {
    this.url = url
  }
  setRequestHeader() {}
  send() {}
  abort() {
    this.onabort?.()
  }
  respond(status: number, body: string) {
    this.status = status
    this.responseText = body
    this.onload?.()
  }
}

describe('apiUpload', () => {
  it('reports progress and resolves with the response', async () => {
    vi.stubGlobal('XMLHttpRequest', FakeXhr)
    const progress = vi.fn()
    const { promise } = apiUpload('/api/public/cv', new FormData(), progress)
    FakeXhr.last.upload.onprogress?.({ lengthComputable: true, loaded: 5, total: 10 })
    FakeXhr.last.upload.onprogress?.({ lengthComputable: false, loaded: 0, total: 0 })
    FakeXhr.last.respond(200, '{"uploadId":"u1"}')
    expect(await promise).toEqual({ uploadId: 'u1' })
    expect(progress).toHaveBeenCalledTimes(1)
    expect(progress).toHaveBeenCalledWith(0.5)
    expect(FakeXhr.last.url).toBe(`${API_BASE}/api/public/cv`)
  })

  it('rejects with the server message, bad JSON, network errors and aborts', async () => {
    vi.stubGlobal('XMLHttpRequest', FakeXhr)
    let upload = apiUpload('/x', new FormData())
    FakeXhr.last.respond(400, '{"error":"Please upload a PDF"}')
    await expect(upload.promise).rejects.toThrow('Please upload a PDF')

    upload = apiUpload('/x', new FormData())
    FakeXhr.last.respond(200, 'not json')
    await expect(upload.promise).rejects.toThrow(/Something went wrong/)

    upload = apiUpload('/x', new FormData())
    FakeXhr.last.onerror?.()
    await expect(upload.promise).rejects.toMatchObject({ status: 0 })

    upload = apiUpload('/x', new FormData())
    upload.abort()
    await expect(upload.promise).rejects.toMatchObject({ name: 'AbortError' })
  })
})
