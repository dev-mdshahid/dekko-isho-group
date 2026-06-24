import { useEffect, useRef, useState } from 'react'
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
  const [activeGroupId, setActiveGroupId] = useState<NavLinkGroup['id']>(businessNavGroups[0].id)
  const activeGroup =
    businessNavGroups.find((group) => group.id === activeGroupId) ?? businessNavGroups[0]
  const isActive = isNavGroupActive(pathname, flattenNavLinks(businessNavGroups))

  useClickOutside(ref, onClose, isOpen)

  function handleLinkClick() {
    onClose()
    closeMenu()
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
        <div className="dropdown-list-inner nav-dropdown-panel-inner">
          <div className="nav-nested-dropdown">
            <div className="nav-nested-dropdown-categories" role="tablist" aria-label="Business categories">
              {businessNavGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  aria-selected={activeGroupId === group.id}
                  className={`nav-nested-dropdown-category${activeGroupId === group.id ? ' is-active' : ''}`}
                  onMouseEnter={() => setActiveGroupId(group.id)}
                  onFocus={() => setActiveGroupId(group.id)}
                  onClick={() => setActiveGroupId(group.id)}
                >
                  <span>{group.label}</span>
                </button>
              ))}
            </div>
            <div className="nav-nested-dropdown-links" role="tabpanel">
              {activeGroup.links.map((link) => {
                const className = `dropdown-link w-dropdown-link nav-nested-dropdown-link${isNavLinkActive(pathname, link.to) ? ' w--current' : ''}`
                const content = <span>{link.label}</span>

                if (link.to.startsWith('http')) {
                  return (
                    <a
                      key={`${activeGroup.id}-${link.label}`}
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
                    key={`${activeGroup.id}-${link.label}`}
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
        </div>
      </nav>
    </div>
  )
}

export function Navbar() {
  const { isOpen, toggleMenu, closeMenu } = useNavMenu()
  const { pathname } = useLocation()
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
              src="/dekko-logo.svg"
              loading="eager"
              alt="Dekko Isho Group"
              className="logo"
              style={{ width: 'auto', height: '50px', objectFit: 'contain' }}
            />
          </Link>
          <nav
            role="navigation"
            id="w-node-e6ff9f79-f479-fa42-6f69-a3df18a8ef41-18a8ef3c"
            className="nav-menu w-nav-menu"
            style={isOpen ? { display: 'block' } : undefined}
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
          <div id="w-node-e6ff9f79-f479-fa42-6f69-a3df18a8ef64-18a8ef3c" className="right-nav">
            <div className="nav-button-wrap">
              <ButtonArrow to="/contact" label="Contact" variant="button-primary-bg" />
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
