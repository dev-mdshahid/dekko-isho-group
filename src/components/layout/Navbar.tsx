import { Link, NavLink } from 'react-router-dom'
import { useNavMenu } from '../../hooks/useNavMenu'
import { ButtonArrow } from '../ui/ButtonArrow'

const pageLinks = [
  { to: '/', label: 'Home' },
  { to: '/home-2', label: 'Home 2' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/products', label: 'Products' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/press', label: 'Press' },
  { to: '/awards', label: 'Awards' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
]

export function Navbar() {
  const { isOpen, toggleMenu, closeMenu } = useNavMenu()

  return (
    <div
      data-wf--navbar--variant="base"
      data-animation="default"
      data-collapse="medium"
      data-duration="400"
      data-easing="ease"
      data-easing2="ease"
      role="banner"
      className={`navbar w-nav${isOpen ? ' w--nav-menu-open' : ''}`}
    >
      <div className="container-full w-container">
        <div className="w-layout-grid grid-nav">
          <Link
            to="/"
            id="w-node-e6ff9f79-f479-fa42-6f69-a3df18a8ef3f-18a8ef3c"
            className="brand w-nav-brand"
            onClick={closeMenu}
          >
            <img
              src="/dekko-logo.png"
              loading="eager"
              alt="Dekko Isho Group"
              className="logo"
              style={{ width: 'auto', maxHeight: '35px', objectFit: 'contain' }}
            />
          </Link>
          <nav
            role="navigation"
            id="w-node-e6ff9f79-f479-fa42-6f69-a3df18a8ef41-18a8ef3c"
            className="nav-menu w-nav-menu"
            style={isOpen ? { display: 'block' } : undefined}
          >
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
              onClick={closeMenu}
            >
              About
            </NavLink>
            <div data-hover="true" data-delay="0" className="dropdown w-dropdown">
              <div className="dropdown-toggle nav-link w-dropdown-toggle">
                <div>Pages</div>
                <div className="dropdown-icon w-icon-dropdown-toggle" />
              </div>
              <nav className="dropdown-list w-dropdown-list">
                <div className="dropdown-list-inner">
                  <div className="dropdown-link-list">
                    <div className="grid-dropdown">
                      <div>
                        {pageLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="dropdown-link w-dropdown-link"
                            onClick={closeMenu}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
            <NavLink
              to="/services"
              className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
              onClick={closeMenu}
            >
              Services
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </nav>
          <div id="w-node-e6ff9f79-f479-fa42-6f69-a3df18a8ef64-18a8ef3c" className="right-nav">
            <div className="nav-button-wrap">
              <ButtonArrow to="/contact" label="Get a Quote" variant="button-primary-bg" />
            </div>
            <button
              type="button"
              className={`menu-button w-nav-button${isOpen ? ' w--open' : ''}`}
              aria-label="Toggle menu"
              onClick={toggleMenu}
            >
              <div className="w-icon-nav-menu" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
