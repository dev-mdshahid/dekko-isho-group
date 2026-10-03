import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { defaultApplicationForm, talentPoolForm, validateAnswers } from '../src/index.js'

const validAnswers = {
  fullName: '  Rahim Uddin ',
  email: 'Rahim@Example.COM',
  phone: '01711223344',
  experienceYears: 4,
  consent: true,
}

describe('validateAnswers', () => {
  it('accepts a minimal valid application and normalises values', () => {
    const result = validateAnswers(defaultApplicationForm(), validAnswers)
    assert.equal(result.ok, true, JSON.stringify(result.errors))
    assert.equal(result.clean.fullName, 'Rahim Uddin')
    assert.equal(result.clean.email, 'rahim@example.com')
  })

  it('flags each missing required field with a friendly message', () => {
    const result = validateAnswers(defaultApplicationForm(), {})
    assert.equal(result.ok, false)
    assert.equal(result.errors.fullName, 'This field is required')
    assert.equal(result.errors.consent, 'Please tick this box to continue')
    assert.ok(result.errors.email)
    assert.ok(result.errors.phone)
    assert.equal(result.errors.cv, undefined, 'the CV is checked separately')
  })

  it('requires consent to be exactly true', () => {
    const result = validateAnswers(defaultApplicationForm(), { ...validAnswers, consent: 'yes' })
    assert.equal(result.errors.consent, 'Please tick this box to continue')
  })

  it('rejects a bad email and a select value outside its options', () => {
    const result = validateAnswers(defaultApplicationForm(), { ...validAnswers, email: 'not-an-email', noticePeriod: 'Next year' })
    assert.equal(result.errors.email, 'Please enter a valid email address')
    assert.ok(result.errors.noticePeriod)
  })

  it('enforces text length limits', () => {
    const result = validateAnswers(defaultApplicationForm(), { ...validAnswers, coverLetter: 'x'.repeat(3001) })
    assert.equal(result.errors.coverLetter, 'Please keep this under 3000 characters')
  })

  it('drops answers for fields that are not on the form', () => {
    const result = validateAnswers(defaultApplicationForm(), { ...validAnswers, isAdmin: true })
    assert.equal(result.ok, true)
    assert.equal('isAdmin' in result.clean, false)
  })

  it('uses the "choose at least one" message for required multi-selects', () => {
    const form = talentPoolForm(['Engineering', 'Sales'], ['Dhaka'])
    const result = validateAnswers(form, { ...validAnswers })
    assert.equal(result.errors.interestDepartments, 'Please choose at least one option')
  })
})
