import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render } from '@testing-library/react'
import { StrictMode, useRef, useState } from 'react'
import { useInViewAnimation } from './useInViewAnimation'

const observed: Element[] = []
let reveal: ((entries: Array<{ target: Element; isIntersecting: boolean }>) => void) | null = null
let revealWatching: Set<Element> = new Set()

class FakeIntersectionObserver {
  private watching = new Set<Element>()
  constructor(callback: (entries: Array<{ target: Element; isIntersecting: boolean }>) => void, options?: IntersectionObserverInit) {
    if (options?.rootMargin?.startsWith('0px')) {
      reveal = callback
      revealWatching = this.watching
    }
  }
  observe(el: Element) {
    observed.push(el)
    this.watching.add(el)
  }
  disconnect() {
    this.watching.clear()
  }
}

function Page({ initial, later }: { initial: string[]; later: string[] }) {
  const ref = useRef<HTMLElement>(null)
  const [loaded, setLoaded] = useState(false)
  useInViewAnimation(ref)
  return (
    <main ref={ref}>
      {initial.map((id) => (
        <div key={id} data-fade-in data-testid={id} />
      ))}
      {loaded && later.map((id) => <div key={id} data-fade-in data-testid={id} />)}
      <button onClick={() => setLoaded(true)}>load</button>
    </main>
  )
}

describe('useInViewAnimation', () => {
  beforeEach(() => {
    observed.length = 0
    reveal = null
    revealWatching = new Set()
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('hides reveal targets on mount and fades them in when they scroll into view', () => {
    const { getByTestId } = render(<Page initial={['a']} later={[]} />)
    const el = getByTestId('a')
    expect(el.dataset.fadeState).toBe('out')
    act(() => reveal?.([{ target: el, isIntersecting: true }]))
    expect(el.dataset.fadeState).toBe('in')
  })

  it('keeps watching every element when the page is mounted twice (development mode)', () => {
    const { getByTestId } = render(
      <StrictMode>
        <Page initial={['a', 'b']} later={[]} />
      </StrictMode>,
    )
    for (const id of ['a', 'b']) expect(revealWatching.has(getByTestId(id))).toBe(true)
  })

  it('also tracks content that loads after the page has mounted', async () => {
    const { getByTestId, getByText } = render(<Page initial={['a']} later={['b', 'c']} />)
    await act(async () => getByText('load').click())
    await act(async () => new Promise((r) => setTimeout(r, 0)))
    for (const id of ['b', 'c']) {
      const el = getByTestId(id)
      expect(observed).toContain(el)
      expect(el.dataset.fadeState).toBeDefined()
    }
  })
})
