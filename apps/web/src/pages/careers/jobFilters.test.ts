import { describe, expect, it } from 'vitest'
import type { PublicMeta } from '@dekko-isho/shared'
import { makeJob, meta } from '../../test/fixtures'
import { applyFilters, buildGroups, isFilterParam, readFilters, sortJobs, writeFilters, type Filters } from './jobFilters'

const tech = { id: 'technology', name: 'Technology', slug: 'technology' }
const gazipur = { id: 'gazipur', name: 'Gazipur', slug: 'gazipur' }
const contract = { id: 'contract', name: 'Contract', slug: 'contract' }

const jobs = [
  makeJob({ id: 'a', title: 'Senior Merchandiser', publishedAt: '2026-09-01T00:00:00Z', deadline: '2026-10-30T00:00:00Z' }),
  makeJob({
    id: 'b',
    title: 'Data Engineer',
    summary: 'Pipelines and Python',
    department: tech,
    locations: [gazipur],
    jobType: contract,
    experienceLevel: '5+ years',
    publishedAt: '2026-09-20T00:00:00Z',
    deadline: '2026-10-10T00:00:00Z',
    customFields: [{ key: 'shift', label: 'Shift', value: 'Night', showOnCard: true }],
  }),
  makeJob({ id: 'c', title: 'IT Support', department: tech, publishedAt: '2026-09-10T00:00:00Z', deadline: null }),
]

const none: Filters = { q: '', selected: {}, sort: 'newest' }
const ids = (list: { id: string }[]) => list.map((j) => j.id)

describe('URL filters', () => {
  it('reads only known filters and ignores tracking parameters', () => {
    const f = readFilters(new URLSearchParams('dept=technology,merchandising&utm_source=fb&fbclid=1&f.shift=night&q=data&sort=closing&loc='))
    expect(f).toEqual({ q: 'data', sort: 'closing', selected: { dept: ['technology', 'merchandising'], 'f.shift': ['night'] } })
    expect(isFilterParam('f.')).toBe(false)
    expect(readFilters(new URLSearchParams('sort=weird')).sort).toBe('newest')
  })

  it('writes filters back and keeps campaign parameters', () => {
    const keep = new URLSearchParams('utm_source=fb&dept=old&q=old&sort=closing')
    const params = writeFilters({ q: ' data ', sort: 'closing', selected: { dept: ['technology'], loc: [] } }, keep)
    expect(params.toString()).toBe('utm_source=fb&q=data&dept=technology&sort=closing')
    expect(writeFilters(none).toString()).toBe('')
  })
})

describe('filtering and sorting', () => {
  it('matches every search word across title, summary, place and extra details', () => {
    expect(ids(applyFilters(jobs, meta, { ...none, q: 'python gazipur' }))).toEqual(['b'])
    expect(ids(applyFilters(jobs, meta, { ...none, q: 'night' }))).toEqual(['b'])
    expect(ids(applyFilters(jobs, meta, { ...none, q: 'nothing-like-this' }))).toEqual([])
  })

  it('combines facets (any value within a facet, all facets together)', () => {
    expect(ids(applyFilters(jobs, meta, { ...none, selected: { dept: ['technology'] } }))).toEqual(['b', 'c'])
    expect(ids(applyFilters(jobs, meta, { ...none, selected: { dept: ['technology'], loc: ['dhaka'] } }))).toEqual(['c'])
    expect(ids(applyFilters(jobs, meta, { ...none, selected: { exp: ['5-years'] } }))).toEqual(['b'])
  })

  it('sorts newest first or by closing date (open-ended last)', () => {
    expect(ids(sortJobs(jobs, 'newest'))).toEqual(['b', 'c', 'a'])
    expect(ids(sortJobs(jobs, 'closing'))).toEqual(['b', 'a', 'c'])
  })
})

describe('filter groups', () => {
  it('shows live counts that respect the other active filters', () => {
    const groups = buildGroups(jobs, meta, { ...none, selected: { loc: ['gazipur'] } })
    const dept = groups.find((g) => g.param === 'dept')!
    expect(dept.options).toEqual([
      { value: 'merchandising', label: 'Merchandising', count: 0 },
      { value: 'technology', label: 'Technology', count: 1 },
    ])
    const loc = groups.find((g) => g.param === 'loc')!
    expect(loc.options.map((o) => [o.value, o.count])).toEqual([
      ['dhaka', 2],
      ['gazipur', 1],
    ])
  })

  it('hides groups with a single choice unless it is selected, and keeps unknown selections visible', () => {
    const single = [jobs[0]!]
    expect(buildGroups(single, meta, none)).toEqual([])
    const groups = buildGroups(single, meta, { ...none, selected: { dept: ['removed-dept'] } })
    expect(groups[0]!.options.map((o) => o.value)).toEqual(['merchandising', 'removed-dept'])
  })

  it('adds custom fields as filters in their configured order', () => {
    const withCustom = { ...meta, customFields: [{ key: 'shift', label: 'Shift', type: 'select', options: ['Night', 'Day'] }] } as PublicMeta
    const more = [...jobs, makeJob({ id: 'd', customFields: [{ key: 'shift', label: 'Shift', value: ['Day'], showOnCard: false }] }), makeJob({ id: 'e', customFields: [{ key: 'shift', label: 'Shift', value: true, showOnCard: false }] })]
    const shift = buildGroups(more, withCustom, none).find((g) => g.param === 'f.shift')!
    expect(shift.options.map((o) => o.label)).toEqual(['Night', 'Day', 'Yes'])
    expect(ids(applyFilters(more, withCustom, { ...none, selected: { 'f.shift': ['day'] } }))).toEqual(['d'])
    expect(buildGroups(jobs, null, none).map((g) => g.param)).toEqual(['dept', 'loc', 'type', 'exp'])
  })
})
