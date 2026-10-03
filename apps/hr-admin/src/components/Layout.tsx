import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Briefcase, FileStack, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, Users } from 'lucide-react'
import { STAFF_ROLE_LABELS } from '@dekko-isho/shared'
import { useSession } from '../lib/session'
import { Button, initials } from './ui'

const logoWhite = `${import.meta.env.BASE_URL}logo-white.png`

export function Layout() {
  const { me, signOut, can } = useSession()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpen(false)
  }

  return (
    <div className={`shell ${open ? 'nav-open' : ''}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar-logo">
          <img src={logoWhite} alt="Dekko ISHO Group" />
          <span>HR Portal</span>
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink to="/circulars">
            <Briefcase size={18} /> Circulars
          </NavLink>
          <NavLink to="/cv-bank">
            <FileStack size={18} /> CV Bank
          </NavLink>
          {can('admin') ? (
            <>
              <div className="nav-section">Admin</div>
              <NavLink to="/settings">
                <Settings size={18} /> Settings
              </NavLink>
              <NavLink to="/users">
                <Users size={18} /> Team
              </NavLink>
              <NavLink to="/activity">
                <ShieldCheck size={18} /> Activity log
              </NavLink>
            </>
          ) : null}
        </nav>
        <div className="sidebar-foot">
          <NavLink to="/account" className="me" style={{ textDecoration: 'none' }}>
            <span className="avatar">{initials(me?.name ?? '')}</span>
            <span style={{ minWidth: 0 }}>
              <div className="me-name truncate">{me?.name}</div>
              <div className="me-role">{me ? STAFF_ROLE_LABELS[me.role] : ''}</div>
            </span>
          </NavLink>
          <Button variant="ghost" size="sm" className="btn-block" style={{ color: '#d1d5db', justifyContent: 'flex-start', marginTop: 6 }} onClick={() => void signOut()}>
            <LogOut size={16} /> Sign out
          </Button>
          <div className="sidebar-version">v{__APP_VERSION__}</div>
        </div>
      </aside>
      {open ? <div className="scrim" onClick={() => setOpen(false)} /> : null}
      <div className="main">
        <header className="topbar">
          <Button variant="ghost" icon aria-label="Open menu" style={{ color: '#fff' }} onClick={() => setOpen(true)}>
            <Menu size={20} />
          </Button>
          <img src={logoWhite} alt="Dekko ISHO Group" />
        </header>
        <Outlet />
      </div>
    </div>
  )
}
