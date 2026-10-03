import type { FormField, FormSchema } from './schemas.js'
import { educationEntry, experienceEntry, fileRef } from './schemas.js'

let idCounter = 0
export function fieldId(): string {
  idCounter += 1
  return `f_${Date.now().toString(36)}_${idCounter.toString(36)}`
}

function field(partial: Partial<FormField> & Pick<FormField, 'key' | 'type' | 'label'>): FormField {
  return {
    id: partial.key,
    helpText: '',
    placeholder: '',
    required: false,
    options: [],
    locked: false,
    autofill: null,
    ...partial,
  }
}

export function lockedFields(): FormField[] {
  return [
    field({
      key: 'cv',
      type: 'cv',
      label: 'Upload your CV',
      helpText: "PDF, Word or image, up to 10 MB. We'll use it to fill in the form for you.",
      required: true,
      locked: true,
    }),
    field({ key: 'fullName', type: 'short_text', label: 'Full name', required: true, locked: true, autofill: 'fullName', maxLength: 120 }),
    field({ key: 'email', type: 'email', label: 'Email', required: true, locked: true, autofill: 'email' }),
    field({ key: 'phone', type: 'phone', label: 'Phone number', required: true, locked: true, autofill: 'phone', placeholder: '01XXXXXXXXX' }),
  ]
}

export function consentField(): FormField {
  return field({
    key: 'consent',
    type: 'consent',
    label: 'I agree that Dekko ISHO Group may store and use my CV and details to consider me for this and future roles.',
    required: true,
    locked: true,
  })
}

export function defaultApplicationForm(): FormSchema {
  return {
    fields: [
      ...lockedFields(),
      field({ key: 'city', type: 'short_text', label: 'Current city', autofill: 'city', maxLength: 80 }),
      field({ key: 'currentTitle', type: 'short_text', label: 'Current or most recent job title', autofill: 'currentTitle', maxLength: 120 }),
      field({ key: 'currentCompany', type: 'short_text', label: 'Current or most recent company', autofill: 'currentCompany', maxLength: 160 }),
      field({ key: 'experienceYears', type: 'number', label: 'Total years of experience', autofill: 'totalExperienceYears', required: true }),
      field({ key: 'education', type: 'education', label: 'Education', autofill: 'education' }),
      field({ key: 'experience', type: 'experience', label: 'Work experience', autofill: 'experience' }),
      field({ key: 'linkedin', type: 'url', label: 'LinkedIn profile', autofill: 'linkedin', placeholder: 'https://linkedin.com/in/…' }),
      field({ key: 'expectedSalary', type: 'number', label: 'Expected monthly salary (BDT)' }),
      field({ key: 'noticePeriod', type: 'select', label: 'When can you start?', options: ['Immediately', 'Within 1 month', 'Within 2 months', 'Within 3 months or more'] }),
      field({ key: 'coverLetter', type: 'long_text', label: 'Why are you a great fit for this role?', maxLength: 3000 }),
      consentField(),
    ],
  }
}

