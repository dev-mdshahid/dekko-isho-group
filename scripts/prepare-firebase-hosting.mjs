import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const envPath = resolve(root, '.env')
const firebasePath = resolve(root, 'firebase.json')

function parseEnv(contents) {
  const values = {}
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const equalIndex = trimmed.indexOf('=')
    if (equalIndex === -1) continue
    const key = trimmed.slice(0, equalIndex).trim()
    let value = trimmed.slice(equalIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    values[key] = value
  }
  return values
}

function normalizeDriveUrl(url) {
  const trimmed = url.trim()
  const fileIdMatch = trimmed.match(/\/file\/d\/([^/]+)/)
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/view`
  }
  return trimmed
}

const env = parseEnv(readFileSync(envPath, 'utf8'))
const rawUrl = env.SUSTAINABILITY_REPORT_2025_URL

if (!rawUrl) {
  console.error(
    'Missing SUSTAINABILITY_REPORT_2025_URL in .env.\n' +
      'Upload the PDF to Google Drive, set sharing to "Anyone with the link", then add:\n' +
      'SUSTAINABILITY_REPORT_2025_URL=https://drive.google.com/file/d/YOUR_FILE_ID/view'
  )
  process.exit(1)
}

const driveUrl = normalizeDriveUrl(rawUrl)
const firebaseConfig = JSON.parse(readFileSync(firebasePath, 'utf8'))

firebaseConfig.hosting.redirects = [
  {
    source: '/sustainibility-report-2025',
    destination: '/sustainability-report-2025',
    type: 301,
  },
  {
    source: '/sustainability-report-2025',
    destination: driveUrl,
    type: 302,
  },
]

firebaseConfig.hosting.rewrites = firebaseConfig.hosting.rewrites.filter(
  (rule) => rule.source !== '/sustainability-report-2025'
)

firebaseConfig.hosting.headers = (firebaseConfig.hosting.headers ?? []).filter(
  (rule) => rule.source !== '/documents/sustainability/sustainability-report-2025.pdf'
)

writeFileSync(firebasePath, `${JSON.stringify(firebaseConfig, null, 2)}\n`, 'utf8')
console.log(`Firebase hosting will redirect /sustainability-report-2025 to:\n${driveUrl}`)
