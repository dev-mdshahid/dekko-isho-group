import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render } from '@testing-library/react'
import { SCREENS, useScreen } from '../../test/viewport'

const goToIndex = vi.fn()
let reportIndex: (index: number) => void = () => undefined
vi.mock('../../hooks/useMomentumCarousel', () => ({
  useMomentumCarousel: (_v: unknown, _t: unknown, opts: { onActiveIndexChange: (i: number) => void }) => {
    reportIndex = opts.onActiveIndexChange
    return { goToIndex, positionCount: 3 }
  },
}))

const { CareerLifeSection } = await import('./CareerLifeSection')

const carousel = () => document.querySelector('.career-life-carousel') as HTMLElement

describe('CareerLifeSection autoplay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    goToIndex.mockReset()
    useScreen('Desktop 1440')
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('moves to the next group of cards every few seconds and loops back to the start', () => {
    render(<CareerLifeSection />)
    act(() => vi.advanceTimersByTime(4000))
    expect(goToIndex).toHaveBeenLastCalledWith(1)

    act(() => reportIndex(2))
    act(() => vi.advanceTimersByTime(4000))
    expect(goToIndex).toHaveBeenLastCalledWith(0)
  })

  it('gives a full interval after the visitor swipes or picks a dot', () => {
    render(<CareerLifeSection />)
    act(() => vi.advanceTimersByTime(3000))
    act(() => reportIndex(1))
    act(() => vi.advanceTimersByTime(3000))
    expect(goToIndex).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1000))
    expect(goToIndex).toHaveBeenLastCalledWith(2)
  })

  it('pauses while a mouse hovers over the cards', () => {
    render(<CareerLifeSection />)
    fireEvent.pointerEnter(carousel(), { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(10000))
    expect(goToIndex).not.toHaveBeenCalled()
    fireEvent.pointerLeave(carousel(), { pointerType: 'mouse' })
    act(() => vi.advanceTimersByTime(4000))
    expect(goToIndex).toHaveBeenCalledWith(1)
  })

  it('keeps playing after a tap on a touch screen', () => {
    render(<CareerLifeSection />)
    fireEvent.pointerEnter(carousel(), { pointerType: 'touch' })
    fireEvent.pointerDown(carousel(), { pointerType: 'touch' })
    fireEvent.pointerUp(window, { pointerType: 'touch' })
    act(() => vi.advanceTimersByTime(4000))
    expect(goToIndex).toHaveBeenCalledWith(1)
  })

  it('pauses while dragging, even if the drag ends outside the cards', () => {
    render(<CareerLifeSection />)
    fireEvent.pointerDown(carousel())
    act(() => vi.advanceTimersByTime(10000))
    expect(goToIndex).not.toHaveBeenCalled()
    fireEvent.pointerUp(window)
    act(() => vi.advanceTimersByTime(4000))
    expect(goToIndex).toHaveBeenCalledWith(1)
  })

  it('pauses while a keyboard user is on the carousel', () => {
    render(<CareerLifeSection />)
    act(() => (document.querySelector('.career-life-scroll') as HTMLElement).focus())
    act(() => vi.advanceTimersByTime(10000))
    expect(goToIndex).not.toHaveBeenCalled()
  })

  it('does not move on its own for visitors who prefer reduced motion', () => {
    useScreen({ ...SCREENS['Desktop 1440'], reducedMotion: true })
    render(<CareerLifeSection />)
    act(() => vi.advanceTimersByTime(20000))
    expect(goToIndex).not.toHaveBeenCalled()
  })
})
