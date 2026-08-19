import "./contact.css"
import { type CSSProperties, type FormEvent, useState } from 'react'

import {
  contactEmail,
  contactPhone,
  officeLocations,
  socialLinks,
} from '../../data/contact/contactInfo'
import { legacyImage } from '../../lib/assets'
import { navSocialBrands } from '../layout/NavSocialCycle'
import { FadeIn } from '../ui/FadeIn'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const contactSocialBrands = new Map(
  navSocialBrands.map((brand) => [brand.href, brand]),
)

export function ContactSection() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const primaryOffice = officeLocations[0]

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email-address') ?? '').trim()
    const phone = String(data.get('phone-number') ?? '').trim()
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
        phone,
        message,
      })

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="contact-section page-contact-section page-contact-section--modern">
      <div className="page-contact-main section-spacing">
        <div className="container-full">
          <div className="page-contact-grid">
            <div className="page-contact-left">
              <FadeIn
                id="de00b61c-1ece-35fa-f76b-0f658df5c5c0"
                delay={100}
                className="page-contact-hero"
              >
                <h1 className="page-contact-title">
                  Let's{' '}
                  <span
                    style={{
                      color: '#2595D5',
                    }}
                  >
                    Connect
                  </span>
                </h1>

                <p className="page-contact-description">
                  Whether you have a business inquiry,
                  partnership opportunity, or general question,
                  our team is here to help. Reach out through
                  your preferred channel.
                </p>
              </FadeIn>

              <FadeIn
                id="51462de8-daa5-0e47-b122-e655531d26e6"
                delay={150}
                className="page-contact-details"
              >
                <div className="page-contact-details-col">
                  <div className="page-contact-block">
                    <div className="page-contact-label">
                      Call Center
                    </div>

                    <div className="page-contact-lines">
                      <a
                        href={contactPhone.href}
                        className="page-contact-text-link"
                      >
                        {contactPhone.label}
                      </a>
                    </div>
                  </div>

                  <div className="page-contact-block">
                    <div className="page-contact-label">
                      Email
                    </div>

                    <div className="page-contact-lines">
                      <a
                        href={contactEmail.href}
                        className="page-contact-text-link"
                      >
                        {contactEmail.label}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="page-contact-details-col">
                  <div className="page-contact-block">
                    <div className="page-contact-label">
                      Our Location
                    </div>

                    {primaryOffice ? (
                      <div className="page-contact-location">
                        <a
                          href={primaryOffice.mapsUrl}
                          className="page-contact-location-name"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {primaryOffice.name}
                        </a>

                        {primaryOffice.lines.map((line) => (
                          <div
                            key={line}
                            className="page-contact-location-line"
                          >
                            {line}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="page-contact-block">
                    <div className="page-contact-label">
                      Social network
                    </div>

                    <div
                      className="page-contact-socials"
                      aria-label="Social network"
                    >
                      {socialLinks.map((social) => {
                        const brand =
                          contactSocialBrands.get(
                            social.href,
                          )

                        return (
                          <a
                            key={social.href}
                            href={social.href}
                            className="page-contact-social-link"
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.label}
                            style={
                              brand
                                ? ({
                                  '--page-contact-social-brand':
                                    brand.brandColor,
                                } as CSSProperties)
                                : undefined
                            }
                          >
                            {brand ? (
                              <span
                                className="page-contact-social-icon"
                                aria-hidden="true"
                              >
                                {brand.icon}
                              </span>
                            ) : (
                              social.label
                            )}
                          </a>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            <div className="page-contact-right">
              <FadeIn
                id="857de6dc-794f-f6cb-7a70-22bab7c6291d"
                delay={200}
                className="page-contact-form-card w-form"
              >
                <div className="page-contact-form-intro">
                  <p className="page-contact-form-description">
                    Define your goals and identify areas
                    where Dekko Isho can add value to your
                    business.
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
                  style={
                    status === 'success'
                      ? { display: 'none' }
                      : undefined
                  }
                  noValidate
                >
                  <div className="page-contact-field">
                    <label
                      htmlFor="contact-name"
                      className="page-contact-field-label"
                    >
                      Full name
                    </label>

                    <input
                      className="page-contact-input w-input"
                      maxLength={256}
                      name="name"
                      data-name="name"
                      placeholder="Full name"
                      type="text"
                      id="contact-name"
                      required
                    />
                  </div>

                  {/* CHANGED:
                                                          Email and Phone Number are now
                                                          placed in the same row. */}
                  <div className="page-contact-field-row">
                    <div className="page-contact-field">
                      <label
                        htmlFor="email-address"
                        className="page-contact-field-label"
                      >
                        Email
                      </label>

                      <input
                        className="page-contact-input w-input"
                        maxLength={256}
                        name="email-address"
                        data-name="email address"
                        placeholder="Email"
                        type="email"
                        id="email-address"
                        required
                      />
                    </div>

                    <div className="page-contact-field">
                      <label
                        htmlFor="phone-number"
                        className="page-contact-field-label"
                      >
                        Phone Number
                      </label>

                      <input
                        className="page-contact-input w-input"
                        maxLength={256}
                        name="phone-number"
                        data-name="phone number"
                        placeholder="Phone Number"
                        type="tel"
                        id="phone-number"
                      />
                    </div>
                  </div>

                  <div className="page-contact-field">
                    <label
                      htmlFor="message"
                      className="page-contact-field-label"
                    >
                      Message
                    </label>

                    <textarea
                      placeholder="Message"
                      maxLength={5000}
                      id="message"
                      name="message"
                      data-name="message"
                      className="page-contact-input page-contact-textarea w-input"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    data-wait="Please wait..."
                    className="primary-button w-inline-block"
                    disabled={status === 'submitting'}
                    style={{
                      width: 'fit-content',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <div className="button-primary-inner">
                      <div className="button-text-wrap">
                        <div className="button-text-inner">
                          <div className="button-text">
                            {status === 'submitting'
                              ? 'Please wait...'
                              : 'Send a message'}
                          </div>

                          <div className="button-hover-text">
                            {status === 'submitting'
                              ? 'Please wait...'
                              : 'Send a message'}
                          </div>
                        </div>
                      </div>

                      <div className="button-icon-bg">
                        <img
                          src={legacyImage(
                            'button-icon.svg',
                          )}
                          loading="eager"
                          alt=""
                          aria-hidden="true"
                          className="button-icon"
                        />

                        <img
                          src={legacyImage(
                            'button-icon.svg',
                          )}
                          loading="lazy"
                          alt=""
                          aria-hidden="true"
                          className="button-icon-hover"
                        />
                      </div>
                    </div>
                  </button>
                </form>

                <div
                  className="success-message w-form-done"
                  style={
                    status === 'success'
                      ? { display: 'block' }
                      : undefined
                  }
                >
                  <div>
                    Thank you! Your submission has been
                    received!
                  </div>
                </div>

                <div
                  className="error-message w-form-fail"
                  style={
                    status === 'error'
                      ? { display: 'block' }
                      : undefined
                  }
                >
                  <div>
                    Oops! Something went wrong while
                    submitting the form.
                  </div>
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