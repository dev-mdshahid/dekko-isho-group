import { describe, expect, it } from 'vitest'
import { customFieldInput, cvBankQuery, defaultApplicationForm, formSchema, jobInput, salary, talentPoolForm } from '../src/index.js'

const issues = (r: { success: boolean; error?: { issues: Array<{ message: string }> } }) => (r.success ? [] : r.error!.issues.map((i) => i.message))

describe('application forms', () => {
  it('accepts the built-in forms', () => {
    expect(formSchema.safeParse(defaultApplicationForm()).success).toBe(true)
    expect(formSchema.safeParse(talentPoolForm(['Technology'], ['Dhaka'])).success).toBe(true)
  })

  it('requires every locked field to stay present, required and the same type', () => {
    const missing = defaultApplicationForm()
    missing.fields = missing.fields.filter((f) => f.key !== 'phone')
    expect(issues(formSchema.safeParse(missing))).toContain('The form must include the "phone" field')

    const optional = defaultApplicationForm()
    optional.fields.find((f) => f.key === 'email')!.required = false
    expect(issues(formSchema.safeParse(optional)).join()).toMatch(/must stay required/)

    const retyped = defaultApplicationForm()
    retyped.fields.find((f) => f.key === 'cv')!.type = 'file'
    expect(issues(formSchema.safeParse(retyped)).join()).toMatch(/can't change type/)
  })

  it('rejects duplicate field keys', () => {
    const form = defaultApplicationForm()
    form.fields.push({ ...form.fields.find((f) => f.key === 'city')!, id: 'x' })
    expect(issues(formSchema.safeParse(form))).toContain('Duplicate field key "city"')
  })
})

describe('circular input', () => {
  const valid = {
    title: 'Engineer',
    departmentId: 'd',
    locationIds: ['l'],
    jobTypeId: 't',
    summary: 'Build things.',
    form: defaultApplicationForm(),
  }

  it('fills in sensible defaults', () => {
    const parsed = jobInput.parse(valid)
    expect(parsed).toMatchObject({ salary: { display: 'hidden', currency: 'BDT' }, publishAt: null, deadline: null, isTalentPool: false, customFields: {} })
  })

  it('explains what is missing', () => {
    const r = jobInput.safeParse({ ...valid, title: 'x', locationIds: [], slug: 'Bad Slug' })
    expect(issues(r)).toEqual(expect.arrayContaining(['Title is required', 'Pick at least one location', 'Use lowercase letters, numbers and dashes']))
  })

  it('checks the salary range', () => {
    expect(issues(salary.safeParse({ min: 100, max: 50 }))).toContain('Maximum salary must be at least the minimum')
  })
})

describe('settings and search input', () => {
  it('validates custom field keys', () => {
    expect(customFieldInput.safeParse({ key: 'shift', label: 'Shift', type: 'text' }).success).toBe(true)
    expect(customFieldInput.safeParse({ key: 'Shift', label: 'Shift', type: 'text' }).success).toBe(false)
    expect(customFieldInput.safeParse({ key: 's', label: 'Shift', type: 'text' }).success).toBe(false)
  })

  it('reads CV bank filters from the URL', () => {
    const q = cvBankQuery.parse({ minExp: '3', page: '2' })
    expect(q.minExp).toBe(3)
    expect(cvBankQuery.safeParse({ minExp: '-1' }).success).toBe(false)
  })
})
