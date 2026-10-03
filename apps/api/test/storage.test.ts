import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { rm } from 'node:fs/promises'
import { B2Storage, joinKey, storage, storageKeys } from '../src/lib/storage.js'

const cfg = { keyId: 'kid', applicationKey: 'secret', bucketId: 'bucket-1', bucketName: 'dekko', prefix: 'hr/' }

type Call = { url: string; init?: RequestInit }
let calls: Call[]
let replies: Array<(call: Call) => Response>

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const authReply = () => json({ authorizationToken: 'tok', apiInfo: { storageApi: { apiUrl: 'https://api.b2', downloadUrl: 'https://dl.b2' } } })

beforeEach(() => {
  calls = []
  replies = []
  vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
    const call = { url: String(url), init }
    calls.push(call)
    const next = replies.shift()
    if (!next) throw new Error(`unexpected fetch ${url}`)
    return next(call)
  })
})

afterEach(() => vi.unstubAllGlobals())

describe('Backblaze storage', () => {
  it('uploads with a checksum and the folder prefix', async () => {
    replies.push(authReply, () => json({ uploadUrl: 'https://up.b2/x', authorizationToken: 'up-tok' }), () => json({ fileId: 'f1' }))
    const b2 = new B2Storage(cfg)
    const obj = await b2.put('cv/My CV.pdf', Buffer.from('pdf'), 'application/pdf')
    expect(obj).toEqual({ key: 'cv/My CV.pdf', fileId: 'f1', contentType: 'application/pdf', size: 3 })
    expect(calls[0].url).toContain('b2_authorize_account')
    expect(calls[1].url).toBe('https://api.b2/b2api/v3/b2_get_upload_url')
    const headers = calls[2].init!.headers as Record<string, string>
    expect(headers['X-Bz-File-Name']).toBe('hr/cv/My%20CV.pdf')
    expect(headers['X-Bz-Content-Sha1']).toHaveLength(40)
  })

  it('retries busy uploads and gives up on hard errors', async () => {
    replies.push(
      authReply,
      () => json({ uploadUrl: 'u', authorizationToken: 't' }),
      () => new Response('busy', { status: 503 }),
      () => json({ uploadUrl: 'u', authorizationToken: 't' }),
      () => json({ fileId: 'f2' }),
    )
    const b2 = new B2Storage(cfg)
    expect((await b2.put('a.pdf', Buffer.from('x'), 'application/pdf')).fileId).toBe('f2')

    replies.push(() => json({ uploadUrl: 'u', authorizationToken: 't' }), () => new Response('nope', { status: 400 }))
    await expect(b2.put('a.pdf', Buffer.from('x'), 'application/pdf')).rejects.toThrow(/upload failed \(400\)/)
  })

  it('re-authorises once when the token expires', async () => {
    replies.push(authReply, () => new Response('expired', { status: 401 }), authReply, () => json({ authorizationToken: 'dl' }))
    const url = await new B2Storage(cfg).signedUrl('cv/a.pdf', 99999, 'Rahim CV.pdf')
    expect(url.startsWith('https://dl.b2/file/dekko/hr/cv/a.pdf?Authorization=dl')).toBe(true)
    expect(url).toContain('b2ContentDisposition=')
    const body = JSON.parse(String(calls[3].init!.body))
    expect(body.validDurationInSeconds).toBe(3600)
  })

  it('reports failed sign-in and failed calls', async () => {
    replies.push(() => new Response('bad key', { status: 401 }))
    await expect(new B2Storage(cfg).get('a')).rejects.toThrow(/authorize failed/)
    replies.push(authReply, () => new Response('missing', { status: 404 }))
    await expect(new B2Storage(cfg).get('a')).rejects.toThrow(/download failed \(404\)/)
  })

  it('downloads, moves and deletes files', async () => {
    const b2 = new B2Storage(cfg)
    replies.push(authReply, () => new Response('data', { headers: { 'content-type': 'application/pdf' } }))
    const file = await b2.get('cv/a.pdf')
    expect(file.body.toString()).toBe('data')
    expect(file.contentType).toBe('application/pdf')

    replies.push(() => json({ fileId: 'new' }), () => new Response('gone', { status: 500 }))
    const moved = await b2.move({ key: 'cv/a.pdf', fileId: 'old', contentType: 'application/pdf', size: 4 }, 'cv/b.pdf')
    expect(moved).toMatchObject({ key: 'cv/b.pdf', fileId: 'new' })
    await expect(b2.move({ key: 'x', fileId: null, contentType: '', size: 0 }, 'y')).rejects.toThrow(/fileId/)

    replies.push(() => json({}))
    await b2.delete('cv/b.pdf', 'new')
    replies.push(
      () => json({ files: [{ fileId: 'v1', fileName: 'hr/cv/c.pdf' }, { fileId: 'v2', fileName: 'hr/cv/c.pdf.bak' }] }),
      () => json({}),
    )
    await b2.delete('cv/c.pdf')
    expect(JSON.parse(String(calls.at(-1)!.init!.body))).toEqual({ fileName: 'hr/cv/c.pdf', fileId: 'v1' })
  })

  it('refuses unsafe keys', async () => {
    await expect(new B2Storage(cfg).put('../etc/passwd', Buffer.from('x'), 'text/plain')).rejects.toThrow(/Unsafe/)
  })
})

describe('local storage', () => {
  afterEach(() => rm('.storage-test', { recursive: true, force: true }))

  it('stores, reads, moves and deletes files on disk', async () => {
    const s = storage()
    expect(s.driver).toBe('local')
    await s.put('tmp/a.txt', Buffer.from('hello'), 'text/plain')
    expect((await s.get('tmp/a.txt')).contentType).toBe('text/plain')
    const moved = await s.move({ key: 'tmp/a.txt', fileId: null, contentType: 'text/plain', size: 5 }, 'tmp/b.txt')
    expect((await s.get(moved.key)).body.toString()).toBe('hello')
    await s.delete('tmp/b.txt')
    await expect(s.get('tmp/b.txt')).rejects.toThrow()
    await expect(s.put('/abs', Buffer.from('x'), 'text/plain')).rejects.toThrow(/Unsafe/)
    expect(await s.signedUrl('tmp/b.txt', 60)).toContain('/api/files/')
  })

  it('builds predictable keys', () => {
    const d = new Date(2026, 0, 5)
    expect(storageKeys.pendingCv('u1', 'pdf', d)).toBe('cv/pending/2026/01/u1.pdf')
    expect(storageKeys.pendingAttachment('u1', 'png', d)).toBe('attachments/pending/2026/01/u1.png')
    expect(storageKeys.candidateCv('c', 'a', 'pdf')).toBe('cv/candidates/c/a/cv.pdf')
    expect(storageKeys.attachment('c', 'a', 'portfolio', 'x.pdf')).toBe('attachments/c/a/portfolio/x.pdf')
    expect(storageKeys.circularImage('j', 'i', 'png')).toBe('circulars/j/images/i.png')
    expect(joinKey('a', 'b', 'c.txt')).toBe('a/b/c.txt')
  })
})
