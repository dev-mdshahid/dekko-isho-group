import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PublicJob } from '@dekko-isho/shared'

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
const NOW = Date.parse('2026-10-03T12:00:00Z')
const daysAgo = (d: number) => new Date(NOW - d * 86_400_000).toISOString()

let api: typeof import('./careersApi')

beforeEach(async () => {
  vi.resetModules()
  api = await import('./careersApi')
})
afterEach(() => vi.unstubAllGlobals())

describe('fetching roles', () => {
  it('caches the roles list for a minute and retries after a failure', async () => {
    const fetch = vi.fn(async () => json({ jobs: [{ id: '1' }] }))
    vi.stubGlobal('fetch', fetch)
    expect(await api.fetchJobs()).toEqual([{ id: '1' }])
    await api.fetchJobs()
    expect(fetch).toHaveBeenCalledTimes(1)

    vi.resetModules()
    api = await import('./careersApi')
    vi.stubGlobal('fetch', vi.fn(async () => json({ error: 'down' }, 500)))
    await expect(api.fetchJobs()).rejects.toThrow('down')
    vi.stubGlobal('fetch', vi.fn(async () => json({ jobs: [] })))
    expect(await api.fetchJobs()).toEqual([])
  })

  it('shares filter settings and retries them after a failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json({ error: 'down' }, 500)))
    await expect(api.fetchMeta()).rejects.toThrow()
    const fetch = vi.fn(async () => json({ departments: [] }))
    vi.stubGlobal('fetch', fetch)
    await api.fetchMeta()
    await api.fetchMeta()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('requests a role, the talent pool and submits applications', async () => {
    const fetch = vi.fn(async (_url: string) => json({ ok: 1 }))
    vi.stubGlobal('fetch', fetch)
    await api.fetchJob('senior merchandiser')
    expect(fetch.mock.calls[0]![0]).toBe('http://api.test/api/public/jobs/senior%20merchandiser')
    await api.fetchTalentPool()
    expect(fetch.mock.calls[1]![0]).toBe('http://api.test/api/public/talent-pool')
    await api.submitApplication({ jobId: 'j', formVersionId: 'v', uploadId: 'u', answers: {} })
    expect(fetch.mock.calls[2]![0]).toBe('http://api.test/api/public/applications')
  })

  it('uploads CVs and attachments as form data', () => {
    const sent: FormData[] = []
    vi.stubGlobal(
      'XMLHttpRequest',
      class {
        upload = {}
        open() {}
        setRequestHeader() {}
        send(data: FormData) {
          sent.push(data)
        }
        abort() {}
      },
    )
    const file = new File(['x'], 'cv.pdf')
    api.uploadCv(file, 'job-1')
    api.uploadAttachment(file, 'job-1')
    expect(sent.map((d) => [d.get('jobId'), (d.get('file') as File).name])).toEqual([
      ['job-1', 'cv.pdf'],
      ['job-1', 'cv.pdf'],
    ])
  })
})

describe('display helpers', () => {
  it('describes when a role was posted', () => {
    expect(api.postedAgo(null)).toBe('')
    expect(api.postedAgo(daysAgo(0), NOW)).toBe('Posted today')
    expect(api.postedAgo(daysAgo(1), NOW)).toBe('Posted yesterday')
    expect(api.postedAgo(daysAgo(4), NOW)).toBe('Posted 4 days ago')
    expect(api.postedAgo(daysAgo(10), NOW)).toBe('Posted last week')
    expect(api.postedAgo(daysAgo(21), NOW)).toBe('Posted 3 weeks ago')
    expect(api.postedAgo(daysAgo(40), NOW)).toBe('Posted last month')
    expect(api.postedAgo(daysAgo(95), NOW)).toBe('Posted 3 months ago')
  })

  it('flags new and closing-soon roles', () => {
    expect(api.isNew(daysAgo(2), NOW)).toBe(true)
    expect(api.isNew(daysAgo(9), NOW)).toBe(false)
    expect(api.isNew(null, NOW)).toBe(false)
    expect(api.closingSoon(daysAgo(-2), NOW)).toBe(true)
    expect(api.closingSoon(daysAgo(-9), NOW)).toBe(false)
    expect(api.closingSoon(daysAgo(1), NOW)).toBe(false)
    expect(api.closingSoon(null, NOW)).toBe(false)
  })

  it('formats deadlines, locations, extra details and share links', () => {
    expect(api.formatDeadline('2026-10-20T00:00:00Z')).toBe('20 Oct 2026')
    expect(api.formatDeadline(null)).toBe('')
    expect(api.locationsLabel({ locations: [{ name: 'Dhaka' }, { name: 'Gazipur' }] } as PublicJob)).toBe('Dhaka, Gazipur')
    expect(api.customFieldText(['Day', 'Night'])).toBe('Day, Night')
    expect(api.customFieldText(true)).toBe('Yes')
    expect(api.customFieldText(false)).toBe('No')
    expect(api.customFieldText(3)).toBe('3')
    expect(api.shareUrl('engineer')).toMatch(/\/share\/jobs\/engineer$/)
  })
})
