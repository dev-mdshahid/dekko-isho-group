import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, renderHook } from '@testing-library/react'

afterEach(() => {
  vi.resetModules()
  vi.doUnmock('../../lib/turnstile')
  delete window.turnstile
})

describe('Turnstile', () => {
  it('renders nothing without a site key', async () => {
    const { Turnstile } = await import('./Turnstile')
    const { container } = render(<Turnstile onToken={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the widget and passes tokens back', async () => {
    vi.doMock('../../lib/turnstile', () => ({ TURNSTILE_SITE_KEY: 'site-key' }))
    let options: Record<string, (t?: string) => void> = {}
    const api = {
      render: vi.fn((_el: HTMLElement, o: Record<string, unknown>) => {
        options = o as typeof options
        return 'w1'
      }),
      remove: vi.fn(),
      reset: vi.fn(),
    }
    window.turnstile = api
    const { Turnstile } = await import('./Turnstile')
    const onToken = vi.fn()
    const view = render(<Turnstile onToken={onToken} appearance="interaction-only" className="form-turnstile" />)
    await act(async () => {})
    expect(view.container.querySelector('.form-turnstile')).not.toBeNull()
    expect(api.render).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({ sitekey: 'site-key', appearance: 'interaction-only' }))
    options.callback!('tok')
    options['expired-callback']!()
    expect(onToken.mock.calls).toEqual([['tok'], ['']])
    view.unmount()
    expect(api.remove).toHaveBeenCalledWith('w1')
  })

  it('loads the Cloudflare script when needed', async () => {
    vi.doMock('../../lib/turnstile', () => ({ TURNSTILE_SITE_KEY: 'site-key' }))
    const { Turnstile } = await import('./Turnstile')
    const onToken = vi.fn()
    render(<Turnstile onToken={onToken} />)
    const script = document.head.querySelector<HTMLScriptElement>('script[src*="turnstile"]')!
    expect(script).not.toBeNull()
    await act(async () => script.onerror?.(new Event('error')))
    expect(onToken).toHaveBeenCalledWith('')
    script.remove()
  })
})

describe('useTurnstile', () => {
  it('clears the token and bumps the reset key', async () => {
    const { useTurnstile } = await import('../../lib/useTurnstile')
    const { result } = renderHook(() => useTurnstile())
    act(() => result.current.setToken('tok'))
    expect(result.current.token).toBe('tok')
    act(() => result.current.reset())
    expect(result.current).toMatchObject({ token: '', resetKey: 1 })
  })
})
