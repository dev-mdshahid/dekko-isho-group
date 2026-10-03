#!/usr/bin/env node
/**
 * Pre-deploy credential check. Verifies every required variable is present and has the right shape,
 * without ever printing a value. Exits 1 when anything is wrong.
 *
 *   node scripts/check-env.mjs                 website + HR portal production build env
 *   node scripts/check-env.mjs --remote        …and confirm the live API agrees (health endpoint)
 *   node scripts/check-env.mjs api [file]      API production env (run on the droplet; default apps/api/.env)
 *
 * Plain Node, no dependencies: it runs on the droplet before `npm ci`.
 */
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FIREBASE_PROJECT = 'dekko-isho-group'

export function parseEnv(contents) {
  const values = {}
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim().replace(/^export\s+/, '')
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    else value = value.replace(/\s+#.*$/, '')
    values[key] = value
  }
  return values
}

/** Same files and precedence Vite uses for `vite build` (mode production). */
export function loadViteEnv(dir) {
  const merged = {}
  for (const name of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    const file = resolve(dir, name)
    if (existsSync(file)) Object.assign(merged, parseEnv(readFileSync(file, 'utf8')))
  }
  return merged
}

const isHttpsUrl = (v) => {
  try {
    const u = new URL(v)
    return u.protocol === 'https:' && !/^(localhost|127\.|0\.0\.0\.0)/.test(u.hostname)
  } catch {
    return false
  }
}
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

/** A rule returns an error message, or null when the value is fine. */
const rules = {
  https: (v) => (isHttpsUrl(v) ? null : 'must be a public https URL'),
  email: (v) => (isEmail(v) ? null : 'must be an email address'),
  pattern: (re, what) => (v) => (re.test(v) ? null : `must be ${what}`),
  equals: (expected) => (v) => (v === expected ? null : `must be "${expected}"`),
  oneOf: (list) => (v) => (list.includes(v) ? null : `must be one of ${list.join(', ')}`),
}

export class Report {
  constructor(title) {
    this.title = title
    this.errors = []
    this.warnings = []
  }
  error(key, msg) {
    this.errors.push(`${key}: ${msg}`)
  }
  warn(key, msg) {
    this.warnings.push(`${key}: ${msg}`)
  }
  require(env, key, rule) {
    const v = env[key]
    if (v == null || v === '') return this.error(key, 'missing')
    const problem = rule?.(v)
    if (problem) this.error(key, problem)
  }
  optional(env, key, rule) {
    const v = env[key]
    if (v == null || v === '') return
    const problem = rule?.(v)
    if (problem) this.error(key, problem)
  }
  forbid(env, key, why) {
    if (env[key]) this.error(key, why)
  }
  print() {
    const ok = this.errors.length === 0
    console.log(`${ok ? '✓' : '✗'} ${this.title}`)
    for (const e of this.errors) console.log(`    ✗ ${e}`)
    for (const w of this.warnings) console.log(`    ! ${w}`)
    return ok
  }
}

const TURNSTILE_SITE_KEY = rules.pattern(/^0x[0-9A-Za-z_-]{20,}$/, 'a Cloudflare Turnstile site key (0x…)')

export function checkWeb(env) {
  const r = new Report('Website (apps/web production build)')
  r.require(env, 'FIREBASE_API_KEY', rules.pattern(/^AIza[0-9A-Za-z_-]{35}$/, 'a 39-character Firebase web API key'))
  r.require(env, 'FIREBASE_AUTH_DOMAIN', rules.pattern(/^[a-z0-9.-]+\.[a-z]{2,}$/, 'a domain name'))
  r.require(env, 'FIREBASE_PROJECT_ID', rules.equals(FIREBASE_PROJECT))
  r.require(env, 'FIREBASE_STORAGE_BUCKET', rules.pattern(/^[a-z0-9.-]+\.(appspot\.com|firebasestorage\.app)$/, 'a Firebase Storage bucket'))
  r.require(env, 'FIREBASE_MESSAGING_SENDER_ID', rules.pattern(/^\d{6,}$/, 'numeric'))
  r.require(env, 'FIREBASE_APP_ID', rules.pattern(/^1:\d+:web:[0-9a-f]+$/, 'a Firebase web app id (1:…:web:…)'))
  r.optional(env, 'FIREBASE_MEASUREMENT_ID', rules.pattern(/^G-[A-Z0-9]{6,}$/, 'a GA4 measurement id (G-…)'))
  r.require(env, 'SUSTAINABILITY_REPORT_2025_URL', rules.https)
  r.require(env, 'VITE_API_BASE_URL', rules.https)
  r.require(env, 'VITE_SHARE_BASE_URL', rules.https)
  r.optional(env, 'VITE_TURNSTILE_SITE_KEY', TURNSTILE_SITE_KEY)
  if (!env.VITE_TURNSTILE_SITE_KEY) r.warn('VITE_TURNSTILE_SITE_KEY', 'not set, so forms run without a bot check')
  return r
}

