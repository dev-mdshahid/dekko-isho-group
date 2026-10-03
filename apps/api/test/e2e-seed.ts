/**
 * Fresh emulator state for the Playwright suite: settings lists, two live roles and an HR Admin.
 * Runs inside scripts/with-test-emulators.sh before the API boots (the API loads its stores on start).
 */
import { auth } from '../src/lib/firebase.js'
import { createStaff } from '../src/services/staff.js'
import { bootApp, PASSWORD, publishedJob } from './helpers.js'

export const E2E_ADMIN = { email: 'e2e-admin@test.local', password: PASSWORD }

const { ids } = await bootApp()
// Fixed so role pages and screenshots read the same every run.
const deadline = '2099-12-31T17:59:00.000Z'
await publishedJob(ids, { title: 'Software Engineer', deadline })
await publishedJob(ids, {
  title: 'Production Supervisor',
  departmentId: ids.manufacturing,
  locationIds: [ids.gazipur],
  summary: 'Run a high-performing production floor.',
  deadline,
})

const { uid } = await createStaff({ email: E2E_ADMIN.email, name: 'E2E Admin', role: 'hr_admin' }, null, { sendInvite: false })
await auth().updateUser(uid, { password: E2E_ADMIN.password })

console.log('e2e seed ready')
process.exit(0)
