import { type FormEvent, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFooterAnimations, useFooterShadowAnimation } from '../../hooks/useFooterAnimations'
import { submitSubscribeForm } from '../../lib/forms'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'

const HOME_PAGE_ID = '6a26a196936d1b3aae320c59'

const mainLinks = [
  { to: '/', label: 'Home' },
  { to: '/home-2', label: 'Home 2' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/press', label: 'Press' },
  { to: '/contact', label: 'Contact' },
]

const utilityLinks = [
  { to: '/utility/style-guide', label: 'Style Guide' },
  { to: '/utility/instructions', label: 'Instructions' },
  { to: '/utility/licenses', label: 'Licenses' },
  { to: '/utility/changelog', label: 'Changelog' },
  { to: '/404', label: 'Error 404' },
  { to: '/401', label: 'Password Protected' },
]

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
  useFooterShadowAnimation(ref)

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
                <h2 className="subscribe-title">Stay connected</h2>
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
                  id="66876f43-9ec4-1dbd-0ca0-ca548397b94e"
                  className="footer-link-item"
                  variant="slide-in-bottom"
                  delay={200}
                >
                  <h2 className="footer-title">Main links</h2>
                  <div className="footer-links">
                    {mainLinks.map((link) => (
                      <Link key={link.to} to={link.to} className={footerLinkClass(pathname, link.to)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </FadeIn>
                <FadeIn
                  id="c3c71fa1-678a-c8f3-2483-91e8980a3ade"
                  className="footer-link-item"
                  variant="slide-in-bottom"
                  delay={300}
                >
                  <h2 className="footer-title">Utility links</h2>
                  <div className="footer-links">
                    {utilityLinks.map((link) => (
                      <Link key={link.to} to={link.to} className={footerLinkClass(pathname, link.to)}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </FadeIn>
                <FadeIn
                  id="64c645f9-8fac-49b8-f082-3f384284032e"
                  className="footer-contact-list"
                  variant="slide-in-bottom"
                  delay={400}
                >
                  <h2 className="footer-title">Contact info</h2>
                  <div className="footer-contact-item">
                    <div className="footer-address">
                      1238 echo ridge blvd, suite 400, san francisco, CA 94103
                    </div>
                    <a href="tel:+1(415)555-0167" className="footer-link">
                      +1 (415) 555-0167
                    </a>
                    <a href="mailto:example@gmail.com" className="footer-link">
                      example@gmail.com
                    </a>
                  </div>
                </FadeIn>
                <FadeIn
                  id="2421dafb-c91b-f351-19c3-69d4e8192796"
                  className="footer-contact-list"
                  variant="slide-in-bottom"
                  delay={500}
                >
                  <h2 className="footer-title">Working hours</h2>
                  <div className="footer-contact-item">
                    <div className="working-text">Mon to Fri: 8:00am - 4:00pm</div>
                    <div className="working-text">Saturday: 8:00am - 1:00pm</div>
                    <div className="working-text">Sunday: Closed</div>
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
              <p className="footer-copyright">
                Designed by{' '}
                <a href="https://webestica.com/" target="_blank" className="footer-copyright-link">
                  Webestica
                </a>
                , Powered by{' '}
                <a href="https://webflow.com/" target="_blank" className="footer-copyright-link">
                  Webflow
                </a>
              </p>
            </FadeIn>
            <FadeIn
              id="9807520c-65b7-e828-71bd-909a6cfe1841"
              className="footer-social-inline"
              variant="slide-in-bottom"
              delay={700}
            >
              <a href="https://www.facebook.com/" target="_blank" className="footer-social-link w-inline-block">
                <img src={legacyImage('facebook.svg')} loading="eager" alt="social-icon" className="footer-social-icon" />
                <div>Facebook</div>
              </a>
              <a href="https://twitter.com/" target="_blank" className="footer-social-link w-inline-block">
                <img src={legacyImage('twitter-x.svg')} loading="eager" alt="" className="footer-social-icon" />
                <div>Twitter</div>
              </a>
              <a href="https://www.instagram.com/" target="_blank" className="footer-social-link w-inline-block">
                <img src={legacyImage('instagram.svg')} loading="eager" alt="social-icon" className="footer-social-icon" />
                <div>Instagram</div>
              </a>
            </FadeIn>
          </div>
          <div className="footer-logo-info">
            <img
              src={legacyImage('Home-2-logo.svg')}
              loading="lazy"
              data-w-id="65ddfbf8-98dc-79d4-6020-0e2cf17451cf"
              data-fade-in
              data-fade-variant="slide-in-bottom"
              data-fade-delay={800}
              alt="Footer Logo"
              className="footer-logo"
            />
          </div>
        </div>
      </div>
      <img src={legacyImage('blur.svg')} loading="lazy" alt="Footer Shadow" className="footer-shadow _01" />
      <img src={legacyImage('blur.svg')} loading="lazy" alt="Footer Shadow" className="footer-shadow _02" />
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
