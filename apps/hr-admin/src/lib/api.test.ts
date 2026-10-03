import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const currentUser = { getIdToken: vi.fn(async () => 'id-token') }
const fakeAuth: { currentUser: typeof currentUser | null } = { currentUser }
vi.mock('./firebase', () => ({ auth: fakeAuth }))

const { api, apiDownload, ApiError, publicApi, API_BASE } = await import('./api')

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(status === 204 ? null : JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })

let fetch: ReturnType<typeof vi.fn>
beforeEach(() => {
  fakeAuth.currentUser = currentUser
  fetch = vi.fn(async () => json({ ok: true }))
  vi.stubGlobal('fetch', fetch)
})
afterEach(() => vi.unstubAllGlobals())

const lastCall = () => fetch.mock.calls.at(-1) as [URL, RequestInit & { headers: Record<string, string> }]

describe('api', () => {
  it('sends the signed-in user token and query parameters', async () => {
    await api('/api/hr/cv-bank', { query: { q: 'rahim', page: 2, empty: '', none: null, missing: undefined } })
    const [url, init] = lastCall()
    expect(url.toString()).toBe(`${API_BASE}/api/hr/cv-bank?q=rahim&page=2`)
    expect(init.method).toBe('GET')
    expect(init.headers.Authorization).toBe('Bearer id-token')
  })

  it('sends JSON bodies and file uploads with the right method', async () => {
    await api('/api/hr/jobs', { body: { title: 'x' } })
    expect(lastCall()[1]).toMatchObject({ method: 'POST', body: '{"title":"x"}', headers: { 'Content-Type': 'application/json' } })
    await api('/api/hr/jobs/1', { method: 'PUT', body: {} })
    expect(lastCall()[1].method).toBe('PUT')
    const form = new FormData()
    await api('/api/hr/images', { form })
    expect(lastCall()[1]).toMatchObject({ method: 'POST', body: form })
    expect(lastCall()[1].headers['Content-Type']).toBeUndefined()
  })

  it('works without a signed-in user and handles empty replies', async () => {
    fakeAuth.currentUser = null
    fetch.mockResolvedValueOnce(json(null, 204))
    expect(await api('/api/hr/jobs/1', { method: 'DELETE' })).toBeUndefined()
    expect(lastCall()[1].headers.Authorization).toBeUndefined()
    await publicApi('/contact', { a: 1 })
    expect(lastCall()[0].toString()).toBe(`${API_BASE}/api/public/contact`)
  })

  it('surfaces server errors with field details', async () => {
    fetch.mockResolvedValueOnce(json({ error: 'Key "shift" is already used', details: { fields: { key: 'Taken' } } }, 400))
    const err = await api('/x').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err).toMatchObject({ status: 400, message: 'Key "shift" is already used', fields: { key: 'Taken' } })
    fetch.mockResolvedValueOnce(new Response('oops', { status: 500 }))
    await expect(api('/x')).rejects.toThrow('Something went wrong. Please try again.')
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    await expect(api('/x')).rejects.toMatchObject({ status: 0, message: expect.stringMatching(/couldn't reach the server/) })
  })

  it('signals an expired session on 401', async () => {
    const onUnauthorized = vi.fn()
    window.addEventListener('hr:unauthorized', onUnauthorized)
    fetch.mockResolvedValueOnce(json({ error: 'Please sign in' }, 401))
    await expect(api('/x')).rejects.toMatchObject({ status: 401 })
    expect(onUnauthorized).toHaveBeenCalled()
    window.removeEventListener('hr:unauthorized', onUnauthorized)
  })
})

describe('apiDownload', () => {
  it('saves the file with the name the server gives', async () => {
    const createObjectURL = vi.fn(() => 'blob:1')
    vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() }))
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    fetch.mockResolvedValueOnce(new Response('a,b', { headers: { 'Content-Disposition': 'attachment; filename="cv-bank-2026-10-03.csv"' } }))
    await apiDownload('/api/hr/cv-bank/export', { q: 'x' }, 'fallback.csv')
    const anchor = click.mock.instances[0] as unknown as HTMLAnchorElement
    expect(anchor.download).toBe('cv-bank-2026-10-03.csv')
    fetch.mockResolvedValueOnce(new Response('a,b'))
    await apiDownload('/api/hr/cv-bank/export', {}, 'fallback.csv')
    expect((click.mock.instances[1] as unknown as HTMLAnchorElement).download).toBe('fallback.csv')
    click.mockRestore()
  })
})
