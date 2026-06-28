import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  businessNavGroups,
  flattenNavLinks,
  isNavGroupActive,
  isNavLinkActive,
  mediaNavLinks,
  solutionNavLinks,
  type NavLink as NavMenuLink,
  type NavLinkGroup,
} from '../../data/navigation/navLinks'
import { useClickOutside } from '../../hooks/useClickOutside'
import { MOBILE_NAV_QUERY, useMediaQuery } from '../../hooks/useMediaQuery'
import { useNavMenu } from '../../hooks/useNavMenu'
import { ButtonArrow } from '../ui/ButtonArrow'

type NavDropdownProps = {
  id: string
  label: string
  links: readonly NavMenuLink[]
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  closeMenu: () => void
}

function NavDropdown({ id, label, links, isOpen, onToggle, onClose, closeMenu }: NavDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const isActive = isNavGroupActive(pathname, links)

  useClickOutside(ref, onClose, isOpen)

  function handleLinkClick() {
    onClose()
    closeMenu()
  }

  return (
    <div ref={ref} className={`dropdown w-dropdown${isOpen ? ' w--open' : ''}`}>
      <button
        type="button"
        id={`${id}-toggle`}
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        className={`dropdown-toggle nav-link w-dropdown-toggle${isActive ? ' w--current' : ''}`}
        onClick={onToggle}
      >
        <div>{label}</div>
        <div className="dropdown-icon w-icon-dropdown-toggle" />
      </button>
      <nav
        id={`${id}-menu`}
        aria-labelledby={`${id}-toggle`}
        className={`dropdown-list w-dropdown-list${isOpen ? ' w--open' : ''}`}
      >
        <div className="dropdown-list-inner">
          <div className="dropdown-link-list">
            <div className="grid-dropdown">
              <div>
                {links.map((link) => (
                  <Link
                    key={link.to + link.label}
                    to={link.to}
                    className={`dropdown-link w-dropdown-link${isNavLinkActive(pathname, link.to) ? ' w--current' : ''}`}
                    onClick={handleLinkClick}
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
  )
}

type BusinessesNavDropdownProps = {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  closeMenu: () => void
}

function BusinessesNavDropdown({ isOpen, onToggle, onClose, closeMenu }: BusinessesNavDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const [expandedGroupId, setExpandedGroupId] = useState<NavLinkGroup['id'] | null>(null)
  const expandedGroup = expandedGroupId
    ? businessNavGroups.find((group) => group.id === expandedGroupId)
    : null
  const isActive = isNavGroupActive(pathname, flattenNavLinks(businessNavGroups))

  useClickOutside(ref, onClose, isOpen)

  useEffect(() => {
    if (!isOpen) {
      setExpandedGroupId(null)
    }
  }, [isOpen])

  function handleLinkClick() {
    onClose()
    closeMenu()
  }

  function handleGroupClick(groupId: NavLinkGroup['id']) {
    setExpandedGroupId((current) => (current === groupId ? null : groupId))
  }

  return (
    <div ref={ref} className={`dropdown w-dropdown nav-dropdown nav-dropdown--nested${isOpen ? ' w--open' : ''}`}>
      <button
        type="button"
        id="businesses-toggle"
        aria-expanded={isOpen}
        aria-controls="businesses-menu"
        className={`dropdown-toggle nav-link w-dropdown-toggle${isActive ? ' w--current' : ''}`}
        onClick={onToggle}
      >
        <div>Businesses</div>
        <div className="dropdown-icon w-icon-dropdown-toggle" />
      </button>
      <nav
        id="businesses-menu"
        aria-labelledby="businesses-toggle"
        className={`dropdown-list w-dropdown-list nav-dropdown-panel${isOpen ? ' w--open' : ''}`}
      >
        <div className="nav-dropdown-panel-inner">
          <div className={`nav-nested-dropdown${expandedGroupId ? ' is-expanded' : ''}`}>
            <div className="nav-nested-dropdown-panel">
              <div className="nav-nested-dropdown-categories" role="list" aria-label="Business categories">
                {businessNavGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    role="listitem"
                    aria-expanded={expandedGroupId === group.id}
                    className={`nav-nested-dropdown-category${expandedGroupId === group.id ? ' is-active' : ''}`}
                    onClick={() => handleGroupClick(group.id)}
                  >
                    <span>{group.label}</span>
                    <span className="nav-nested-dropdown-chevron" aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="none">
                        <path
                          d="M6 4.5L10 8L6 11.5"
                          stroke="currentColor"
                          strokeWidth="1.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {expandedGroup && (
              <div className="nav-nested-dropdown-panel">
                <div
                  className="nav-nested-dropdown-links"
                  role="region"
                  aria-label={expandedGroup.label}
                >
                  {expandedGroup.links.map((link) => {
                    const className = `dropdown-link w-dropdown-link nav-nested-dropdown-link${isNavLinkActive(pathname, link.to) ? ' w--current' : ''}`
                    const content = <span>{link.label}</span>

                    if (link.to.startsWith('http')) {
                      return (
                        <a
                          key={`${expandedGroup.id}-${link.label}`}
                          href={link.to}
                          className={className}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                        >
                          {content}
                        </a>
                      )
                    }

                    return (
                      <Link
                        key={`${expandedGroup.id}-${link.label}`}
                        to={link.to}
                        className={className}
                        onClick={handleLinkClick}
                      >
                        {content}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

type MobileNavDropdownProps = {
  id: string
  label: string
  links: readonly NavMenuLink[]
  isOpen: boolean
  onToggle: () => void
  closeMenu: () => void
}

function MobileNavDropdown({ id, label, links, isOpen, onToggle, closeMenu }: MobileNavDropdownProps) {
  const { pathname } = useLocation()
  const isActive = isNavGroupActive(pathname, links)

  function handleLinkClick() {
    closeMenu()
  }

  function handleToggle() {
    onToggle()
  }

  return (
    <div className={`mobile-nav-accordion${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        id={`${id}-toggle`}
        aria-expanded={isOpen}
        aria-controls={`${id}-menu`}
        className={`mobile-nav-link mobile-nav-accordion-trigger${isActive ? ' is-current' : ''}`}
        onClick={handleToggle}
      >
        <span>{label}</span>
        <span className="mobile-nav-chevron" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        id={`${id}-menu`}
        className="mobile-nav-accordion-panel"
        aria-labelledby={`${id}-toggle`}
        hidden={!isOpen}
      >
        <div className="mobile-nav-accordion-panel-inner">
          {links.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={`mobile-nav-sublink${isNavLinkActive(pathname, link.to) ? ' is-current' : ''}`}
              onClick={handleLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

type MobileBusinessesNavProps = {
  isOpen: boolean
  onToggle: () => void
  closeMenu: () => void
}

function MobileBusinessesNav({ isOpen, onToggle, closeMenu }: MobileBusinessesNavProps) {
  const { pathname } = useLocation()
  const [expandedGroupId, setExpandedGroupId] = useState<NavLinkGroup['id'] | null>(null)
  const isActive = isNavGroupActive(pathname, flattenNavLinks(businessNavGroups))

  useEffect(() => {
    if (!isOpen) {
      setExpandedGroupId(null)
    }
  }, [isOpen])

  function handleLinkClick() {
    closeMenu()
  }

  function renderLink(group: NavLinkGroup, link: NavMenuLink) {
    const className = `mobile-nav-sublink${isNavLinkActive(pathname, link.to) ? ' is-current' : ''}`

    if (link.to.startsWith('http')) {
      return (
        <a
          key={`${group.id}-${link.label}`}
          href={link.to}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
        >
          {link.label}
        </a>
      )
    }

    return (
      <Link key={`${group.id}-${link.label}`} to={link.to} className={className} onClick={handleLinkClick}>
        {link.label}
      </Link>
    )
  }

  function handleToggle() {
    onToggle()
  }

  return (
    <div className={`mobile-nav-accordion${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        id="businesses-toggle"
        aria-expanded={isOpen}
        aria-controls="businesses-menu"
        className={`mobile-nav-link mobile-nav-accordion-trigger${isActive ? ' is-current' : ''}`}
        onClick={handleToggle}
      >
        <span>Businesses</span>
        <span className="mobile-nav-chevron" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div
        id="businesses-menu"
        className="mobile-nav-accordion-panel"
        aria-labelledby="businesses-toggle"
        hidden={!isOpen}
      >
        <div className="mobile-nav-accordion-panel-inner">
          {businessNavGroups.map((group) => {
            const isGroupExpanded = expandedGroupId === group.id

            return (
              <div key={group.id} className={`mobile-nav-business-group${isGroupExpanded ? ' is-expanded' : ''}`}>
                <button
                  type="button"
                  aria-expanded={isGroupExpanded}
                  className="mobile-nav-business-trigger"
                  onClick={() => setExpandedGroupId((current) => (current === group.id ? null : group.id))}
                >
                  <span>{group.label}</span>
                  <span className="mobile-nav-chevron" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <div className="mobile-nav-business-links" hidden={!isGroupExpanded}>
                  <div className="mobile-nav-business-links-inner">
                    {group.links.map((link) => renderLink(group, link))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function NavMenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`menu-button w-nav-button mobile-nav-toggle${isOpen ? ' is-open' : ''}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className="mobile-nav-toggle-icon" aria-hidden="true">
        <span className="mobile-nav-toggle-line" />
        <span className="mobile-nav-toggle-line" />
        <span className="mobile-nav-toggle-line" />
      </span>
    </button>
  )
}

type MobileNavDrawerProps = {
  isOpen: boolean
  closeMenu: () => void
}

function MobileNavDrawer({ isOpen, closeMenu }: MobileNavDrawerProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setOpenDropdownId(null)
    }
  }, [isOpen])

  function toggleDropdown(id: string) {
    setOpenDropdownId((current) => (current === id ? null : id))
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="mobile-nav-root">
      <button
        type="button"
        className="mobile-nav-backdrop"
        aria-label="Close menu"
        onClick={closeMenu}
      />
      <div className="mobile-nav-shell">
        <div className="mobile-nav-header">
          <Link to="/" className="mobile-nav-brand" onClick={closeMenu}>
            <img
              src="/dekko-logo.svg"
              loading="eager"
              alt="Dekko Isho Group"
              className="logo"
              style={{ width: 'auto', height: '50px', objectFit: 'contain' }}
            />
          </Link>
          <button
            type="button"
            className="mobile-nav-close is-open"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <span className="mobile-nav-toggle-icon" aria-hidden="true">
              <span className="mobile-nav-toggle-line" />
              <span className="mobile-nav-toggle-line" />
              <span className="mobile-nav-toggle-line" />
            </span>
          </button>
        </div>
        <nav className="mobile-nav-panel" role="navigation" aria-label="Mobile">
          <NavLink
            to="/about"
            className={({ isActive }) => `mobile-nav-link${isActive ? ' is-current' : ''}`}
            onClick={closeMenu}
          >
            About
          </NavLink>
          <MobileNavDropdown
            id="solutions"
            label="Solutions"
            links={solutionNavLinks}
            isOpen={openDropdownId === 'solutions'}
            onToggle={() => toggleDropdown('solutions')}
            closeMenu={closeMenu}
          />
          <MobileBusinessesNav
            isOpen={openDropdownId === 'businesses'}
            onToggle={() => toggleDropdown('businesses')}
            closeMenu={closeMenu}
          />
          <NavLink
            to="/sustainability"
            className={({ isActive }) => `mobile-nav-link${isActive ? ' is-current' : ''}`}
            onClick={closeMenu}
          >
            Sustainability
          </NavLink>
          <NavLink
            to="/awards"
            className={({ isActive }) => `mobile-nav-link${isActive ? ' is-current' : ''}`}
            onClick={closeMenu}
          >
            Recognition
          </NavLink>
          <MobileNavDropdown
            id="media"
            label="Media"
            links={mediaNavLinks}
            isOpen={openDropdownId === 'media'}
            onToggle={() => toggleDropdown('media')}
            closeMenu={closeMenu}
          />
          <NavLink
            to="/career"
            className={({ isActive }) => `mobile-nav-link${isActive ? ' is-current' : ''}`}
            onClick={closeMenu}
          >
            Career
          </NavLink>
          <div className="mobile-nav-contact">
            <ButtonArrow to="/contact" label="Contact" variant="button-nav-contact" />
          </div>
        </nav>
      </div>
    </div>
  )
}

export function Navbar() {
  const { isOpen, toggleMenu, closeMenu } = useNavMenu()
  const { pathname } = useLocation()
  const isMobileNav = useMediaQuery(MOBILE_NAV_QUERY)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  useEffect(() => {
    setOpenDropdownId(null)
  }, [pathname])

  function closeDropdown() {
    setOpenDropdownId(null)
  }

  function toggleDropdown(id: string) {
    setOpenDropdownId((current) => (current === id ? null : id))
  }

  return (
    <div
      data-wf--navbar--variant="base"
      data-animation="default"
      data-collapse="medium"
      data-duration="400"
      data-easing="ease"
      data-easing2="ease"
      role="banner"
      className={`navbar w-nav${isMobileNav && isOpen ? ' is-mobile-menu-open' : ''}`}
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
              src="/dekko-logo.svg"
              loading="eager"
              alt="Dekko Isho Group"
              className="logo"
              style={{ width: 'auto', height: '50px', objectFit: 'contain' }}
            />
          </Link>
          {!isMobileNav && (
            <nav
              role="navigation"
              id="w-node-e6ff9f79-f479-fa42-6f69-a3df18a8ef41-18a8ef3c"
              className="nav-menu w-nav-menu"
            >
              <NavLink
                to="/about"
                className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
                onClick={closeMenu}
              >
                About
              </NavLink>
              <NavDropdown
                id="solutions"
                label="Solutions"
                links={solutionNavLinks}
                isOpen={openDropdownId === 'solutions'}
                onToggle={() => toggleDropdown('solutions')}
                onClose={closeDropdown}
                closeMenu={closeMenu}
              />
              <BusinessesNavDropdown
                isOpen={openDropdownId === 'businesses'}
                onToggle={() => toggleDropdown('businesses')}
                onClose={closeDropdown}
                closeMenu={closeMenu}
              />
              <NavLink
                to="/sustainability"
                className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
                onClick={closeMenu}
              >
                Sustainability
              </NavLink>
              <NavLink
                to="/awards"
                className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
                onClick={closeMenu}
              >
                Recognition
              </NavLink>
              <NavDropdown
                id="media"
                label="Media"
                links={mediaNavLinks}
                isOpen={openDropdownId === 'media'}
                onToggle={() => toggleDropdown('media')}
                onClose={closeDropdown}
                closeMenu={closeMenu}
              />
              <NavLink
                to="/career"
                className={({ isActive }) => `nav-link${isActive ? ' w--current' : ''}`}
                onClick={closeMenu}
              >
                Career
              </NavLink>
            </nav>
          )}
          <div id="w-node-e6ff9f79-f479-fa42-6f69-a3df18a8ef64-18a8ef3c" className="right-nav">
            <div className="nav-button-wrap">
              <ButtonArrow to="/contact" label="Contact" variant="button-nav-contact" />
            </div>
            <NavMenuButton isOpen={isOpen} onClick={toggleMenu} />
          </div>
        </div>
      </div>
      {isMobileNav && isOpen && createPortal(<MobileNavDrawer isOpen={isOpen} closeMenu={closeMenu} />, document.body)}
    </div>
  )
}
