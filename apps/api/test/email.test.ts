import { afterEach, describe, expect, it, vi } from 'vitest'

const sendMail = vi.fn(async () => ({ messageId: 'm1' }))
const transport = { sendMail, verify: vi.fn(async () => true), close: vi.fn() }
vi.mock('nodemailer', () => ({ default: { createTransport: vi.fn(() => transport) } }))

const { sampleEmails } = await import('../src/email/samples.js')
const t = await import('../src/email/templates.js')
const { createMailer, mailConfigFromEnv } = await import('../src/email/mailer.js')
const { escapeHtml } = await import('../src/email/layout.js')

const ctx = { siteUrl: 'https://dekkoisho.com', hrPortalUrl: 'https://dekkoisho.com/hr/admin' }

describe('email templates', () => {
  it('renders every email with a subject, HTML and a plain-text version', () => {
    for (const [name, email] of Object.entries(sampleEmails(ctx.siteUrl))) {
      expect(email.subject, name).toBeTruthy()
      expect(email.html, name).toContain('<!doctype html>')
      expect(email.html, name).toContain('Dekko ISHO')
      expect(email.text.length, name).toBeGreaterThan(40)
      expect(email.text, name).not.toMatch(/<[a-z]/i)
    }
  })

  it('escapes applicant input', () => {
    const email = t.applicationReceived(ctx, {
      applicantName: '<script>alert(1)</script>',
      jobTitle: 'Engineer & Lead',
      department: 'Tech',
      location: 'Dhaka',
      jobType: 'Full-time',
      referenceId: 'DIG-2026-00001',
      submittedAt: 'today',
    })
    expect(email.html).not.toContain('<script>alert')
    expect(email.html).toContain('Engineer &amp; Lead')
    expect(escapeHtml(`"a" <b> & 'c'`)).toBe('&quot;a&quot; &lt;b&gt; &amp; &#39;c&#39;')
    expect(escapeHtml(null)).toBe('')
  })

  it('covers the less common variants', () => {
    const closed = t.circularClosing(ctx, { jobTitle: 'Merchandiser', deadline: 'today', applications: 0, shortlisted: 0, state: 'closed', manageUrl: 'https://x' })
    expect(closed.subject).toMatch(/Merchandiser/)
    const reset = t.passwordReset(ctx, { resetUrl: 'https://x/reset' })
    expect(reset.html).toContain('https://x/reset')
    const contact = t.contactMessage(ctx, { name: 'Ayesha', email: 'a@x.com', phone: '', message: 'Hello\nthere', source: 'footer', receivedAt: 'now' })
    expect(contact.text).toContain('Hello')
    const digest = t.newApplicationsDigest(ctx, { recipientName: undefined, dateLabel: 'today', totalNew: 1, openCirculars: 0, closingSoon: 0, byCircular: [] })
    expect(digest.subject).toMatch(/1/)
  })
})

describe('mailer', () => {
  afterEach(() => sendMail.mockClear())

  it('reads Gmail settings and strips spaces from the app password', () => {
    expect(mailConfigFromEnv({ MAIL_USER: ' hr@x.com ', MAIL_APP_PASSWORD: 'abcd efgh ijkl mnop' })).toEqual({
      user: 'hr@x.com',
      appPassword: 'abcdefghijklmnop',
      fromName: 'Dekko ISHO Group Careers',
      replyTo: undefined,
    })
    expect(() => mailConfigFromEnv({})).toThrow(/MAIL_USER/)
  })

  it('sends through the shared transport', async () => {
    const mailer = createMailer({ user: 'hr@x.com', appPassword: 'p', fromName: 'Careers', replyTo: 'jobs@x.com' })
    await mailer.send(['a@x.com'], { subject: 'Hi', html: '<p>Hi</p>', text: 'Hi' })
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ from: { name: 'Careers', address: 'hr@x.com' }, replyTo: 'jobs@x.com', subject: 'Hi' }))
    await mailer.verify()
    mailer.close()
    expect(transport.close).toHaveBeenCalled()
  })
})
