import { z } from 'zod'
import {
  APPLICATION_STATUSES,
  AUTOFILL_KEYS,
  CUSTOM_FIELD_TYPES,
  EDUCATION_LEVELS,
  FORM_FIELD_TYPES,
  JOB_STATUSES,
  SALARY_DISPLAY,
  SALARY_PERIODS,
  STAFF_ROLES,
} from './constants.js'

const trimmed = (max: number) => z.string().trim().max(max)

// ── Settings lists ───────────────────────────────────────────────────────────

export const lookupItemInput = z.object({
  name: trimmed(80).min(1, 'Name is required'),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
})
export type LookupItemInput = z.infer<typeof lookupItemInput>
export type LookupItem = LookupItemInput & { id: string; slug: string }
export const LOOKUP_KINDS = ['departments', 'locations', 'jobTypes'] as const
export type LookupKind = (typeof LOOKUP_KINDS)[number]

export const customFieldInput = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[a-z][a-zA-Z0-9]{1,39}$/, 'Use letters and numbers, starting with a lowercase letter'),
  label: trimmed(60).min(1, 'Label is required'),
  type: z.enum(CUSTOM_FIELD_TYPES),
  options: z.array(trimmed(60).min(1)).max(50).default([]),
  showOnCard: z.boolean().default(false),
  filterPublic: z.boolean().default(false),
  filterCvBank: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})
export type CustomFieldInput = z.infer<typeof customFieldInput>
export type CustomFieldDefinition = CustomFieldInput & { id: string }

// ── Forms ────────────────────────────────────────────────────────────────────

export const formField = z.object({
  id: z.string().min(1),
  key: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_]{0,39}$/),
  type: z.enum(FORM_FIELD_TYPES),
  label: trimmed(120).min(1),
  helpText: trimmed(300).optional().default(''),
  placeholder: trimmed(120).optional().default(''),
  required: z.boolean().default(false),
  options: z.array(trimmed(80).min(1)).max(60).default([]),
  locked: z.boolean().default(false),
  autofill: z.enum(AUTOFILL_KEYS).nullable().default(null),
  maxLength: z.number().int().positive().max(10000).optional(),
})
export type FormField = z.infer<typeof formField>

export const formSchema = z
  .object({ fields: z.array(formField).min(1).max(60) })
  .superRefine((form, ctx) => {
    const keys = new Set<string>()
    for (const field of form.fields) {
      if (keys.has(field.key)) {
        ctx.addIssue({ code: 'custom', message: `Duplicate field key "${field.key}"` })
      }
      keys.add(field.key)
    }
    const lockedTypes: Record<string, string> = { cv: 'cv', fullName: 'short_text', email: 'email', phone: 'phone', consent: 'consent' }
    for (const [key, type] of Object.entries(lockedTypes)) {
      const field = form.fields.find((f) => f.key === key)
      if (!field) {
        ctx.addIssue({ code: 'custom', message: `The form must include the "${key}" field` })
      } else if (field.type !== type || !field.required) {
        ctx.addIssue({ code: 'custom', message: `The "${field.label || key}" field must stay required and can't change type` })
      }
    }
  })
export type FormSchema = z.infer<typeof formSchema>

export const formTemplateInput = z.object({
  name: trimmed(80).min(1),
  schema: formSchema,
})
export type FormTemplateInput = z.infer<typeof formTemplateInput>
export type FormTemplate = FormTemplateInput & { id: string; updatedAt: string }

// ── Jobs ─────────────────────────────────────────────────────────────────────

export const salary = z
  .object({
    min: z.number().nonnegative().nullable().default(null),
    max: z.number().nonnegative().nullable().default(null),
    currency: z.string().trim().length(3).default('BDT'),
    period: z.enum(SALARY_PERIODS).default('month'),
    display: z.enum(SALARY_DISPLAY).default('hidden'),
  })
  .refine((s) => s.min == null || s.max == null || s.max >= s.min, {
    message: 'Maximum salary must be at least the minimum',
  })
export type Salary = z.infer<typeof salary>

