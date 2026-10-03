import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { daysLeft, formatDate, formatDateTime, fromLocalInput, plural, timeAgo, toLocalInput } from './format'

const NOW = new Date('2026-10-03T12:00:00Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})
afterEach(() => vi.useRealTimers())

describe('dates in Dhaka time', () => {
  it('formats dates and times', () => {
    expect(formatDate('2026-10-02T20:00:00Z')).toBe('3 Oct 2026')
    expect(formatDateTime('2026-10-03T04:30:00Z')).toMatch(/3 Oct 2026.*10:30/)
    expect(formatDate(null)).toBe('—')
  })

  it('describes how long ago something happened', () => {
    const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString()
    expect(timeAgo(ago(10_000))).toBe('just now')
    expect(timeAgo(ago(5 * 60_000))).toBe('5 min ago')
    expect(timeAgo(ago(3 * 3600_000))).toBe('3 hr ago')
    expect(timeAgo(ago(24 * 3600_000))).toBe('1 day ago')
    expect(timeAgo(ago(4 * 24 * 3600_000))).toBe('4 days ago')
    expect(timeAgo(ago(60 * 24 * 3600_000))).toBe('4 Aug 2026')
    expect(timeAgo(undefined)).toBe('—')
  })

  it('counts days left until a deadline', () => {
    expect(daysLeft('2026-10-05T12:00:00Z')).toBe(2)
    expect(daysLeft('2026-10-01T12:00:00Z')).toBe(-2)
    expect(daysLeft(null)).toBeNull()
  })

  it('converts date-time inputs to and from Dhaka time', () => {
    expect(toLocalInput('2026-10-03T04:30:00.000Z')).toBe('2026-10-03T10:30')
    expect(fromLocalInput('2026-10-03T10:30')).toBe('2026-10-03T04:30:00.000Z')
    expect(toLocalInput(null)).toBe('')
    expect(fromLocalInput('')).toBeNull()
  })
})

describe('plural', () => {
  it('picks the right word', () => {
    expect(plural(1, 'application')).toBe('1 application')
    expect(plural(1200, 'application')).toBe('1,200 applications')
    expect(plural(2, 'person', 'people')).toBe('2 people')
  })
})
