import { describe, expect, it } from 'vitest'
import { dayStartInZone, formatSalary, isJobOpen, makeReferenceId, slugify, yearInZone, type Salary } from '../src/index.js'

const salary = (s: Partial<Salary>): Salary => ({ min: null, max: null, currency: 'BDT', period: 'month', display: 'range', ...s })

describe('slugify', () => {
  it('makes readable URL slugs', () => {
    expect(slugify('Senior Merchandiser (Knit) — Dhaka')).toBe('senior-merchandiser-knit-dhaka')
    expect(slugify('R&D Lead')).toBe('r-and-d-lead')
    expect(slugify('Café Manager')).toBe('cafe-manager')
    expect(slugify('x'.repeat(200))).toHaveLength(90)
  })
})

describe('formatSalary', () => {
  it('shows ranges, single amounts and negotiable', () => {
    expect(formatSalary(salary({ min: 80000, max: 120000 }))).toBe('৳80,000 – ৳120k/month')
    expect(formatSalary(salary({ min: 50000 }))).toBe('From ৳50,000/month')
    expect(formatSalary(salary({ max: 900000, period: 'year' }))).toBe('Up to ৳900k/year')
    expect(formatSalary(salary({ min: 1000, max: 1000, currency: 'USD' }))).toBe('USD 1,000/month')
    expect(formatSalary(salary({}))).toBe('Negotiable')
    expect(formatSalary(salary({ min: 1, display: 'negotiable' }))).toBe('Negotiable')
    expect(formatSalary(salary({ min: 1, display: 'hidden' }))).toBeNull()
  })
})

describe('isJobOpen', () => {
  const now = Date.parse('2026-10-03T12:00:00Z')
  it('is open until the deadline passes', () => {
    expect(isJobOpen({ deadline: null }, now)).toBe(true)
    expect(isJobOpen({ deadline: '2026-10-04T00:00:00Z' }, now)).toBe(true)
    expect(isJobOpen({ deadline: '2026-10-02T00:00:00Z' }, now)).toBe(false)
    expect(isJobOpen({ deadline: null, status: 'closed' }, now)).toBe(false)
    expect(isJobOpen({ deadline: null, status: 'published' }, now)).toBe(true)
  })
})

describe('reference numbers and dates', () => {
  it('pads reference numbers', () => {
    expect(makeReferenceId('DIG', 42, 2026)).toBe('DIG-2026-00042')
    expect(makeReferenceId('DIG', 1)).toMatch(/^DIG-\d{4}-00001$/)
  })

  it('finds local midnight in a time zone', () => {
    expect(new Date(dayStartInZone('2026-10-03', 'Asia/Dhaka')).toISOString()).toBe('2026-10-02T18:00:00.000Z')
    expect(new Date(dayStartInZone('2026-10-03', 'UTC')).toISOString()).toBe('2026-10-03T00:00:00.000Z')
    expect(dayStartInZone('not-a-date', 'Asia/Dhaka')).toBeNaN()
  })

  it('uses the local year, not the server year', () => {
    const newYearsEveUtc = new Date('2026-12-31T19:00:00Z')
    expect(yearInZone('Asia/Dhaka', newYearsEveUtc)).toBe(2027)
    expect(yearInZone('UTC', newYearsEveUtc)).toBe(2026)
  })
})
