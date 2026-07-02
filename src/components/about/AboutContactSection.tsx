import { type FormEvent, useState } from 'react'

import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function AboutContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name || !email || !message) {
      setStatus('error')
      return
    }

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
          <PreSectionTitle title="Get in touch" variant="bg-dark" />
          <h2 className="section-title title-center text-white about-contact-title">
            Have a question in <span className="text-linear-gradient">mind?</span>
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
                <input
                  className="form-input bg-change w-input"
                  maxLength={256}
                  name="name"
                  placeholder="Full Name"
                  type="text"
                  id="about-contact-name"
                  required
                />
                <input
                  className="form-input bg-change w-input"
                  maxLength={256}
                  name="email"
                  placeholder="Email"
                  type="email"
                  id="about-contact-email"
                  required
                />
                <input
                  type="submit"
                  aria-label="Send contact form"
                  className="form-submit-button bg-change w-button about-contact-submit"
                  value={status === 'submitting' ? 'Please wait...' : 'Send'}
                  disabled={status === 'submitting'}
                />
              </div>
              <div className="cta-form-textarea about-contact-form-right">
                <textarea
                  placeholder="Message"
                  maxLength={5000}
                  id="about-contact-message"
                  name="message"
                  className="form-input bg-change form-textarea w-input about-contact-textarea"
                  required
                />
              </div>
            </form>

            <div
              className="success-message w-form-done"
              style={status === 'success' ? { display: 'block' } : undefined}
            >
              <div>Thank you! Your submission has been received!</div>
            </div>
            <div
              className="error-message w-form-fail"
              style={status === 'error' ? { display: 'block' } : undefined}
            >
              <div>Oops! Something went wrong while submitting the form.</div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
