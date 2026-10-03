import { afterEach, describe, expect, it, vi } from 'vitest'
import { config } from '../src/config.js'
import { verifyTurnstile } from '../src/lib/turnstile.js'

const original = config.turnstile.secret

afterEach(() => {
  config.turnstile.secret = original
  vi.unstubAllGlobals()
})

const reply = (body: unknown) => vi.fn(async () => new Response(JSON.stringify(body)))

describe('turnstile', () => {
  it('is skipped when no secret is configured', async () => {
    config.turnstile.secret = ''
    await expect(verifyTurnstile(undefined, undefined)).resolves.toBeUndefined()
  })

  it('requires a token once enabled', async () => {
    config.turnstile.secret = 'secret'
    await expect(verifyTurnstile(undefined, '1.2.3.4')).rejects.toMatchObject({ status: 400 })
  })

  it('accepts a valid token and sends the visitor IP', async () => {
    config.turnstile.secret = 'secret'
    const fetch = reply({ success: true })
    vi.stubGlobal('fetch', fetch)
    await verifyTurnstile('tok', '1.2.3.4')
    const body = (fetch.mock.calls[0] as unknown as [string, { body: URLSearchParams }])[1].body
    expect(body.get('remoteip')).toBe('1.2.3.4')
    expect(body.get('response')).toBe('tok')
  })

  it('rejects failed checks and reports outages', async () => {
    config.turnstile.secret = 'secret'
    vi.stubGlobal('fetch', reply({ success: false, 'error-codes': ['invalid-input-response'] }))
    await expect(verifyTurnstile('bad', undefined)).rejects.toMatchObject({ status: 400 })
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('network down'))))
    await expect(verifyTurnstile('tok', undefined)).rejects.toMatchObject({ status: 503 })
  })
})
