import { type FormEvent, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  footerBusinessLinks,
  footerContact,
  footerMainLinks,
  footerSocialLinks,
} from '../../data/footer/footerContent'
import { solutions, solutionPath } from '../../data/solutions/solutions'
import { useFooterAnimations } from '../../hooks/useFooterAnimations'
import { submitSubscribeForm } from '../../lib/forms'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'

const HOME_PAGE_ID = '6a26a196936d1b3aae320c59'

function footerLinkClass(pathname: string, to: string) {
  const isActive = to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`)
  return isActive ? 'footer-link w--current' : 'footer-link'
}

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useFooterAnimations(ref)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('idle')
    setErrorMessage('')

    const result = await submitSubscribeForm({ email })
    if (result.ok) {
      setStatus('success')
      setEmail('')
      return
    }

    setStatus('error')
    setErrorMessage(result.errors[0] ?? 'Oops! Something went wrong while submitting the form.')
  }

  return (
    <section id="Footer" ref={ref} data-wf--footer--variant="base" className="footer">
      <div data-w-id="84eea156-668a-6145-cebb-c3051d65f2bd" className="footer-main section-spacing-top">
        <div className="footer-bg-wrap">
          <div className="w-layout-grid grid-footer">
            <div className="footer-subscribe">
              <FadeIn
                id="9807520c-65b7-e828-71bd-909a6cfe182e"
                className="subscribe-wrap"
                variant="slide-in-bottom"
                delay={100}
              >
                <img
                  src="/images/footer-logo.png"
                  loading="lazy"
                  alt="Dekko ISHO Group"
                  className="footer-subscribe-logo"
                />
                <p className="subscribe-description">
                  Join our newsletter for tips, updates, and project highlights—only the good stuff.
                </p>
                <div className="form-subscribe-wrap w-form">
                  <form
                    id="wf-form-Subscribe-Form"
                    name="wf-form-Subscribe-Form"
                    data-name="Subscribe Form"
                    method="get"
                    className="form-subscribe"
                    data-wf-page-id={HOME_PAGE_ID}
                    data-wf-element-id="9807520c-65b7-e828-71bd-909a6cfe1832"
                    onSubmit={onSubmit}
                  >
                    <input
                      className="form-input form-input-subscribe w-input"
                      maxLength={256}
                      name="Email"
                      data-name="Email"
                      placeholder="Enter your email"
                      type="email"
                      id="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="submit"
                      data-wait=""
                      aria-label="Button"
                      className="button-subscribe w-button"
                      value=""
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
                    <div>
                      {errorMessage || 'Oops! Something went wrong while submitting the form.'}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div id="w-node-_9807520c-65b7-e828-71bd-909a6cfe1805-6cfe1801" className="footer-item">
              <div className="w-layout-grid grid-footer-menu">
                <FadeIn
                  id="footer-main-links"
                  className="footer-link-item"
                  variant="slide-in-bottom"
                  delay={200}
                >
                  <h2 className="footer-title">Links</h2>
                  <div className="footer-links">
                    {footerMainLinks.map((link) => (
                      <Link key={link.to} to={link.to} className={footerLinkClass(pathname, link.to)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </FadeIn>
                <FadeIn
                  id="footer-solutions-links"
                  className="footer-link-item"
                  variant="slide-in-bottom"
                  delay={250}
                >
                  <h2 className="footer-title">Solutions</h2>
                  <div className="footer-links">
                    {solutions.map((solution) => (
                      <Link
                        key={solution.slug}
                        to={solutionPath(solution.slug)}
                        className={footerLinkClass(pathname, solutionPath(solution.slug))}
                      >
                        {solution.title}
                      </Link>
                    ))}
                  </div>
                </FadeIn>
                <FadeIn
                  id="64c645f9-8fac-49b8-f082-3f384284032e"
                  className="footer-contact-list"
                  variant="slide-in-bottom"
                  delay={350}
                >
                  <h2 className="footer-title">Contact info.</h2>
                  <div className="footer-contact-item">
                    <div className="footer-address">{footerContact.address}</div>
                    <a href={footerContact.phone.href} className="footer-link">
                      {footerContact.phone.label}
                    </a>
                    <a href={footerContact.email.href} className="footer-link">
                      {footerContact.email.label}
                    </a>
                  </div>
                </FadeIn>
                <FadeIn
                  id="footer-business-links"
                  className="footer-link-item"
                  variant="slide-in-bottom"
                  delay={450}
                >
                  <h2 className="footer-title">Businesses</h2>
                  <div className="footer-links">
                    {footerBusinessLinks.map((link) => (
                      <Link key={link.to} to={link.to} className={footerLinkClass(pathname, link.to)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
          <div className="footer-divider" />
          <div className="footer-bottom-wrap">
            <FadeIn
              id="d283640d-fc6a-1283-2d22-21620e76ddab"
              className="footer-copyright-wrap"
              variant="slide-in-bottom"
              delay={600}
            >
              <p className="footer-copyright">© 2026 Dekko Isho Group</p>
            </FadeIn>
            <FadeIn
              id="9807520c-65b7-e828-71bd-909a6cfe1841"
              className="footer-social-inline"
              variant="slide-in-bottom"
              delay={700}
            >
              {footerSocialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-link w-inline-block"
                >
                  <img
                    src={social.icon.startsWith('/') ? social.icon : legacyImage(social.icon)}
                    loading="eager"
                    alt=""
                    className="footer-social-icon"
                  />
                  <div>{social.label}</div>
                </a>
              ))}
            </FadeIn>
          </div>
          <div className="footer-logo-info">
            <img
              src={legacyImage('footer-dekko-isho-logo.svg')}
              loading="lazy"
              data-w-id="65ddfbf8-98dc-79d4-6020-0e2cf17451cf"
              data-fade-in
              data-fade-variant="slide-in-bottom"
              data-fade-delay={800}
              alt="Dekko ISHO Group"
              className="footer-logo"
            />
          </div>
        </div>
      </div>
      <div className="footer-shadow _01" aria-hidden="true" />
      <div className="footer-shadow _02" aria-hidden="true" />
      <div className="line-wrapper">
        <div className="section-line" />
        <div className="section-line" />
        <div className="section-line" />
        <div className="section-line" />
        <div className="section-line" />
      </div>
    </section>
  )
}
