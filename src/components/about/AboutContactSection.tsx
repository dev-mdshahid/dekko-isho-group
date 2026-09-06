import { type FormEvent, useState } from 'react'

import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'
type FieldName = 'name' | 'email' | 'message'
type FieldErrors = Partial<Record<FieldName, string>>

export function AboutContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const clearFieldError = (field: FieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) return current

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const nextErrors: FieldErrors = {}

    if (!name) nextErrors.name = 'Please enter your full name.'
    if (!email) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }
    if (!message) nextErrors.message = 'Please enter a message.'

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors)
      setStatus('idle')
      return
    }

    setFieldErrors({})
    setStatus('submitting')

    try {
      // TODO: wire this to backend API endpoint.
      console.log('aboutContactForm', { name, email, message })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="cta-section about-contact-section about-contact-section--about">
      <div className="cta-info">
        <FadeIn id="about-contact-header" className="section-title-center _02 about-contact-header">
          <PreSectionTitle title="Get in Touch" variant="bg-dark" />
          <h2 className="section-title title-center text-white about-contact-title">
            Connect with Our <span className="text-linear-gradient">Team</span>
          </h2>
        </FadeIn>

        <div className="cta-form-info">
          <FadeIn id="about-contact-form" className="form-wrap w-form about-contact-form-wrap">
            <form
              id="about-email-form"
              name="about-email-form"
              className="cta-form about-contact-form"
              onSubmit={handleSubmit}
              style={status === 'success' ? { display: 'none' } : undefined}
              noValidate
            >
              <div className="cta-form-input about-contact-form-left">
                <div className="about-contact-field" id="about-contact-name-field">
                  <label className="about-contact-label" htmlFor="about-contact-name">
                    Full Name
                  </label>
                  <input
                    className="form-input bg-change w-input about-contact-input"
                    maxLength={256}
                    name="name"
                    placeholder="e.g. Alex Morgan"
                    type="text"
                    id="about-contact-name"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'about-contact-name-error' : undefined}
                    onChange={() => clearFieldError('name')}
                    required
                  />
                  {fieldErrors.name && (
                    <span className="about-contact-field-error" id="about-contact-name-error">
                      {fieldErrors.name}
                    </span>
                  )}
                </div>

                <div className="about-contact-field" id="about-contact-email-field">
                  <label className="about-contact-label" htmlFor="about-contact-email">
                    Email
                  </label>
                  <input
                    className="form-input bg-change w-input about-contact-input"
                    maxLength={256}
                    name="email"
                    placeholder="name@company.com"
                    type="email"
                    id="about-contact-email"
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'about-contact-email-error' : undefined}
                    onChange={() => clearFieldError('email')}
                    required
                  />
                  {fieldErrors.email && (
                    <span className="about-contact-field-error" id="about-contact-email-error">
                      {fieldErrors.email}
                    </span>
                  )}
                </div>
                <input
                  type="submit"
                  aria-label="Send contact form"
                  className="form-submit-button bg-change w-button about-contact-submit"
                  value={status === 'submitting' ? 'Please wait...' : 'Send'}
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="cta-form-textarea about-contact-form-right">
                <div className="about-contact-field about-contact-message-field">
                  <label className="about-contact-label" htmlFor="about-contact-message">
                    Message
                  </label>
                  <textarea
                    placeholder="Tell us how we can help"
                    maxLength={5000}
                    id="about-contact-message"
                    name="message"
                    className="form-input bg-change form-textarea w-input about-contact-textarea"
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={fieldErrors.message ? 'about-contact-message-error' : undefined}
                    onChange={() => clearFieldError('message')}
                    required
                  />
                  {fieldErrors.message && (
                    <span className="about-contact-field-error" id="about-contact-message-error">
                      {fieldErrors.message}
                    </span>
                  )}
                </div>
              </div>
            </form>

            <div
              className="success-message w-form-done"
              style={status === 'success' ? { display: 'block' } : undefined}
              role="status"
            >
              <div>Thank you! Your submission has been received!</div>
            </div>
            <div
              className="error-message w-form-fail"
              style={status === 'error' ? { display: 'block' } : undefined}
              role="alert"
            >
              <div>Oops! Something went wrong while submitting the form.</div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