export function checkHr(env, webEnv) {
  const r = new Report('HR portal (apps/hr-admin production build)')
  r.require(env, 'VITE_API_BASE_URL', rules.https)
  if (env.VITE_API_BASE_URL && webEnv.VITE_API_BASE_URL && env.VITE_API_BASE_URL.replace(/\/$/, '') !== webEnv.VITE_API_BASE_URL.replace(/\/$/, '')) {
    r.error('VITE_API_BASE_URL', 'differs from the website’s API URL')
  }
  r.forbid(env, 'VITE_FIREBASE_AUTH_EMULATOR_HOST', 'must not be set for production (sign-in would go to the emulator)')
  r.optional(env, 'VITE_SITE_URL', rules.https)
  return r
}

export function checkApi(env, { baseDir = ROOT } = {}) {
  const r = new Report('API (apps/api production env)')
  r.require(env, 'NODE_ENV', rules.equals('production'))
  r.require(env, 'PORT', rules.pattern(/^\d{2,5}$/, 'a port number'))
  r.optional(env, 'HOST', rules.oneOf(['127.0.0.1', 'localhost']))
  r.require(env, 'PUBLIC_SITE_URL', rules.https)
  r.require(env, 'HR_PORTAL_URL', rules.https)
  r.require(env, 'API_PUBLIC_URL', rules.https)
  r.require(env, 'CORS_ORIGINS', (v) => {
    const origins = v.split(',').map((s) => s.trim()).filter(Boolean)
    if (!origins.length || !origins.every(isHttpsUrl)) return 'must be a comma-separated list of https origins'
    const site = env.PUBLIC_SITE_URL && isHttpsUrl(env.PUBLIC_SITE_URL) ? new URL(env.PUBLIC_SITE_URL).origin : null
    if (site && !origins.map((o) => new URL(o).origin).includes(site)) return 'must include the PUBLIC_SITE_URL origin'
    return null
  })

  r.require(env, 'FIREBASE_PROJECT_ID', rules.equals(FIREBASE_PROJECT))
  r.forbid(env, 'FIRESTORE_EMULATOR_HOST', 'must not be set in production')
  r.forbid(env, 'FIREBASE_AUTH_EMULATOR_HOST', 'must not be set in production')
  r.require(env, 'GOOGLE_APPLICATION_CREDENTIALS', (v) => {
    const file = isAbsolute(v) ? v : resolve(baseDir, 'apps/api', v)
    if (!existsSync(file)) return 'file not found'
    let sa
    try {
      sa = JSON.parse(readFileSync(file, 'utf8'))
    } catch {
      return 'is not valid JSON'
    }
    if (sa.type !== 'service_account') return 'is not a service account key'
    if (sa.project_id !== FIREBASE_PROJECT) return `belongs to a different project (expected ${FIREBASE_PROJECT})`
    if (!String(sa.private_key ?? '').includes('BEGIN PRIVATE KEY') || !isEmail(String(sa.client_email ?? ''))) return 'is incomplete'
    if (process.platform !== 'win32' && (statSync(file).mode & 0o077) !== 0) r.warn('GOOGLE_APPLICATION_CREDENTIALS', 'key file is readable by other users (chmod 600)')
    return null
  })

  r.require(env, 'STORAGE_DRIVER', rules.equals('b2'))
  r.require(env, 'B2_KEY_ID', rules.pattern(/^[0-9a-f]{25}$/, 'a 25-character Backblaze application key id'))
  r.require(env, 'B2_APPLICATION_KEY', rules.pattern(/^[0-9A-Za-z+/]{31}$/, 'a 31-character Backblaze application key'))
  r.require(env, 'B2_BUCKET_ID', rules.pattern(/^[0-9a-f]{24}$/, 'a 24-character Backblaze bucket id'))
  r.require(env, 'B2_BUCKET_NAME', rules.pattern(/^[A-Za-z0-9-]{6,63}$/, 'a Backblaze bucket name'))
  r.optional(env, 'B2_PREFIX', rules.pattern(/^[a-z0-9._/-]+\/$/i, 'a folder ending in /'))
  r.require(env, 'FILE_SIGNING_SECRET', (v) =>
    v === 'dev-only-signing-secret' || /^test-/.test(v) ? 'is a development value' : v.length < 64 ? 'must be at least 64 characters' : null,
  )

  r.require(env, 'OPENAI_API_KEY', rules.pattern(/^sk-[0-9A-Za-z_-]{20,}$/, 'an OpenAI API key (sk-…)'))
  r.optional(env, 'TURNSTILE_SECRET', rules.pattern(/^0x[0-9A-Za-z_-]{20,}$/, 'a Cloudflare Turnstile secret (0x…)'))
  if (!env.TURNSTILE_SECRET) r.warn('TURNSTILE_SECRET', 'not set, so forms run without a bot check')

  r.require(env, 'MAIL_USER', rules.email)
  r.require(env, 'MAIL_APP_PASSWORD', (v) => (/^[a-z]{16}$/i.test(v.replace(/\s+/g, '')) ? null : 'must be a 16-letter Google app password'))
  r.optional(env, 'MAIL_REPLY_TO', rules.email)
  r.optional(env, 'CONTACT_INBOX', rules.email)
  if (/^(1|true|yes|on)$/i.test(env.MAIL_DISABLED ?? '')) r.error('MAIL_DISABLED', 'must not be on in production')
  if (/^(0|false|no|off)$/i.test(env.CRON_ENABLED ?? '')) r.warn('CRON_ENABLED', 'scheduled publishing, deadlines and digests are off')
  r.optional(env, 'CV_PARSE_CONCURRENCY', rules.pattern(/^[1-9]\d?$/, 'a small positive number'))
  return r
}

