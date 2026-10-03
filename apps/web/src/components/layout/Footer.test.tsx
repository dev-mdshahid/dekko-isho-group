import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../hooks/useFooterAnimations', () => ({ useFooterAnimations: () => undefined }))
vi.mock('../ui/FadeIn', () => ({ FadeIn: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div> }))

const { Footer } = await import('./Footer')
const { version } = (await import('../../../../../package.json')).default

afterEach(() => vi.unstubAllGlobals())

function renderFooter() {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

describe('Footer', () => {
  it('shows the current release number', () => {
    renderFooter()
    expect(screen.getByTestId('app-version')).toHaveTextContent(`v${version}`)
    expect(version).toMatch(/^\d+\.\d+\.\d+$/)
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Dekko ISHO Group`))).toBeInTheDocument()
  })

  it('subscribes to the newsletter', async () => {
    const fetch = vi.fn(async () => new Response('{"ok":true}'))
    vi.stubGlobal('fetch', fetch)
    const user = renderFooter()
    const input = screen.getByPlaceholderText(/email/i)
    await user.type(input, 'reader@example.com{Enter}')
    expect(await screen.findByText(/thank/i)).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('http://api.test/api/public/subscribe', expect.anything())
    expect(input).toHaveValue('')
  })
})
