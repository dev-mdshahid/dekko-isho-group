/**
 * Seeds settings lists, the "future roles" talent pool circular and the open roles
 * that were listed on the old careers page. Safe to re-run: a role is only added
 * if no circular with the same title exists, so edited or closed roles are left alone.
 *
 *   npm run seed -w @dekko-isho/api
 */
import { defaultApplicationForm, talentPoolForm, type JobInput, type LookupKind } from '@dekko-isho/shared'
import { config } from '../src/config.js'
import { changeStatus, createJob, jobStore, loadJobs } from '../src/services/jobs.js'
import { createLookup, loadLookups, lookups } from '../src/services/lookups.js'

const LISTS: Record<LookupKind, string[]> = {
  departments: ['Technology', 'Compliance & Sustainability', 'Manufacturing', 'Corporate', 'Industrial Laundry', 'Sustainability', 'Human Resources', 'Finance & Accounts', 'Supply Chain'],
  locations: ['Dhaka', 'Gazipur'],
  jobTypes: ['Full-time', 'Part-time', 'Contract', 'Internship'],
}

const SYSTEM_UID = 'system-seed'

async function ensureLookups() {
  for (const kind of Object.keys(LISTS) as LookupKind[]) {
    const existing = new Set(lookups.list(kind).map((x) => x.name.toLowerCase()))
    let order = lookups.list(kind).length
    for (const name of LISTS[kind]) {
      if (existing.has(name.toLowerCase())) continue
      await createLookup(kind, { name, sortOrder: order++, active: true })
      console.log(`+ ${kind}: ${name}`)
    }
  }
}

const id = (kind: LookupKind, name: string) => {
  const item = lookups.list(kind).find((x) => x.name === name)
  if (!item) throw new Error(`Missing ${kind} "${name}"`)
  return item.id
}

async function ensureTalentPool() {
  if (jobStore.all().some((j) => j.isTalentPool)) return
  const job = await createJob(
    {
      title: 'Apply for a future position',
      departmentId: id('departments', 'Corporate'),
      locationIds: [id('locations', 'Dhaka'), id('locations', 'Gazipur')],
      jobTypeId: id('jobTypes', 'Full-time'),
      experienceLevel: '',
      salary: { min: null, max: null, currency: 'BDT', period: 'month', display: 'hidden' },
      summary: "Don't see the right role today? Share your CV and we'll reach out when a role that fits you opens up.",
      descriptionHtml:
        '<p>We are always looking for talented, driven people to join Dekko ISHO Group. Share your CV and tell us what you are interested in, and our HR team will contact you when a matching role opens.</p>',
      customFields: {},
      publishAt: null,
      deadline: null,
      isTalentPool: true,
      form: talentPoolForm(
        lookups.list('departments').map((d) => d.name),
        lookups.list('locations').map((l) => l.name),
      ),
    },
    SYSTEM_UID,
  )
  await changeStatus(job.id, 'publish')
  console.log('+ talent pool circular')
}

const OPEN_ROLES: Array<{ title: string; department: string; location: string; summary: string }> = [
  { title: 'Sr. Software Engineer', department: 'Technology', location: 'Dhaka', summary: 'Build and scale the software that powers our factories, supply chain and retail brands.' },
  { title: 'Compliance Manager', department: 'Compliance & Sustainability', location: 'Dhaka', summary: 'Lead social and environmental compliance across our manufacturing units and buyer audits.' },
  { title: 'Production Supervisor', department: 'Manufacturing', location: 'Gazipur', summary: 'Run a high-performing production floor, hitting quality and delivery targets every day.' },
  { title: 'Marketing Executive', department: 'Corporate', location: 'Dhaka', summary: 'Tell the Dekko ISHO story across digital, events and brand partnerships.' },
  { title: 'Industrial Laundry Technician', department: 'Industrial Laundry', location: 'Gazipur', summary: 'Operate and maintain washing and finishing machinery for global denim and apparel brands.' },
  { title: 'Sustainability Analyst', department: 'Sustainability', location: 'Dhaka', summary: 'Measure, report and reduce our environmental footprint across the Group.' },
]

async function ensureOpenRoles() {
  for (const role of OPEN_ROLES) {
    if (jobStore.all().some((j) => j.title === role.title)) continue
    const input: JobInput = {
      title: role.title,
      departmentId: id('departments', role.department),
      locationIds: [id('locations', role.location)],
      jobTypeId: id('jobTypes', 'Full-time'),
      experienceLevel: '',
      salary: { min: null, max: null, currency: 'BDT', period: 'month', display: 'hidden' },
      summary: role.summary,
      descriptionHtml: `<h2>About the role</h2><p>${role.summary}</p><h2>What you will do</h2><ul><li>Own day-to-day delivery for your area</li><li>Work closely with teams across the Group</li><li>Find and drive improvements</li></ul><h2>What we are looking for</h2><ul><li>Relevant degree or equivalent experience</li><li>Strong communication in English and Bangla</li><li>A track record of getting things done</li></ul>`,
      customFields: {},
      publishAt: null,
      deadline: null,
      isTalentPool: false,
      form: defaultApplicationForm(),
    }
    const job = await createJob(input, SYSTEM_UID)
    await changeStatus(job.id, 'publish')
    console.log(`+ open role: ${role.title}`)
  }
}

await loadLookups()
await loadJobs()
await ensureLookups()
await ensureTalentPool()
await ensureOpenRoles()
console.log(`Done (${config.firebase.projectId}).`)
process.exit(0)
