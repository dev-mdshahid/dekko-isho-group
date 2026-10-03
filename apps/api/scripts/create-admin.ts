/**
 * Creates an HR Admin and emails them a link to set their password.
 *
 *   npm run create-admin -w @dekko-isho/api -- ekram@bonotech.io "Ekram"
 *   add --print to also print the set-password link (useful locally with mail disabled)
 */
import { config } from '../src/config.js'
import { createStaff } from '../src/services/staff.js'

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const print = process.argv.includes('--print')
const [email, ...nameParts] = args
if (!email) {
  console.error('Usage: npm run create-admin -w @dekko-isho/api -- <email> "<name>" [--print]')
  process.exit(1)
}
const name = nameParts.join(' ') || email.split('@')[0]

const { uid, setPasswordUrl } = await createStaff({ email: email.toLowerCase(), name, role: 'hr_admin' }, null)
console.log(`HR Admin ready: ${email} (uid ${uid}) on ${config.firebase.projectId}`)
console.log(config.mail.enabled ? 'An invitation email is on its way.' : 'Mail is disabled, so no email was sent.')
if (print || !config.mail.enabled) console.log(`Set password: ${setPasswordUrl}`)
// Give the pooled mailer a moment to flush before exiting.
setTimeout(() => process.exit(0), config.mail.enabled ? 8000 : 0)
