import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sampleEmails } from '../src/email/samples.js'

const siteUrl = process.env.PUBLIC_SITE_URL || 'https://dekko-isho-group.web.app'
const outDir = join(import.meta.dirname, '..', '.email-previews')
mkdirSync(outDir, { recursive: true })

const emails = sampleEmails(siteUrl)
const links: string[] = []
for (const [name, email] of Object.entries(emails)) {
  writeFileSync(join(outDir, `${name}.html`), email.html)
  writeFileSync(join(outDir, `${name}.txt`), `Subject: ${email.subject}\n\n${email.text}`)
  links.push(`<li><a href="${name}.html">${name}</a> — ${email.subject}</li>`)
}
writeFileSync(join(outDir, 'index.html'), `<!doctype html><meta charset="utf-8"><title>Email previews</title><ul>${links.join('')}</ul>`)
console.log(`Wrote ${Object.keys(emails).length} previews to ${outDir}`)