export function talentPoolForm(departments: string[], locations: string[]): FormSchema {
  return {
    fields: [
      ...lockedFields(),
      field({ key: 'interestDepartments', type: 'multiselect', label: 'Departments you are interested in', options: departments, required: true }),
      field({ key: 'interestLocations', type: 'multiselect', label: 'Preferred locations', options: locations }),
      field({ key: 'currentTitle', type: 'short_text', label: 'Current or most recent job title', autofill: 'currentTitle', maxLength: 120 }),
      field({ key: 'currentCompany', type: 'short_text', label: 'Current or most recent company', autofill: 'currentCompany', maxLength: 160 }),
      field({ key: 'experienceYears', type: 'number', label: 'Total years of experience', autofill: 'totalExperienceYears' }),
      field({ key: 'education', type: 'education', label: 'Education', autofill: 'education' }),
      field({ key: 'linkedin', type: 'url', label: 'LinkedIn profile', autofill: 'linkedin' }),
      field({ key: 'about', type: 'long_text', label: 'Tell us about yourself and the kind of role you are looking for', maxLength: 3000 }),
      consentField(),
    ],
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+$/i

export type AnswerValidation = {
  ok: boolean
  errors: Record<string, string>
  clean: Record<string, unknown>
}

function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

/** Validates answers against a form. `cv` is checked separately (it arrives as uploadId). */
export function validateAnswers(form: FormSchema, answers: Record<string, unknown>): AnswerValidation {
  const errors: Record<string, string> = {}
  const clean: Record<string, unknown> = {}

  for (const f of form.fields) {
    if (f.type === 'cv') continue
    const raw = answers[f.key]

    if (isEmpty(raw) || (f.type === 'consent' && raw !== true) || (f.type === 'boolean' && raw == null)) {
      if (f.required) {
        errors[f.key] =
          f.type === 'consent'
            ? 'Please tick this box to continue'
            : f.type === 'multiselect' || f.type === 'checkboxes'
              ? 'Please choose at least one option'
              : f.type === 'select' || f.type === 'boolean'
                ? 'Please choose an option'
                : f.type === 'file'
                  ? 'Please upload a file'
                  : f.type === 'education' || f.type === 'experience'
                    ? 'Please add at least one entry'
                    : 'This field is required'
      }
      continue
    }

    switch (f.type) {
      case 'short_text':
      case 'long_text': {
        const value = String(raw).trim()
        const max = f.maxLength ?? (f.type === 'long_text' ? 5000 : 300)
        if (value.length > max) errors[f.key] = `Please keep this under ${max} characters`
        else clean[f.key] = value
        break
      }
      case 'email': {
        const value = String(raw).trim().toLowerCase()
        if (!EMAIL_RE.test(value)) errors[f.key] = 'Please enter a valid email address'
        else clean[f.key] = value
        break
      }
      case 'phone': {
        const value = String(raw).trim()
        if (value.replace(/\D/g, '').length < 8) errors[f.key] = 'Please enter a valid phone number'
        else clean[f.key] = value
        break
      }
      case 'url': {
        let value = String(raw).trim()
        if (!/^https?:\/\//i.test(value)) value = `https://${value}`
        if (!URL_RE.test(value)) errors[f.key] = 'Please enter a valid link'
        else clean[f.key] = value
        break
      }
      case 'number': {
        const value = typeof raw === 'number' ? raw : Number(String(raw).replace(/,/g, ''))
        if (!Number.isFinite(value) || value < 0) errors[f.key] = 'Please enter a valid number'
        else clean[f.key] = value
        break
      }
      case 'date': {
        const value = String(raw)
        if (Number.isNaN(Date.parse(value))) errors[f.key] = 'Please enter a valid date'
        else clean[f.key] = value
        break
      }
      case 'select': {
        const value = String(raw)
        if (f.options.length && !f.options.includes(value)) errors[f.key] = 'Please choose one of the options'
        else clean[f.key] = value
        break
      }
      case 'multiselect':
      case 'checkboxes': {
        const values = Array.isArray(raw) ? raw.map(String) : [String(raw)]
        const valid = f.options.length ? values.filter((v) => f.options.includes(v)) : values
        if (f.required && valid.length === 0) errors[f.key] = 'Please choose at least one option'
        else clean[f.key] = valid
        break
      }
      case 'boolean':
        clean[f.key] = raw === true || raw === 'true' || raw === 'yes'
        break
      case 'consent':
        clean[f.key] = true
        break
      case 'file': {
        const parsed = fileRef.safeParse(raw)
        if (!parsed.success) errors[f.key] = 'Please upload the file again'
        else clean[f.key] = parsed.data
        break
      }
      case 'education':
      case 'experience': {
        const schema = f.type === 'education' ? educationEntry : experienceEntry
        const rows = (Array.isArray(raw) ? raw : [])
          .map((row) => schema.safeParse(row))
          .filter((r) => r.success)
          .map((r) => r.data)
          .filter((row) => Object.values(row).some((v) => String(v).trim() !== ''))
          .slice(0, 15)
        if (f.required && rows.length === 0) errors[f.key] = 'Please add at least one entry'
        else clean[f.key] = rows
        break
      }
    }
  }

  return { ok: Object.keys(errors).length === 0, errors, clean }
}
