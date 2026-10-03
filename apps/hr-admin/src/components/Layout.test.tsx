import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Layout } from './Layout'

const session = vi.hoisted(() => ({ role: 'hr_admin' as 'hr_admin' | 'viewer' }))

vi.mock('../lib/session', () => ({
  useSession: () => ({
    me: { name: 'Nusrat Jahan', email: 'nusrat@dekkoisho.com', role: session.role },
    signOut: vi.fn(),
    can: (perm: string) => perm !== 'admin' || session.role === 'hr_admin',
  }),
}))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]} basename="/">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>Overview page</p>} />
          <Route path="/cv-bank" element={<p>CV Bank page</p>} />
          <Route path="/circulars" element={<p>Circulars page</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

const shell = () => document.querySelector('.shell') as HTMLElement

describe('HR portal layout', () => {
  it('shows the menu, the signed-in person and the release number', () => {
    renderAt('/')
    const nav = screen.getByRole('complementary', { name: 'Main navigation' })
    for (const label of ['Overview', 'Circulars', 'CV Bank', 'Settings', 'Team', 'Activity log']) {
      expect(within(nav).getByRole('link', { name: new RegExp(label) })).toBeInTheDocument()
    }
    expect(within(nav).getByText('Nusrat Jahan')).toBeInTheDocument()
    expect(within(nav).getByText(`v${__APP_VERSION__}`)).toBeInTheDocument()
    expect(screen.getByText('Overview page')).toBeInTheDocument()
  })

  it('hides admin links from people without admin access', () => {
    session.role = 'viewer'
    renderAt('/')
    expect(screen.queryByRole('link', { name: /Settings/ })).toBeNull()
    session.role = 'hr_admin'
  })

  it('on small screens the menu slides open, closes on the backdrop and after choosing a page', async () => {
    renderAt('/')
    const user = userEvent.setup()
    expect(shell()).not.toHaveClass('nav-open')

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(shell()).toHaveClass('nav-open')
    await user.click(document.querySelector('.scrim') as HTMLElement)
    expect(shell()).not.toHaveClass('nav-open')

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(screen.getByRole('link', { name: /CV Bank/ }))
    expect(screen.getByText('CV Bank page')).toBeInTheDocument()
    expect(shell()).not.toHaveClass('nav-open')
    expect(document.querySelector('.scrim')).toBeNull()
  })
})