export const customFieldValue = z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])
export type CustomFieldValue = z.infer<typeof customFieldValue>

export const jobInput = z.object({
  title: trimmed(120).min(2, 'Title is required'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and dashes')
    .max(100)
    .optional(),
  departmentId: z.string().min(1, 'Pick a department'),
  locationIds: z.array(z.string().min(1)).min(1, 'Pick at least one location'),
  jobTypeId: z.string().min(1, 'Pick a job type'),
  experienceLevel: trimmed(60).optional().default(''),
  salary: salary.default({}),
  summary: trimmed(320).min(1, 'Add a short summary for the role card'),
  descriptionHtml: z.string().max(100_000).default(''),
  descriptionJson: z.unknown().optional(),
  customFields: z.record(customFieldValue).default({}),
  publishAt: z.string().datetime().nullable().default(null),
  deadline: z.string().datetime().nullable().default(null),
  isTalentPool: z.boolean().default(false),
  form: formSchema,
})
export type JobInput = z.infer<typeof jobInput>

export type Job = Omit<JobInput, 'slug'> & {
  id: string
  slug: string
  status: (typeof JOB_STATUSES)[number]
  formVersionId: string
  applicationsCount: number
  newApplicationsCount: number
  createdBy: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  closedAt: string | null
}

export type PublicLookup = { id: string; name: string; slug: string }

export type PublicJobCustomField = {
  key: string
  label: string
  value: CustomFieldValue
  showOnCard: boolean
}

export type PublicJob = {
  id: string
  slug: string
  title: string
  department: PublicLookup | null
  locations: PublicLookup[]
  jobType: PublicLookup | null
  experienceLevel: string
  salary: Salary
  summary: string
  customFields: PublicJobCustomField[]
  deadline: string | null
  publishedAt: string | null
  isTalentPool: boolean
  isOpen: boolean
}

export type PublicJobDetail = PublicJob & {
  descriptionHtml: string
  formVersionId: string
  form: FormSchema
}

export type PublicMeta = {
  departments: PublicLookup[]
  locations: PublicLookup[]
  jobTypes: PublicLookup[]
  customFields: Array<Pick<CustomFieldDefinition, 'key' | 'label' | 'type' | 'options'>>
}

// ── CV profile ───────────────────────────────────────────────────────────────

const nullableString = z.string().trim().nullable().default(null)

export const cvProfile = z.object({
  fullName: nullableString,
  email: nullableString,
  phone: nullableString,
  location: z.object({ city: nullableString, country: nullableString }).default({}),
  links: z
    .object({
      linkedin: nullableString,
      portfolio: nullableString,
      other: z.array(z.string()).default([]),
    })
    .default({}),
  summary: nullableString,
  currentTitle: nullableString,
  currentCompany: nullableString,
  totalExperienceYears: z.number().min(0).max(70).nullable().default(null),
  experience: z
    .array(
      z.object({
        title: nullableString,
        company: nullableString,
        location: nullableString,
        startDate: nullableString,
        endDate: nullableString,
        description: nullableString,
      }),
    )
    .default([]),
  education: z
    .array(
      z.object({
        degree: nullableString,
        level: z.enum(EDUCATION_LEVELS).nullable().default(null),
        field: nullableString,
        institution: nullableString,
        startYear: z.number().int().nullable().default(null),
        endYear: z.number().int().nullable().default(null),
        result: nullableString,
      }),
    )
    .default([]),
  highestEducationLevel: z.enum(EDUCATION_LEVELS).nullable().default(null),
  skills: z.array(z.string().trim()).default([]),
  languages: z.array(z.string().trim()).default([]),
  certifications: z
    .array(z.object({ name: nullableString, issuer: nullableString, year: z.number().int().nullable().default(null) }))
    .default([]),
})
export type CvProfile = z.infer<typeof cvProfile>

// ── Applications ─────────────────────────────────────────────────────────────

export const educationEntry = z.object({
  degree: trimmed(120).default(''),
  institution: trimmed(160).default(''),
  field: trimmed(120).default(''),
  endYear: trimmed(10).default(''),
  result: trimmed(40).default(''),
})
export type EducationEntry = z.infer<typeof educationEntry>

export const experienceEntry = z.object({
  title: trimmed(120).default(''),
  company: trimmed(160).default(''),
  startDate: trimmed(20).default(''),
  endDate: trimmed(20).default(''),
  description: trimmed(1500).default(''),
})
export type ExperienceEntry = z.infer<typeof experienceEntry>

export const fileRef = z.object({ uploadId: z.string().min(1), name: z.string().max(200) })
export type FileRef = z.infer<typeof fileRef>

export const applicationSubmit = z.object({
  jobId: z.string().min(1),
  formVersionId: z.string().min(1),
  uploadId: z.string().min(1, 'Please upload your CV'),
  answers: z.record(z.unknown()),
  turnstileToken: z.string().optional(),
})
export type ApplicationSubmit = z.infer<typeof applicationSubmit>

export type CvUploadResponse = {
  uploadId: string
  fileName: string
  status: 'succeeded' | 'failed'
  autofill: Record<string, unknown>
}

export type ApplicationSubmitResponse = {
  applicationId: string
  referenceId: string
}

// ── HR ───────────────────────────────────────────────────────────────────────

export const applicationStatus = z.enum(APPLICATION_STATUSES)

export const applicationUpdate = z.object({
  status: applicationStatus.optional(),
  tags: z.array(trimmed(40).min(1)).max(20).optional(),
})

export const noteInput = z.object({ body: trimmed(4000).min(1) })

export const staffUserInput = z.object({
  email: z.string().trim().toLowerCase().email(),
  name: trimmed(80).min(1),
  role: z.enum(STAFF_ROLES),
})
export type StaffUserInput = z.infer<typeof staffUserInput>

export const staffUserUpdate = z.object({
  name: trimmed(80).min(1).optional(),
  role: z.enum(STAFF_ROLES).optional(),
  disabled: z.boolean().optional(),
})

export type StaffUser = {
  uid: string
  email: string
  name: string
  role: (typeof STAFF_ROLES)[number]
  disabled: boolean
  createdAt: string
  lastLoginAt: string | null
}

export const cvBankQuery = z.object({
  q: z.string().trim().max(200).optional(),
  text: z.string().trim().max(200).optional(),
  jobId: z.string().optional(),
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
  jobTypeId: z.string().optional(),
  status: z.string().optional(),
  source: z.enum(['circular', 'talent_pool']).optional(),
  minExp: z.coerce.number().min(0).optional(),
  maxExp: z.coerce.number().min(0).optional(),
  education: z.string().optional(),
  skills: z.string().optional(),
  city: z.string().optional(),
  tag: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  custom: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'experience', 'name']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(25),
})
export type CvBankQuery = z.infer<typeof cvBankQuery>

