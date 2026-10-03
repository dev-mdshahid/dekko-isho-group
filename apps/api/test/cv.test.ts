import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { defaultApplicationForm, talentPoolForm } from '@dekko-isho/shared'
import { buildAutofill } from '../src/services/cv/autofill.js'
import { groundProfile, normaliseProfile } from '../src/services/cv/extract.js'

const rawProfile = {
  fullName: 'FATEMA AKTER',
  email: ' Fatema.Akter@Example.com ',
  phone: '01811-223344',
  location: { city: 'Gazipur' },
  links: { linkedin: 'linkedin.com/in/fatema' },
  currentTitle: 'Merchandiser',
  currentCompany: 'Dekko Garments',
  skills: ['Sourcing', ' Sourcing ', 'Costing', ''],
  education: [
    { level: 'HSC', degree: 'HSC', institution: 'Gazipur College' },
    { level: 'Bachelor', degree: 'BBA', field: 'Marketing', institution: 'University of Dhaka', endYear: 2018 },
  ],
  experience: [{ title: 'Merchandiser', company: 'Dekko Garments', startDate: '2019-01', endDate: '2023-01' }],
}

describe('normaliseProfile', () => {
  const p = normaliseProfile(rawProfile)

  it('title-cases an all-caps name', () => assert.equal(p.fullName, 'Fatema Akter'))
  it('lowercases and trims the email', () => assert.equal(p.email, 'fatema.akter@example.com'))
  it('normalises Bangladeshi phone numbers to E.164', () => assert.equal(p.phone, '+8801811223344'))
  it('adds https:// to bare links', () => assert.equal(p.links.linkedin, 'https://linkedin.com/in/fatema'))
  it('dedupes and trims skills', () => assert.deepEqual(p.skills, ['Sourcing', 'Costing']))
  it('picks the highest education level', () => assert.equal(p.highestEducationLevel, 'Bachelor'))
  it('works out years of experience from dates', () => assert.equal(p.totalExperienceYears, 4))

  it('returns an empty profile for junk input', () => {
    const empty = normaliseProfile('not an object')
    assert.equal(empty.fullName, null)
    assert.deepEqual(empty.skills, [])
  })
})

describe('groundProfile', () => {
  it('drops identity details that are not in the CV text', () => {
    const p = groundProfile(normaliseProfile(rawProfile), 'Fatema Akter, Merchandiser. Phone 01811 223344')
    assert.equal(p.fullName, 'Fatema Akter')
    assert.equal(p.email, null)
    assert.equal(p.phone, '+8801811223344')
  })
})

describe('buildAutofill', () => {
  const profile = normaliseProfile(rawProfile)

  it('fills only mapped fields, shaped for each field type', () => {
    const out = buildAutofill(defaultApplicationForm(), profile)
    assert.equal(out.fullName, 'Fatema Akter')
    assert.equal(out.city, 'Gazipur')
    assert.equal(out.experienceYears, 4)
    assert.equal(out.linkedin, 'https://linkedin.com/in/fatema')
    assert.equal((out.education as unknown[]).length, 2)
    assert.deepEqual((out.experience as Array<{ company: string }>)[0].company, 'Dekko Garments')
    assert.equal('coverLetter' in out, false)
    assert.equal('consent' in out, false)
  })

  it('skips fields the form does not have', () => {
    const out = buildAutofill(talentPoolForm(['Merchandising'], ['Dhaka']), profile)
    assert.equal('city' in out, false)
    assert.equal('experience' in out, false)
  })
})
