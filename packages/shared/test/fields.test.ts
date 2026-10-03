import { describe, expect, it } from 'vitest'
import { fieldId, validateAnswers, type FormField, type FormSchema } from '../src/index.js'

const base = { helpText: '', placeholder: '', options: [], locked: false, autofill: null } as const
const f = (key: string, type: FormField['type'], extra: Partial<FormField> = {}): FormField => ({ id: key, key, label: key, type, required: true, ...base, ...extra })
const form = (...fields: FormField[]): FormSchema => ({ fields })

describe('validateAnswers by field type', () => {
  it('uses a clear message for each kind of missing answer', () => {
    const res = validateAnswers(
      form(f('pick', 'select', { options: ['A'] }), f('yes', 'boolean'), f('doc', 'file'), f('edu', 'education'), f('exp', 'experience'), f('tags', 'checkboxes')),
      {},
    )
    expect(res.errors).toEqual({
      pick: 'Please choose an option',
      yes: 'Please choose an option',
      doc: 'Please upload a file',
      edu: 'Please add at least one entry',
      exp: 'Please add at least one entry',
      tags: 'Please choose at least one option',
    })
  })

  it('skips optional fields that were left empty', () => {
    const res = validateAnswers(form(f('note', 'long_text', { required: false })), { note: '   ' })
    expect(res).toEqual({ ok: true, errors: {}, clean: {} })
  })

  it('checks phones, links, numbers and dates', () => {
    const fields = form(f('phone', 'phone'), f('site', 'url'), f('years', 'number'), f('start', 'date'))
    expect(validateAnswers(fields, { phone: '123', site: 'not a link', years: -1, start: 'someday' }).errors).toEqual({
      phone: 'Please enter a valid phone number',
      site: 'Please enter a valid link',
      years: 'Please enter a valid number',
      start: 'Please enter a valid date',
    })
    const ok = validateAnswers(fields, { phone: '+880 1711 223344', site: 'linkedin.com/in/rahim', years: '1,200', start: '2026-10-01' })
    expect(ok.clean).toEqual({ phone: '+880 1711 223344', site: 'https://linkedin.com/in/rahim', years: 1200, start: '2026-10-01' })
  })

  it('keeps only known options in multi-choice answers', () => {
    const fields = form(f('langs', 'multiselect', { options: ['Bangla', 'English'] }), f('free', 'checkboxes', { required: false }))
    const res = validateAnswers(fields, { langs: ['English', 'Klingon'], free: 'anything' })
    expect(res.clean).toEqual({ langs: ['English'], free: ['anything'] })
    expect(validateAnswers(fields, { langs: ['Klingon'] }).errors.langs).toBe('Please choose at least one option')
  })

  it('reads yes/no answers and consent', () => {
    const fields = form(f('relocate', 'boolean'), f('consent', 'consent'))
    expect(validateAnswers(fields, { relocate: 'yes', consent: true }).clean).toEqual({ relocate: true, consent: true })
    expect(validateAnswers(fields, { relocate: false, consent: true }).clean.relocate).toBe(false)
  })

  it('accepts uploaded files only as a file reference', () => {
    const fields = form(f('doc', 'file'))
    expect(validateAnswers(fields, { doc: 'u1' }).errors.doc).toBe('Please upload the file again')
    expect(validateAnswers(fields, { doc: { uploadId: 'u1', name: 'a.pdf' } }).clean.doc).toEqual({ uploadId: 'u1', name: 'a.pdf' })
  })

  it('drops blank education and experience rows and caps them at 15', () => {
    const fields = form(f('edu', 'education'), f('exp', 'experience', { required: false }))
    const rows = Array.from({ length: 20 }, (_, i) => ({ degree: `BSc ${i}`, institution: 'BUET' }))
    const res = validateAnswers(fields, { edu: [{ degree: '' }, ...rows, 'junk'], exp: 'not a list' })
    expect((res.clean.edu as unknown[]).length).toBe(15)
    expect(res.clean.exp).toEqual([])
    expect(validateAnswers(fields, { edu: [{ degree: ' ' }] }).errors.edu).toBe('Please add at least one entry')
  })

  it('makes unique field ids', () => {
    const ids = new Set(Array.from({ length: 50 }, fieldId))
    expect(ids.size).toBe(50)
  })
})