export type CvBankRow = {
  applicationId: string
  candidateId: string
  fullName: string
  email: string
  phone: string
  jobId: string
  jobTitle: string
  departmentName: string
  locationNames: string[]
  jobTypeName: string
  expYears: number | null
  eduLevel: string | null
  currentTitle: string | null
  currentCompany: string | null
  city: string | null
  skills: string[]
  status: (typeof APPLICATION_STATUSES)[number]
  source: 'circular' | 'talent_pool'
  tags: string[]
  submittedAt: string
}

export type CvBankFacets = {
  skills: Array<{ value: string; count: number }>
  cities: Array<{ value: string; count: number }>
  tags: Array<{ value: string; count: number }>
}

export type CvBankResponse = {
  rows: CvBankRow[]
  total: number
  page: number
  pageSize: number
  facets: CvBankFacets
}

// ── Website forms ────────────────────────────────────────────────────────────

export const contactInput = z.object({
  name: trimmed(120).min(1),
  email: z.string().trim().email(),
  phone: trimmed(40).default(''),
  message: trimmed(4000).min(1),
  source: trimmed(40).default('contact'),
  turnstileToken: z.string().optional(),
})
export type ContactInput = z.infer<typeof contactInput>

export const subscribeInput = z.object({
  email: z.string().trim().email(),
  turnstileToken: z.string().optional(),
})
