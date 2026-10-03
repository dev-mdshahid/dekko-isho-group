import { readFileSync } from 'node:fs'
import { defaultApplicationForm, type JobInput, type StaffRole } from '@dekko-isho/shared'
import { createApp } from '../src/app.js'
import { config } from '../src/config.js'
import { auth } from '../src/lib/firebase.js'
import { buildIndex } from '../src/services/cvbank.js'
import { changeStatus, createJob, loadJobs } from '../src/services/jobs.js'
import { createLookup, loadLookups, lookups } from '../src/services/lookups.js'
import { createStaff } from '../src/services/staff.js'

const project = config.firebase.projectId
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST

export const cvPdf = readFileSync(new URL('./fixtures/cv.pdf', import.meta.url))

export async function resetEmulators() {
  if (!firestoreHost || !authHost || !project.startsWith('demo-')) throw new Error('Integration tests must run against the emulators')
  await Promise.all([
    fetch(`http://${firestoreHost}/emulator/v1/projects/${project}/databases/(default)/documents`, { method: 'DELETE' }),
    fetch(`http://${authHost}/emulator/v1/projects/${project}/accounts`, { method: 'DELETE' }),
  ])
}

export type Ids = { tech: string; manufacturing: string; dhaka: string; gazipur: string; fullTime: string }

/** Fresh emulator state with a few settings items, then the API's in-memory stores loaded from it. */
export async function bootApp() {
  await resetEmulators()
  await loadLookups()
  const make = (kind: 'departments' | 'locations' | 'jobTypes', name: string, sortOrder: number) =>
    createLookup(kind, { name, sortOrder, active: true }).then((x) => x.id)
  const ids: Ids = {
    tech: await make('departments', 'Technology', 0),
    manufacturing: await make('departments', 'Manufacturing', 1),
    dhaka: await make('locations', 'Dhaka', 0),
    gazipur: await make('locations', 'Gazipur', 1),
    fullTime: await make('jobTypes', 'Full-time', 0),
  }
  await loadJobs()
  await buildIndex()
  return { app: createApp(), ids }
}

export function jobInput(ids: Ids, overrides: Partial<JobInput> = {}): JobInput {
  return {
    title: 'Software Engineer',
    departmentId: ids.tech,
    locationIds: [ids.dhaka],
    jobTypeId: ids.fullTime,
    experienceLevel: '3+ years',
    salary: { min: 80000, max: 120000, currency: 'BDT', period: 'month', display: 'range' },
    summary: 'Build the software behind our factories.',
    descriptionHtml: '<p>Join our technology team.</p>',
    customFields: {},
    publishAt: null,
    deadline: null,
    isTalentPool: false,
    form: defaultApplicationForm(),
    ...overrides,
  } as JobInput
}

export async function publishedJob(ids: Ids, overrides: Partial<JobInput> = {}) {
  const job = await createJob(jobInput(ids, overrides), 'test')
  return changeStatus(job.id, 'publish')
}

export const PASSWORD = 'Test-Passw0rd!'

/** Creates a staff member with the given role and returns a real ID token from the Auth emulator. */
export async function staffToken(role: StaffRole, email = `${role}@test.local`): Promise<{ token: string; uid: string }> {
  const { uid } = await createStaff({ email, name: `Test ${role}`, role }, null, { sendInvite: false })
  await auth().updateUser(uid, { password: PASSWORD })
  return { token: await signIn(email), uid }
}

export async function signIn(email: string, password = PASSWORD): Promise<string> {
  const res = await fetch(`http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=fake-api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })
  const data = (await res.json()) as { idToken?: string }
  if (!data.idToken) throw new Error(`sign-in failed for ${email}`)
  return data.idToken
}

export const lookupName = (kind: 'departments' | 'locations' | 'jobTypes', id: string) => lookups.get(kind, id)?.name

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` })
