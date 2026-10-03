import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { isPortrait, resizeTo, rotate, SCREENS, useScreen, type ScreenName } from '../../test/viewport'
import { Navbar } from './Navbar'

function Where() {
  return <div data-testid="path">{useLocation().pathname}</div>
}

function renderNavbar(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Navbar />
      <Routes>
        <Route path="*" element={<Where />} />
      </Routes>
    </MemoryRouter>,
  )
}

const desktopNav = () => document.querySelector('nav.nav-menu')
const drawer = () => screen.queryByRole('dialog', { name: 'Navigation menu' })
const logo = () => screen.getAllByRole('img', { name: 'Dekko ISHO Group' })[0]

beforeEach(() => {
  document.body.style.overflow = ''
})

describe('Navbar on every screen', () => {
  for (const name of Object.keys(SCREENS) as ScreenName[]) {
    const { width } = SCREENS[name]
    const mobile = width <= 1355
    it(`${name} (${width}px) shows ${mobile ? 'the menu button' : 'the full navigation'}`, () => {
      useScreen(name)
      renderNavbar()
      if (mobile) {
        expect(desktopNav()).toBeNull()
        expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
        expect(logo()).toHaveStyle({ height: '50px' })
      } else {
        expect(desktopNav()).not.toBeNull()
        for (const label of ['About', 'Sustainability', 'Recognition', 'Career']) {
          expect(within(desktopNav() as HTMLElement).getByRole('link', { name: label })).toBeInTheDocument()
        }
        expect(logo()).toHaveStyle({ height: '64px' })
      }
    })
  }
})

describe('desktop navigation', () => {
  it('dropdowns open one at a time, link through and close on outside click', async () => {
    useScreen('Desktop 1920')
    renderNavbar()
    const user = userEvent.setup()
    const nav = desktopNav() as HTMLElement
    const solutions = within(nav).getByRole('button', { name: 'Apparel Solutions' })
    const businesses = within(nav).getByRole('button', { name: 'Businesses' })

    await user.click(solutions)
    expect(solutions).toHaveAttribute('aria-expanded', 'true')
    await user.click(businesses)
    expect(solutions).toHaveAttribute('aria-expanded', 'false')
    expect(businesses).toHaveAttribute('aria-expanded', 'true')

    await user.click(document.body)
    expect(businesses).toHaveAttribute('aria-expanded', 'false')

    await user.click(solutions)
    const menu = document.getElementById('solutions-menu') as HTMLElement
    await user.click(within(menu).getAllByRole('link')[0])
    expect(solutions).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByTestId('path').textContent).not.toBe('/')
    expect(solutions).toHaveClass('w--current')
  })

  it('media links that open in a new tab close the dropdown', async () => {
    useScreen('Desktop 1440')
    renderNavbar()
    const user = userEvent.setup()
    const media = within(desktopNav() as HTMLElement).getByRole('button', { name: 'Media' })
    await user.click(media)
    const menu = document.getElementById('media-menu') as HTMLElement
    const external = within(menu).queryAllByRole('link').find((a) => a.getAttribute('target') === '_blank')
    expect(media).toHaveAttribute('aria-expanded', 'true')
    if (external) {
      external.addEventListener('click', (e) => e.preventDefault())
      await user.click(external)
    } else {
      await user.click(media)
    }
    expect(media).toHaveAttribute('aria-expanded', 'false')
  })

  it('social links reveal on hover and keyboard focus', async () => {
    useScreen('Desktop 1920')
    renderNavbar()
    const toggle = screen.getByRole('button', { name: 'Show social media links' })
    const control = toggle.closest('.nav-social-control') as HTMLElement
    fireEvent.mouseEnter(control)
    expect(control).toHaveClass('is-chevron-visible')
    fireEvent.mouseEnter(toggle.closest('.nav-contact-expand') as HTMLElement)
    expect(screen.getByRole('button', { name: 'Hide social media links' })).toHaveAttribute('aria-expanded', 'true')
    fireEvent.mouseLeave(toggle.closest('.nav-contact-expand') as HTMLElement)
    fireEvent.mouseLeave(control)
    expect(screen.getByRole('button', { name: 'Show social media links' })).toHaveAttribute('aria-expanded', 'false')

    act(() => toggle.focus())
    expect(screen.getByRole('button', { name: 'Hide social media links' })).toBeInTheDocument()
    act(() => toggle.blur())
    expect(screen.getByRole('button', { name: 'Show social media links' })).toBeInTheDocument()
    expect(control).not.toHaveClass('is-chevron-visible')
  })
})

