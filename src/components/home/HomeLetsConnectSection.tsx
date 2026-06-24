import { type FormEvent, useState } from 'react'

import { contactEmail, contactPhone } from '../../data/contact/contactInfo'
import { footerContact } from '../../data/footer/footerContent'
import { FadeIn } from '../ui/FadeIn'
import { SectionLines } from '../ui/SectionDecor'

const CORPORATE_HQ_IMAGE = '/images/contact/corporate-hq.png'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function HomeLetsConnectSection() {
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email-address') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    if (!name || !email || !message) {
      setStatus('error')
      return
    }

    setStatus('submitting')

    try {
      // TODO: wire this to backend API endpoint.
      console.log('homeContactForm', {
        name,
        email,
        phone: String(data.get('phone-number') ?? '').trim(),
        message,
      })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  const corporateHq = footerContact.address

  return (
    <section className="home-contact-section contact-section page-contact-section">
      <div className="page-contact-main section-spacing">
        <div className="container-full">
          <div className="page-contact-grid home-contact-grid">
            <div className="page-contact-left">
              <FadeIn id="home-contact-left-top" delay={100} className="home-contact-left-top">
                <div className="page-contact-hero">
                  <h2 className="page-contact-title">
                    Let&apos;s <span className="page-contact-accent">Connect</span>
                  </h2>
                  <p className="page-contact-description">
                    Reach us directly, whether you want to call, visit our corporate headquarters, email an inquiry, or
                    connect with Dekko ISHO Group on social media.
                  </p>
                </div>

                <div className="page-contact-details home-contact-details">
                  <div className="page-contact-details-col">
                    <div className="page-contact-block">
                      <div className="page-contact-label">// Contact us //</div>
                      <div className="page-contact-lines">
                        <a href={contactPhone.href} className="page-contact-text-link">
                          {contactPhone.label}
                        </a>
                        <a href={contactEmail.href} className="page-contact-text-link">
                          {contactEmail.label}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="page-contact-details-col">
                    <div className="page-contact-block">
                      <div className="page-contact-label">// Find us //</div>
                      <div className="page-contact-locations">
                        <div className="page-contact-location">
                          <div className="page-contact-location-line">{corporateHq}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn id="home-contact-image" delay={200} className="page-contact-visual home-contact-visual">
                <img
                  src={CORPORATE_HQ_IMAGE}
                  loading="lazy"
                  decoding="async"
                  alt="Dekko ISHO Group corporate headquarters"
                  className="page-contact-visual-image"
                />
              </FadeIn>
            </div>

            <div className="page-contact-right home-contact-right">
              <FadeIn id="home-contact-form" delay={200} className="page-contact-form-card w-form">
                <div className="page-contact-form-intro">
                  <h3 className="page-contact-form-title">Start A Conversation</h3>
                  <p className="page-contact-form-description">
                    Get in touch with us with your queries. Our dedicated team will get back to you with answers as soon
                    as possible.
                  </p>
                </div>

                <form
                  id="home-email-form"
                  name="home-email-form"
                  className="page-contact-form"
                  onSubmit={handleSubmit}
                  style={status === 'success' ? { display: 'none' } : undefined}
                  noValidate
                >
                  <div className="page-contact-field">
                    <label htmlFor="home-contact-name" className="page-contact-field-label">
                      Name
                    </label>
                    <input
                      className="page-contact-input w-input"
                      maxLength={256}
                      name="name"
                      placeholder=""
                      type="text"
                      id="home-contact-name"
                      required
                    />
                  </div>

                  <div className="page-contact-field-row">
                    <div className="page-contact-field">
                      <label htmlFor="home-contact-email" className="page-contact-field-label">
                        Email address *
                      </label>
                      <input
                        className="page-contact-input w-input"
                        maxLength={256}
                        name="email-address"
                        placeholder=""
                        type="email"
                        id="home-contact-email"
                        required
                      />
                    </div>
                    <div className="page-contact-field">
                      <label htmlFor="home-contact-phone" className="page-contact-field-label">
                        Phone number
                      </label>
                      <input
                        className="page-contact-input w-input"
                        maxLength={256}
                        name="phone-number"
                        placeholder=""
                        type="tel"
                        id="home-contact-phone"
                      />
                    </div>
                  </div>

                  <div className="page-contact-field">
                    <label htmlFor="home-contact-message" className="page-contact-field-label">
                      Message
                    </label>
                    <textarea
                      placeholder=""
                      maxLength={5000}
                      id="home-contact-message"
                      name="message"
                      className="page-contact-input page-contact-textarea w-input"
                      required
                    />
                  </div>

                  <input
                    type="submit"
                    aria-label="Submit contact form"
                    className="page-contact-submit w-button"
                    value={status === 'submitting' ? 'Please wait...' : 'Submit'}
                    disabled={status === 'submitting'}
                  />
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
        </div>
      </div>
      <SectionLines border="grey" />
    </section>
  )
}
