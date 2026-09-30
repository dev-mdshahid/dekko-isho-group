import assert from 'node:assert/strict'
import test from 'node:test'
import {
  formatCapacityCount,
  formatCapacityCountNumber,
  parseCapacityCountValue,
  scrambleCapacityText,
} from '../src/lib/capacityStatAnimation.ts'

test('capacity formats preserve their numeric precision, grouping, and suffix', () => {
  const cases = [
    ['28', 28, 0, '', '0'],
    ['800+', 800, 0, '+', '0+'],
    ['20,000+', 20000, 0, '+', '0+'],
    ['71%', 71, 0, '%', '0%'],
    ['3.5 Million+', 3.5, 1, ' Million+', '0.0 Million+'],
    ['2200 Million', 2200, 0, ' Million', '0 Million'],
    ['2.2 Billion', 2.2, 1, ' Billion', '0.0 Billion'],
    ['1.3 Billion+', 1.3, 1, ' Billion+', '0.0 Billion+'],
    ['2.2 B', 2.2, 1, ' B', '0.0 B'],
    ['3.5 M', 3.5, 1, ' M', '0.0 M'],
    ['1.0 Million+', 1, 1, ' Million+', '0.0 Million+'],
    [' 2,200.00 million + ', 2200, 2, ' million + ', ' 0.00 million + '],
    ['0', 0, 0, '', '0'],
  ]

  for (const [value, target, decimals, suffix, initial] of cases) {
    const parsed = parseCapacityCountValue(value)
    assert.ok(parsed, value)
    assert.equal(parsed.target, target, value)
    assert.equal(parsed.decimals, decimals, value)
    assert.equal(parsed.suffix, suffix, value)
    assert.equal(formatCapacityCount(0, parsed), initial, value)
    assert.equal(formatCapacityCount(target, parsed), value, value)
  }
  assert.equal(formatCapacityCount(1234.5, parseCapacityCountValue('20,000.00+')), '1,234.50+')
  assert.equal(formatCapacityCount(1234, parseCapacityCountValue('2200 Million')), '1234 Million')
  assert.equal(formatCapacityCountNumber(1.3, parseCapacityCountValue('1.3 Billion+')), '1.3')
})

test('text, empty values, and malformed numbers do not become misleading counts', () => {
  for (const value of ['Leadership', 'Continuous', '', '  ', '20,00+', '1.2.3', '24/7', '2–3', '12 Teams']) {
    assert.equal(parseCapacityCountValue(value), null, value)
  }
})

test('scrambling resolves left to right while preserving case, punctuation, spaces, and digits', () => {
  const value = 'Abcd Efgh & 24/7!'
  for (let attempt = 0; attempt < 20; attempt++) {
    assert.match(scrambleCapacityText(value, 0), /^[A-Z][a-z]{3} [A-Z][a-z]{3} & 24\/7!$/)
    assert.match(scrambleCapacityText(value, 0.5), /^Abcd [A-Z][a-z]{3} & 24\/7!$/)
  }
  assert.equal(scrambleCapacityText(value, 1), value)
  assert.equal(scrambleCapacityText(value, 2), value)
  assert.equal(scrambleCapacityText('', 0), '')
  assert.equal(scrambleCapacityText('24/7 & +', 0), '24/7 & +')
})
