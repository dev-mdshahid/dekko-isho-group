import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { _matchesForTest as matches, activeListenerCount, resizeTo, rotate, SCREENS, useScreen, type ScreenName } from '../test/viewport'
import { MOBILE_NAV_QUERY, useMediaQuery } from './useMediaQuery'

describe('viewport simulator', () => {
  it('evaluates the media queries the site uses', () => {
    const phone = SCREENS['iPhone SE portrait']
    const desk = SCREENS['Desktop 1920']
    expect(matches('screen and (max-width: 479px)', phone)).toBe(true)
    expect(matches('screen and (max-width: 479px)', desk)).toBe(false)
    expect(matches('(min-width: 992px) and (prefers-reduced-motion: no-preference)', desk)).toBe(true)
    expect(matches('(orientation: landscape)', SCREENS['iPhone SE landscape'])).toBe(true)
    expect(matches('(hover: hover) and (pointer: fine)', phone)).toBe(false)
    expect(matches('(hover: hover) and (pointer: fine)', desk)).toBe(true)
    expect(matches('(prefers-reduced-motion: reduce)', { ...desk, reducedMotion: true })).toBe(true)
    expect(matches('(max-width: 400px), (orientation: portrait)', SCREENS['iPad Mini portrait'])).toBe(true)
  })
})

describe('useMediaQuery', () => {
  const MOBILE_MENU: Record<ScreenName, boolean> = {
    'iPhone SE portrait': true,
    'iPhone SE landscape': true,
    'iPhone 15 portrait': true,
    'iPhone 15 landscape': true,
    'Galaxy S24 portrait': true,
    'Galaxy S24 landscape': true,
    'iPad Mini portrait': true,
    'iPad Mini landscape': true,
    'iPad Pro 12.9 portrait': true,
    'iPad Pro 12.9 landscape': false,
    'Laptop 1280': true,
    'Desktop 1440': false,
    'Desktop 1920': false,
  }

  for (const [screen, expected] of Object.entries(MOBILE_MENU) as Array<[ScreenName, boolean]>) {
    it(`${screen} → ${expected ? 'menu button' : 'full navigation'}`, () => {
      useScreen(screen)
      const { result } = renderHook(() => useMediaQuery(MOBILE_NAV_QUERY))
      expect(result.current).toBe(expected)
    })
  }

  it('updates when the device rotates across the breakpoint', () => {
    useScreen('iPad Pro 12.9 portrait')
    const { result } = renderHook(() => useMediaQuery(MOBILE_NAV_QUERY))
    expect(result.current).toBe(true)
    rotate()
    expect(result.current).toBe(false)
    rotate()
    expect(result.current).toBe(true)
  })

  it('tracks orientation queries', () => {
    useScreen('iPhone 15 portrait')
    const { result } = renderHook(() => useMediaQuery('(orientation: landscape)'))
    expect(result.current).toBe(false)
    resizeTo('iPhone 15 landscape')
    expect(result.current).toBe(true)
  })

  it('re-subscribes when the query changes and cleans up on unmount', () => {
    useScreen('Desktop 1440')
    const { result, rerender, unmount } = renderHook(({ q }) => useMediaQuery(q), { initialProps: { q: '(max-width: 767px)' } })
    expect(result.current).toBe(false)
    rerender({ q: '(min-width: 992px)' })
    expect(result.current).toBe(true)
    expect(activeListenerCount()).toBe(1)
    unmount()
    expect(activeListenerCount()).toBe(0)
  })
})
