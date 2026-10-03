import 'dotenv/config'
import { createMailer, mailConfigFromEnv } from '../src/email/mailer.js'
import { sampleEmails } from '../src/email/samples.js'

const [to, which = 'application-received'] = process.argv.slice(2)
if (!to) {
  console.error('Usage: npm run email:test -- <to-address> [template-name|all]')
  process.exit(1)
}

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://dekko-isho-group.web.app'
const emails = sampleEmails(siteUrl)
const names = which === 'all' ? Object.keys(emails) : [which]
const mailer = createMailer(mailConfigFromEnv())

for (const name of names) {
  const email = emails[name as keyof typeof emails]
  if (!email) throw new Error(`Unknown template "${name}". Options: ${Object.keys(emails).join(', ')}, all`)
  const info = await mailer.send(to, email)
  console.log(`Sent ${name} → ${to} (${info.messageId})`)
}
mailer.close()
