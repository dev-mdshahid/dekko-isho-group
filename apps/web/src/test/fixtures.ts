import { defaultApplicationForm, type PublicJob, type PublicJobDetail, type PublicMeta } from '@dekko-isho/shared'

const lookup = (name: string) => ({ id: name.toLowerCase(), name, slug: name.toLowerCase().replace(/\s+/g, '-') })

export function makeJob(overrides: Partial<PublicJob> = {}): PublicJob {
  return {
    id: 'job-1',
    slug: 'senior-merchandiser',
    title: 'Senior Merchandiser',
    summary: 'Lead knitwear buyers.',
    department: lookup('Merchandising'),
    locations: [lookup('Dhaka')],
    jobType: lookup('Full-time'),
    experienceLevel: '3+ years',
    salary: { min: 80000, max: 120000, currency: 'BDT', period: 'month', display: 'range' },
    customFields: [],
    publishedAt: new Date().toISOString(),
    deadline: null,
    isTalentPool: false,
    isOpen: true,
    ...overrides,
  } as PublicJob
}

export function makeJobDetail(overrides: Partial<PublicJobDetail> = {}): PublicJobDetail {
  return {
    ...makeJob(),
    descriptionHtml: '<p>About the role</p>',
    formVersionId: 'form-v1',
    form: defaultApplicationForm(),
    ...overrides,
  } as PublicJobDetail
}

export const meta: PublicMeta = {
  departments: [lookup('Merchandising'), lookup('Technology')],
  locations: [lookup('Dhaka'), lookup('Gazipur')],
  jobTypes: [lookup('Full-time'), lookup('Contract')],
  customFields: [],
} as unknown as PublicMeta
