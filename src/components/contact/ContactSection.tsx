import { type FormEvent, useState } from 'react'

import {
  contactEmail,
  contactPhone,
  officeLocations,
  socialLinks,
} from '../../data/contact/contactInfo'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function ContactSection() {
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
      console.log('contactForm', {
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

  return (
    <section className="contact-section page-contact-section">
      <div className="page-contact-main section-spacing">
        <div className="container-full">
          <div className="page-contact-grid">
            <div className="page-contact-left">
              <FadeIn id="de00b61c-1ece-35fa-f76b-0f658df5c5c0" delay={100} className="page-contact-hero">
                <h1 className="page-contact-title">
                  Let&apos;s <span className="page-contact-accent">Connect</span>
                </h1>
                <p className="page-contact-description">
                  Reach us directly, whether you want to call, visit our corporate headquarters, email an inquiry, or
                  connect with Dekko ISHO Group on social media.
                </p>
              </FadeIn>

              <FadeIn id="51462de8-daa5-0e47-b122-e655531d26e6" delay={150} className="page-contact-details">
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
                  <div className="page-contact-block">
                    <div className="page-contact-label">// Socials //</div>
                    <div className="page-contact-lines">
                      {socialLinks.map((social) => (
                        <a
                          key={social.href}
                          href={social.href}
                          className="page-contact-text-link"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {social.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="page-contact-details-col">
                  <div className="page-contact-block">
                    <div className="page-contact-label">// Find us //</div>
                    <div className="page-contact-locations">
                      {officeLocations.map((office) => (
                        <div key={office.name} className="page-contact-location">
                          <div className="page-contact-location-name">{office.name}</div>
                          {office.lines.map((line) => (
                            <div key={line} className="page-contact-location-line">
                              {line}
                            </div>
                          ))}
                          {office.phone ? (
                            <a href={office.phone.href} className="page-contact-text-link">
                              {office.phone.label}
                            </a>
                          ) : null}
                          <a
                            href={office.mapsUrl}
                            className="page-contact-maps-link"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open in Maps
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="page-contact-right">
              <FadeIn id="857de6dc-794f-f6cb-7a70-22bab7c6291d" delay={200} className="page-contact-form-card w-form">
                <div className="page-contact-form-intro">
                  <h2 className="page-contact-form-title">Start A Conversation</h2>
                  <p className="page-contact-form-description">
                    Get in touch with us with your queries. Our dedicated team will get back to you with answers as soon
                    as possible.
                  </p>
                </div>

                <form
                  id="email-form"
                  name="email-form"
                  data-name="Email Form"
                  method="get"
                  className="page-contact-form"
                  data-wf-page-id="6a26a196936d1b3aae320d4c"
                  data-wf-element-id="857de6dc-794f-f6cb-7a70-22bab7c6291e"
                  onSubmit={handleSubmit}
                  style={status === 'success' ? { display: 'none' } : undefined}
                  noValidate
                >
                  <img
                    src={legacyImage('shadow_1.png')}
                    loading="lazy"
                    sizes="(max-width: 1071px) 100vw, 1071px"
                    srcSet={`${legacyImage('shadow_1-p-500.png')} 500w, ${legacyImage('shadow_1-p-800.png')} 800w, ${legacyImage('shadow_1.png')} 1071w`}
                    alt="Contact Form Shadow"
                    className="contact-form-shadow"
                  />

                  <div className="page-contact-field">
                    <label htmlFor="contact-name" className="page-contact-field-label">
                      Name
                    </label>
                    <input
                      className="page-contact-input w-input"
                      maxLength={256}
                      name="name"
                      data-name="name"
                      placeholder=""
                      type="text"
                      id="contact-name"
                      required
                    />
                  </div>

                  <div className="page-contact-field-row">
                    <div className="page-contact-field">
                      <label htmlFor="email-address" className="page-contact-field-label">
                        Email address *
                      </label>
                      <input
                        className="page-contact-input w-input"
                        maxLength={256}
                        name="email-address"
                        data-name="email address"
                        placeholder=""
                        type="email"
                        id="email-address"
                        required
                      />
                    </div>
                    <div className="page-contact-field">
                      <label htmlFor="phone-number" className="page-contact-field-label">
                        Phone number
                      </label>
                      <input
                        className="page-contact-input w-input"
                        maxLength={256}
                        name="phone-number"
                        data-name="phone number"
                        placeholder=""
                        type="tel"
                        id="phone-number"
                      />
                    </div>
                  </div>

                  <div className="page-contact-field">
                    <label htmlFor="message" className="page-contact-field-label">
                      Message
                    </label>
                    <textarea
                      placeholder=""
                      maxLength={5000}
                      id="message"
                      name="message"
                      data-name="message"
                      className="page-contact-input page-contact-textarea w-input"
                      required
                    />
                  </div>

                  <input
                    type="submit"
                    data-wait="Please wait..."
                    aria-label="button"
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
      
      {/* <ContactMarquee /> */}
      {/* <SectionLines border="grey" /> */}
      {/* <NoiseOverlay /> */}
    </section>
  )
}
