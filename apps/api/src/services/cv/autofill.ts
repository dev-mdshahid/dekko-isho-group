import type { AutofillKey, CvProfile, EducationEntry, ExperienceEntry, FormSchema } from '@dekko-isho/shared'

function highestDegree(p: CvProfile): string | null {
  const edu = p.education.find((e) => e.level === p.highestEducationLevel) ?? p.education[0]
  if (!edu) return null
  return [edu.degree, edu.field && !edu.degree?.includes(edu.field) ? `in ${edu.field}` : null].filter(Boolean).join(' ') || null
}

function value(p: CvProfile, key: AutofillKey): unknown {
  switch (key) {
    case 'fullName':
      return p.fullName
    case 'email':
      return p.email
    case 'phone':
      return p.phone
    case 'city':
      return p.location.city
    case 'linkedin':
      return p.links.linkedin
    case 'portfolio':
      return p.links.portfolio
    case 'currentTitle':
      return p.currentTitle
    case 'currentCompany':
      return p.currentCompany
    case 'totalExperienceYears':
      return p.totalExperienceYears
    case 'highestEducationLevel':
      return p.highestEducationLevel
    case 'highestDegree':
      return highestDegree(p)
    case 'skills':
      return p.skills.length ? p.skills : null
    case 'languages':
      return p.languages.length ? p.languages : null
    case 'summary':
      return p.summary
    case 'education':
      return p.education.length
        ? p.education.slice(0, 6).map<EducationEntry>((e) => ({
            degree: e.degree ?? '',
            institution: e.institution ?? '',
            field: e.field ?? '',
            endYear: e.endYear ? String(e.endYear) : '',
            result: e.result ?? '',
          }))
        : null
    case 'experience':
      return p.experience.length
        ? p.experience.slice(0, 8).map<ExperienceEntry>((e) => ({
            title: e.title ?? '',
            company: e.company ?? '',
            startDate: e.startDate ?? '',
            endDate: e.endDate ?? '',
            description: (e.description ?? '').slice(0, 1500),
          }))
        : null
  }
}

/** Only returns values for fields this form maps, shaped for that field type. */
export function buildAutofill(form: FormSchema, profile: CvProfile): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const field of form.fields) {
    if (!field.autofill) continue
    let v = value(profile, field.autofill)
    if (v == null || v === '') continue
    if (Array.isArray(v) && field.type !== 'education' && field.type !== 'experience' && field.type !== 'multiselect' && field.type !== 'checkboxes') {
      v = (v as string[]).join(', ')
    }
    if (field.type === 'select' || field.type === 'multiselect' || field.type === 'checkboxes') {
      const values = (Array.isArray(v) ? v : [v]).map(String)
      const matched = values.filter((x) => field.options.some((o) => o.toLowerCase() === x.toLowerCase()))
      if (!matched.length) continue
      v = field.type === 'select' ? matched[0] : matched
    }
    if (field.type === 'number') {
      const n = Number(v)
      if (!Number.isFinite(n)) continue
      v = n
    }
    out[field.key] = v
  }
  return out
}
