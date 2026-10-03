import { afterEach, describe, expect, it, vi } from 'vitest'

const send = vi.fn()
vi.mock('../src/email/mailer.js', () => ({
  createMailer: vi.fn(() => ({ send })),
  mailConfigFromEnv: vi.fn(() => ({ user: 'hr@x.com', appPassword: 'p', fromName: 'Careers' })),
}))

const { config } = await import('../src/config.js')
const { sendMail, mailCtx } = await import('../src/services/mail.js')
const email = { subject: 'Hi', html: '<p>Hi</p>', text: 'Hi' }

afterEach(() => {
  config.mail.enabled = false
  send.mockReset()
})

describe('sendMail', () => {
  it('skips sending while mail is turned off', () => {
    sendMail('a@x.com', email, 'test')
    expect(send).not.toHaveBeenCalled()
  })

  it('sends in the background and never throws on failure', async () => {
    config.mail.enabled = true
    send.mockResolvedValueOnce({ messageId: '1' }).mockRejectedValueOnce(new Error('smtp down'))
    sendMail('a@x.com', email, 'test')
    sendMail('b@x.com', email, 'test')
    await new Promise((r) => setTimeout(r, 10))
    expect(send).toHaveBeenCalledTimes(2)
  })

  it('exposes the links used in emails', () => {
    expect(mailCtx()).toEqual({ siteUrl: config.siteUrl, hrPortalUrl: config.hrPortalUrl })
  })
})
