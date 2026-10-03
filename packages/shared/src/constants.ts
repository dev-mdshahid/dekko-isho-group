export const STAFF_ROLES = ['hr_admin', 'recruiter', 'viewer'] as const
export type StaffRole = (typeof STAFF_ROLES)[number]

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  hr_admin: 'HR Admin',
  recruiter: 'Recruiter',
  viewer: 'Viewer',
}

export const JOB_STATUSES = ['draft', 'scheduled', 'published', 'closed', 'archived'] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const APPLICATION_STATUSES = [
  'new',
  'reviewed',
  'shortlisted',
  'interview',
  'offer',
  'hired',
  'rejected',
] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected',
}

export const EDUCATION_LEVELS = ['SSC', 'HSC', 'Diploma', 'Bachelor', 'Master', 'PhD', 'Other'] as const
export type EducationLevel = (typeof EDUCATION_LEVELS)[number]

export const EDUCATION_RANK: Record<EducationLevel, number> = {
  SSC: 1,
  HSC: 2,
  Diploma: 3,
  Bachelor: 4,
  Master: 5,
  PhD: 6,
  Other: 0,
}

export const SALARY_DISPLAY = ['range', 'negotiable', 'hidden'] as const
export type SalaryDisplay = (typeof SALARY_DISPLAY)[number]

export const SALARY_PERIODS = ['month', 'year'] as const
export type SalaryPeriod = (typeof SALARY_PERIODS)[number]

export const CUSTOM_FIELD_TYPES = ['text', 'number', 'select', 'multiselect', 'boolean'] as const
export type CustomFieldType = (typeof CUSTOM_FIELD_TYPES)[number]

export const FORM_FIELD_TYPES = [
  'cv',
  'short_text',
  'long_text',
  'email',
  'phone',
  'number',
  'date',
  'url',
  'select',
  'multiselect',
  'checkboxes',
  'boolean',
  'file',
  'education',
  'experience',
  'consent',
] as const
export type FormFieldType = (typeof FORM_FIELD_TYPES)[number]

export const FORM_FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  cv: 'CV upload',
  short_text: 'Short text',
  long_text: 'Long text',
  email: 'Email',
  phone: 'Phone',
  number: 'Number',
  date: 'Date',
  url: 'Link (URL)',
  select: 'Dropdown',
  multiselect: 'Multi-select',
  checkboxes: 'Checkboxes',
  boolean: 'Yes / No',
  file: 'File upload',
  education: 'Education history',
  experience: 'Work experience',
  consent: 'Consent checkbox',
}

/** CV values a form field can be pre-filled from. */
export const AUTOFILL_KEYS = [
  'fullName',
  'email',
  'phone',
  'city',
  'linkedin',
  'portfolio',
  'currentTitle',
  'currentCompany',
  'totalExperienceYears',
  'highestEducationLevel',
  'highestDegree',
  'skills',
  'languages',
  'summary',
  'education',
  'experience',
] as const
export type AutofillKey = (typeof AUTOFILL_KEYS)[number]

export const AUTOFILL_LABELS: Record<AutofillKey, string> = {
  fullName: 'Full name',
  email: 'Email',
  phone: 'Phone',
  city: 'City',
  linkedin: 'LinkedIn URL',
  portfolio: 'Portfolio URL',
  currentTitle: 'Current / last job title',
  currentCompany: 'Current / last company',
  totalExperienceYears: 'Total years of experience',
  highestEducationLevel: 'Highest education level',
  highestDegree: 'Highest degree',
  skills: 'Skills',
  languages: 'Languages',
  summary: 'Profile summary',
  education: 'Education history',
  experience: 'Work experience',
}

export const LOCKED_FIELD_KEYS = ['cv', 'fullName', 'email', 'phone', 'consent'] as const

export const CV_ACCEPT_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
] as const
export const CV_ACCEPT_EXT = '.pdf,.doc,.docx,.jpg,.jpeg,.png'
export const CV_MAX_BYTES = 10 * 1024 * 1024
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024