async function checkRemote(webEnv) {
  const r = new Report('Live API')
  const base = (webEnv.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
  if (!isHttpsUrl(base)) {
    r.error('VITE_API_BASE_URL', 'cannot reach the API without a valid URL')
    return r
  }
  try {
    const res = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(10_000) })
    const body = res.ok ? await res.json() : null
    if (!body?.ok) r.error('health', `API did not report healthy (HTTP ${res.status})`)
    else {
      if (body.storage !== 'b2') r.error('storage', 'live API is not using Backblaze B2')
      if (typeof body.turnstile === 'boolean' && body.turnstile !== Boolean(webEnv.VITE_TURNSTILE_SITE_KEY)) {
        r.error('VITE_TURNSTILE_SITE_KEY', body.turnstile ? 'live API requires a bot check but the website has no site key' : 'website has a site key but the live API has no Turnstile secret')
      }
    }
  } catch (err) {
    r.error('health', `could not reach the API (${err.name === 'TimeoutError' ? 'timed out' : err.message})`)
  }
  return r
}

async function main() {
  const args = process.argv.slice(2)
  const reports = []
  if (args[0] === 'api') {
    const file = resolve(process.cwd(), args[1] ?? resolve(ROOT, 'apps/api/.env'))
    if (!existsSync(file)) {
      console.log(`✗ ${file} not found`)
      process.exit(1)
    }
    reports.push(checkApi(parseEnv(readFileSync(file, 'utf8'))))
  } else {
    const webEnv = loadViteEnv(resolve(ROOT, 'apps/web'))
    reports.push(checkWeb(webEnv), checkHr(loadViteEnv(resolve(ROOT, 'apps/hr-admin')), webEnv))
    if (args.includes('--remote')) reports.push(await checkRemote(webEnv))
  }
  const ok = reports.map((r) => r.print()).every(Boolean)
  if (!ok) {
    console.log('\nFix the variables above before deploying. Values are never printed.')
    process.exit(1)
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main()
