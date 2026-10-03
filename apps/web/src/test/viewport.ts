import { act } from '@testing-library/react'

/**
 * jsdom has no layout engine, so `matchMedia` is simulated here: it evaluates width/height/orientation/hover/pointer/
 * reduced-motion queries against a fake screen and fires `change` events when the screen is resized or rotated.
 */
export type Screen = { width: number; height: number; touch?: boolean; reducedMotion?: boolean }

export const SCREENS = {
  'iPhone SE portrait': { width: 320, height: 568, touch: true },
  'iPhone SE landscape': { width: 568, height: 320, touch: true },
  'iPhone 15 portrait': { width: 393, height: 659, touch: true },
  'iPhone 15 landscape': { width: 659, height: 393, touch: true },
  'Galaxy S24 portrait': { width: 360, height: 780, touch: true },
  'Galaxy S24 landscape': { width: 780, height: 360, touch: true },
  'iPad Mini portrait': { width: 768, height: 1024, touch: true },
  'iPad Mini landscape': { width: 1024, height: 768, touch: true },
  'iPad Pro 12.9 portrait': { width: 1024, height: 1366, touch: true },
  'iPad Pro 12.9 landscape': { width: 1366, height: 1024, touch: true },
  'Laptop 1280': { width: 1280, height: 800 },
  'Desktop 1440': { width: 1440, height: 900 },
  'Desktop 1920': { width: 1920, height: 1080 },
} satisfies Record<string, Screen>

export type ScreenName = keyof typeof SCREENS

function matches(query: string, s: Screen): boolean {
  // Comma = OR; "and" = AND. Enough of the media query grammar for this site's CSS and hooks.
  return query.split(',').some((part) =>
    part
      .replace(/^\s*(only\s+)?screen\s*(and)?/i, '')
      .split(/\band\b/i)
      .map((c) => c.trim().replace(/^\(|\)$/g, '').trim())
      .filter(Boolean)
      .every((cond) => {
        const [rawKey, rawValue = ''] = cond.split(':').map((x) => x.trim())
        const px = parseFloat(rawValue)
        switch (rawKey) {
          case 'min-width':
            return s.width >= px
          case 'max-width':
            return s.width <= px
          case 'min-height':
            return s.height >= px
          case 'max-height':
            return s.height <= px
          case 'orientation':
            return rawValue === (s.height >= s.width ? 'portrait' : 'landscape')
          case 'hover':
            return rawValue === (s.touch ? 'none' : 'hover')
          case 'pointer':
            return rawValue === (s.touch ? 'coarse' : 'fine')
          case 'prefers-reduced-motion':
            return rawValue === (s.reducedMotion ? 'reduce' : 'no-preference')
          default:
            return false
        }
      }),
  )
}

type Entry = { query: string; listeners: Set<(e: MediaQueryListEvent) => void>; last: boolean }
let current: Screen = SCREENS['Desktop 1440']
const lists: Entry[] = []

function apply(s: Screen) {
  current = s
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: s.width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: s.height })
}

/** Installs the simulated matchMedia for a screen. Call again (or use `rotate`/`resizeTo`) to change it. */
export function useScreen(screen: Screen | ScreenName) {
  lists.length = 0
  apply(typeof screen === 'string' ? SCREENS[screen] : screen)
  window.matchMedia = ((query: string) => {
    const entry: Entry = { query, listeners: new Set(), last: matches(query, current) }
    lists.push(entry)
    return {
      media: query,
      get matches() {
        return matches(query, current)
      },
      onchange: null,
      addEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => entry.listeners.add(fn),
      removeEventListener: (_: string, fn: (e: MediaQueryListEvent) => void) => entry.listeners.delete(fn),
      addListener: (fn: (e: MediaQueryListEvent) => void) => entry.listeners.add(fn),
      removeListener: (fn: (e: MediaQueryListEvent) => void) => entry.listeners.delete(fn),
      dispatchEvent: () => true,
    } as unknown as MediaQueryList
  }) as typeof window.matchMedia
}

/** Changes the screen size and fires media-query `change` and window `resize` events, like a real resize. */
export function resizeTo(screen: Screen | ScreenName) {
  act(() => {
    apply(typeof screen === 'string' ? SCREENS[screen] : screen)
    for (const entry of lists) {
      const now = matches(entry.query, current)
      if (now === entry.last) continue
      entry.last = now
      for (const fn of [...entry.listeners]) fn({ matches: now, media: entry.query } as MediaQueryListEvent)
    }
    window.dispatchEvent(new Event('resize'))
  })
}

/** Turns the device a quarter turn (portrait ↔ landscape). */
export function rotate() {
  resizeTo({ ...current, width: current.height, height: current.width })
}

/** Number of live `change` listeners, to check components clean up after themselves. */
export const activeListenerCount = () => lists.reduce((n, e) => n + e.listeners.size, 0)

export const isPortrait = (name: ScreenName) => SCREENS[name].height >= SCREENS[name].width
export const _matchesForTest = matches
