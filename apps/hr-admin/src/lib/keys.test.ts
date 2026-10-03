import { describe, expect, it } from 'vitest'
import { camelKey, customFieldKey } from './keys'

describe('camelKey', () => {
  it('turns labels into camelCase keys', () => {
    expect(camelKey('Notice period (weeks)')).toBe('noticePeriodWeeks')
    expect(camelKey('  Expected   SALARY ')).toBe('expectedSalary')
    expect(camelKey('Café owner')).toBe('cafeOwner')
  })

  it('always starts with a lowercase letter and is at least two characters', () => {
    expect(camelKey('2nd language')).toBe('q2ndLanguage')
    expect(camelKey('কাজের অভিজ্ঞতা')).toBe('question')
    expect(camelKey('A')).toBe('aQuestion')
    expect(customFieldKey('9')).toBe('f9')
    expect(customFieldKey('X')).toBe('xField')
    expect(customFieldKey('')).toBe('field')
  })

  it('avoids keys already in use and stays within length limits', () => {
    expect(camelKey('City', new Set(['city', 'city2']))).toBe('city3')
    const long = camelKey('one two three four five six seven', new Set())
    expect(long).toBe('oneTwoThreeFourFive')
    expect(camelKey('x'.repeat(80)).length).toBe(36)
    expect(customFieldKey('Shift pattern', new Set(['shiftPattern']))).toBe('shiftPattern2')
  })

  it('always produces keys the server accepts', () => {
    for (const label of ['', '!!!', '1', 'Ü', 'Very long label with many many words', '日本語']) {
      expect(customFieldKey(label)).toMatch(/^[a-z][a-zA-Z0-9]{1,39}$/)
    }
  })
})