describe('phone and tablet menu', () => {
  it('social links and contact in the menu close it', async () => {
    useScreen('iPhone 15 portrait')
    renderNavbar()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const social = within(drawer()!).getAllByRole('link').find((a) => a.classList.contains('mobile-nav-social-icon'))!
    social.addEventListener('click', (e) => e.preventDefault())
    await user.click(social)
    expect(drawer()).toBeNull()
  })

  it('each section expands in turn', async () => {
    useScreen('iPad Mini landscape')
    renderNavbar('/solutions/manufacturing')
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const menu = drawer()!
    const solutions = within(menu).getByRole('button', { name: 'Apparel Solutions' })
    expect(solutions).toHaveClass('is-current')
    await user.click(solutions)
    await user.click(within(menu).getByRole('button', { name: 'Businesses' }))
    expect(solutions).toHaveAttribute('aria-expanded', 'false')
    await user.click(within(menu).getByRole('button', { name: 'Media' }))
    const panel = document.getElementById('mobile-media-menu') as HTMLElement
    expect(panel).not.toHaveAttribute('hidden')
    const link = within(panel).getAllByRole('link')[0]
    link.addEventListener('click', (e) => e.preventDefault())
    await user.click(link)
    expect(drawer()).toBeNull()
  })

  it('opens a full menu, locks page scroll and closes with Escape', async () => {
    useScreen('iPhone SE portrait')
    renderNavbar()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const menu = drawer()!
    expect(menu).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    for (const label of ['About', 'Sustainability', 'Recognition', 'Career']) {
      expect(within(menu).getByRole('link', { name: label })).toBeInTheDocument()
    }
    await user.click(within(menu).getByRole('button', { name: 'Apparel Solutions' }))
    expect(within(menu).getAllByRole('link').length).toBeGreaterThan(6)
    await user.keyboard('{Escape}')
    expect(drawer()).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })

  it('closes after choosing a page', async () => {
    useScreen('Galaxy S24 portrait')
    renderNavbar()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(within(drawer()!).getByRole('link', { name: 'Career' }))
    expect(screen.getByTestId('path')).toHaveTextContent('/career')
    expect(drawer()).toBeNull()
  })

  it('closes when tapping outside the menu', async () => {
    useScreen('iPad Mini portrait')
    renderNavbar()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const backdrop = screen.getAllByRole('button', { name: 'Close menu' }).find((b) => b.classList.contains('mobile-nav-backdrop'))!
    await user.click(backdrop)
    expect(drawer()).toBeNull()
  })
})

describe('rotating the device', () => {
  for (const name of (Object.keys(SCREENS) as ScreenName[]).filter((n) => isPortrait(n))) {
    it(`${name} → landscape keeps the right navigation`, () => {
      useScreen(name)
      renderNavbar()
      rotate()
      const { width } = SCREENS[name]
      const landscapeWidth = SCREENS[name].height
      expect(Boolean(desktopNav())).toBe(landscapeWidth > 1355)
      expect(screen.queryByRole('button', { name: 'Open menu' }) !== null || landscapeWidth > 1355).toBe(true)
      rotate()
      expect(Boolean(desktopNav())).toBe(width > 1355)
    })
  }

  it('an open menu closes when a tablet turns into the desktop layout', async () => {
    useScreen('iPad Pro 12.9 portrait')
    renderNavbar()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Open menu' }))
    expect(drawer()).not.toBeNull()
    rotate()
    expect(drawer()).toBeNull()
    expect(desktopNav()).not.toBeNull()
    expect(document.body.style.overflow).toBe('')
    rotate()
    expect(drawer()).toBeNull()
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('an open menu stays open when a phone turns sideways', async () => {
    useScreen('iPhone 15 portrait')
    renderNavbar()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Open menu' }))
    rotate()
    expect(drawer()).not.toBeNull()
  })

  it('resizing a desktop window down switches to the menu button', () => {
    useScreen('Desktop 1920')
    renderNavbar()
    expect(desktopNav()).not.toBeNull()
    resizeTo('Laptop 1280')
    expect(desktopNav()).toBeNull()
    act(() => resizeTo('Desktop 1440'))
    expect(desktopNav()).not.toBeNull()
  })
})
