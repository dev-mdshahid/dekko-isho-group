import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitContactForm, submitSubscribeForm, validateContactForm, validateSubscribeForm } from './forms'

const ok = () => vi.fn(async () => new Response('{"ok":true}', { status: 200 }))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
  vi.doUnmock('./turnstile')
})

describe('contact form', () => {
  it('lists what is missing', () => {
    expect(validateContactForm({ name: ' ', email: 'nope', message: '' })).toEqual(['Name is required.', 'Valid email is required.', 'Message is required.'])
    expect(validateContactForm({ name: 'Ayesha', email: 'a@x.com', message: 'Hi' })).toEqual([])
  })

  it('sends the message with the inquiry type', async () => {
    const fetch = ok()
    vi.stubGlobal('fetch', fetch)
    const res = await submitContactForm({ name: ' Ayesha ', email: 'a@x.com ', inquiry: 'Partnership', message: 'Hello', source: 'home' })
    expect(res).toEqual({ ok: true })
    const body = JSON.parse((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body as string)
    expect(body).toMatchObject({ name: 'Ayesha', email: 'a@x.com', phone: '', source: 'home', message: 'Inquiry: Partnership\n\nHello' })
  })

  it('does not call the API when the form is invalid', async () => {
    const fetch = ok()
    vi.stubGlobal('fetch', fetch)
    expect(await submitContactForm({ name: '', email: '', message: '' })).toMatchObject({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('shows the server message when sending fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{"error":"Please try again later"}', { status: 503 })))
    expect(await submitContactForm({ name: 'A', email: 'a@x.com', message: 'Hi' })).toEqual({ ok: false, errors: ['Please try again later'] })
  })
})

describe('newsletter form', () => {
  it('validates and subscribes', async () => {
    expect(validateSubscribeForm({ email: 'bad' })).toEqual(['Valid email is required.'])
    vi.stubGlobal('fetch', ok())
    expect(await submitSubscribeForm({ email: 'a@x.com' })).toEqual({ ok: true })
    expect(await submitSubscribeForm({ email: 'bad' })).toMatchObject({ ok: false })
    vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new Error('offline'))))
    expect(await submitSubscribeForm({ email: 'a@x.com' })).toMatchObject({ ok: false, errors: [expect.stringMatching(/could not reach/)] })
  })
})

describe('with the security check enabled', () => {
  it('waits for the check before sending', async () => {
    vi.doMock('./turnstile', () => ({ TURNSTILE_SITE_KEY: 'site-key', TURNSTILE_PENDING_MESSAGE: 'Please wait' }))
    const forms = await import('./forms')
    const fetch = ok()
    vi.stubGlobal('fetch', fetch)
    expect(await forms.submitSubscribeForm({ email: 'a@x.com' })).toEqual({ ok: false, errors: ['Please wait'] })
    expect(await forms.submitContactForm({ name: 'A', email: 'a@x.com', message: 'Hi' })).toEqual({ ok: false, errors: ['Please wait'] })
    expect(fetch).not.toHaveBeenCalled()
    expect(await forms.submitSubscribeForm({ email: 'a@x.com', turnstileToken: 'tok' })).toEqual({ ok: true })
    expect(JSON.parse((fetch.mock.calls[0] as unknown as [string, RequestInit])[1].body as string).turnstileToken).toBe('tok')
  })
})
