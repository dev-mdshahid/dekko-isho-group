import { type FormEvent, useState } from 'react'

import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

type FormState = {
  name: string
  contact: string
  message: string
}

const initialFormState: FormState = {
  name: '',
  contact: '',
  message: '',
}

const HQ_ADDRESS = [
  'The Forum',
  "West Tower, Level 16-19, 187, 188/'B, Tejgaon Gulshan Link Road,",
  'Dhaka-1209, Bangladesh',
]

export function ContactUsSection() {
  const [form, setForm] = useState<FormState>(initialFormState)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
      setErrorMessage('Please fill in all fields.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    // TODO: wire this to backend API endpoint.
    console.log('homeContactForm', form)

    setStatus('success')
    setForm(initialFormState)
  }

  return (
    <section className="home-contact-section" aria-label="Contact us">
      <div className="home-contact-main">
        <div className="home-contact-container">
          <div className="home-contact-grid">
            <FadeIn id="home-contact-left" className="home-contact-left">
              <PreSectionTitle title="Get in touch with us" />
              <h2 className="home-contact-title">
                Let&apos;s <span className="home-contact-accent">Connect</span>
              </h2>
              <p className="home-contact-description">
                Get in touch with us with your queries or visit our premises.
              </p>
            </FadeIn>

            <FadeIn id="home-contact-right" className="home-contact-right">
              <div className="home-contact-info">
                <h3 className="home-contact-info-title">Corporate HQ, Dhaka</h3>
                <address className="home-contact-address">
                  {HQ_ADDRESS.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                  <a href="tel:+8809606101010" className="home-contact-phone">
                    +8809606101010
                  </a>
                </address>
              </div>

              <form className="home-contact-form" onSubmit={handleSubmit} noValidate>
                <div className="home-contact-field">
                  <label htmlFor="home-contact-name" className="home-contact-label">
                    Your name
                  </label>
                  <input
                    id="home-contact-name"
                    type="text"
                    name="name"
                    className="home-contact-input"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    autoComplete="name"
                  />
                </div>

                <div className="home-contact-field">
                  <label htmlFor="home-contact-contact" className="home-contact-label">
                    Phone / Email
                  </label>
                  <input
                    id="home-contact-contact"
                    type="text"
                    name="contact"
                    className="home-contact-input"
                    placeholder="20 111 2345 6789"
                    value={form.contact}
                    onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
                    autoComplete="email tel"
                  />
                </div>

                <div className="home-contact-field">
                  <label htmlFor="home-contact-message" className="home-contact-label">
                    Message
                  </label>
                  <textarea
                    id="home-contact-message"
                    name="message"
                    className="home-contact-input home-contact-textarea"
                    placeholder="Type here"
                    rows={4}
                    value={form.message}
                    onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  />
                </div>

                {status === 'error' && errorMessage ? (
                  <p className="home-contact-form-message home-contact-form-message--error" role="alert">
                    {errorMessage}
                  </p>
                ) : null}

                {status === 'success' ? (
                  <p className="home-contact-form-message home-contact-form-message--success" role="status">
                    Message sent successfully.
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="home-contact-submit"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
