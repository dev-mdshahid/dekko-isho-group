import assert from 'node:assert/strict'
import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import { nextVersion } from './bump-version.mjs'
import { checkApi, checkHr, checkWeb, parseEnv } from './check-env.mjs'

describe('nextVersion', () => {
  it('bumps patch, minor and major', () => {
    assert.equal(nextVersion('1.0.9'), '1.0.10')
    assert.equal(nextVersion('1.4.2', 'minor'), '1.5.0')
    assert.equal(nextVersion('1.4.2', 'major'), '2.0.0')
  })
  it('rejects malformed versions and parts', () => {
    assert.throws(() => nextVersion('1.0'))
    assert.throws(() => nextVersion('1.0.0', 'huge'))
  })
})

describe('parseEnv', () => {
  it('handles comments, quotes, export and inline comments', () => {
    assert.deepEqual(parseEnv('# c\nA=1\nexport B="two words"\nC=\'x#y\'\nD=val # note\n\nnoequals'), { A: '1', B: 'two words', C: 'x#y', D: 'val' })
  })
})

const web = {
  FIREBASE_API_KEY: `AIza${'a'.repeat(35)}`,
  FIREBASE_AUTH_DOMAIN: 'dekko-isho-group.firebaseapp.com',
  FIREBASE_PROJECT_ID: 'dekko-isho-group',
  FIREBASE_STORAGE_BUCKET: 'dekko-isho-group.firebasestorage.app',
  FIREBASE_MESSAGING_SENDER_ID: '1234567890',
  FIREBASE_APP_ID: '1:1234567890:web:abc123',
  FIREBASE_MEASUREMENT_ID: 'G-ABC1234',
  SUSTAINABILITY_REPORT_2025_URL: 'https://drive.google.com/file/d/x/view',
  VITE_API_BASE_URL: 'https://hr.dekkoai.online',
  VITE_SHARE_BASE_URL: 'https://hr.dekkoai.online',
  VITE_TURNSTILE_SITE_KEY: `0x${'A'.repeat(22)}`,
}

describe('website + HR checks', () => {
  it('accepts a complete production env', () => {
    assert.deepEqual(checkWeb(web).errors, [])
    assert.deepEqual(checkHr({ VITE_API_BASE_URL: 'https://hr.dekkoai.online/' }, web).errors, [])
  })
  it('reports missing and malformed values by name only', () => {
    const r = checkWeb({ ...web, FIREBASE_API_KEY: 'short', VITE_API_BASE_URL: 'http://localhost:8794', FIREBASE_PROJECT_ID: '' })
    assert.deepEqual(r.errors.map((e) => e.split(':')[0]).sort(), ['FIREBASE_API_KEY', 'FIREBASE_PROJECT_ID', 'VITE_API_BASE_URL'])
    assert.ok(r.errors.every((e) => !e.includes('short') && !e.includes('localhost')))
  })
  it('warns when the bot check is off', () => {
    const r = checkWeb({ ...web, VITE_TURNSTILE_SITE_KEY: '' })
    assert.deepEqual(r.errors, [])
    assert.equal(r.warnings.length, 1)
  })
  it('blocks the emulator and a mismatched API in the HR build', () => {
    const r = checkHr({ VITE_API_BASE_URL: 'https://other.example.com', VITE_FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099' }, web)
    assert.equal(r.errors.length, 2)
  })
})

describe('API check', () => {
  const dir = mkdtempSync(join(tmpdir(), 'check-env-'))
  const sa = join(dir, 'sa.json')
  writeFileSync(sa, JSON.stringify({ type: 'service_account', project_id: 'dekko-isho-group', private_key: '-----BEGIN PRIVATE KEY-----\nx', client_email: 'api@dekko-isho-group.iam.gserviceaccount.com' }))
  chmodSync(sa, 0o600)
  const api = {
    NODE_ENV: 'production',
    PORT: '8794',
    HOST: '127.0.0.1',
    PUBLIC_SITE_URL: 'https://dekkoisho.com',
    HR_PORTAL_URL: 'https://dekkoisho.com/hr/admin',
    API_PUBLIC_URL: 'https://hr.dekkoai.online',
    CORS_ORIGINS: 'https://dekkoisho.com,https://www.dekkoisho.com',
    FIREBASE_PROJECT_ID: 'dekko-isho-group',
    GOOGLE_APPLICATION_CREDENTIALS: sa,
    STORAGE_DRIVER: 'b2',
    B2_KEY_ID: '0'.repeat(25),
    B2_APPLICATION_KEY: 'K'.repeat(31),
    B2_BUCKET_ID: 'a'.repeat(24),
    B2_BUCKET_NAME: 'dekko-files',
    B2_PREFIX: 'hr-main-website/',
    FILE_SIGNING_SECRET: 'f'.repeat(64),
    OPENAI_API_KEY: `sk-proj-${'x'.repeat(40)}`,
    TURNSTILE_SECRET: `0x${'B'.repeat(30)}`,
    MAIL_USER: 'careers@dekkoisho.com',
    MAIL_APP_PASSWORD: 'abcd efgh ijkl mnop',
    MAIL_DISABLED: 'false',
  }
  const keys = (env) => checkApi(env).errors.map((e) => e.split(':')[0])

  it('accepts a complete production env', () => {
    assert.deepEqual(checkApi(api).errors, [])
  })
  it('catches wrong-shaped credentials', () => {
    assert.deepEqual(keys({ ...api, OPENAI_API_KEY: 'abc', MAIL_APP_PASSWORD: 'tooshort', FILE_SIGNING_SECRET: 'dev-only-signing-secret', B2_KEY_ID: 'xyz' }).sort(), [
      'B2_KEY_ID',
      'FILE_SIGNING_SECRET',
      'MAIL_APP_PASSWORD',
      'OPENAI_API_KEY',
    ])
  })
  it('catches dev settings leaking into production', () => {
    assert.deepEqual(keys({ ...api, NODE_ENV: 'development', FIRESTORE_EMULATOR_HOST: 'localhost:8085', STORAGE_DRIVER: 'local', MAIL_DISABLED: 'true' }).sort(), [
      'FIRESTORE_EMULATOR_HOST',
      'MAIL_DISABLED',
      'NODE_ENV',
      'STORAGE_DRIVER',
    ])
  })
  it('checks the service account file and CORS', () => {
    assert.deepEqual(keys({ ...api, GOOGLE_APPLICATION_CREDENTIALS: join(dir, 'missing.json') }), ['GOOGLE_APPLICATION_CREDENTIALS'])
    const other = join(dir, 'other.json')
    writeFileSync(other, JSON.stringify({ type: 'service_account', project_id: 'someone-else' }))
    assert.deepEqual(keys({ ...api, GOOGLE_APPLICATION_CREDENTIALS: other }), ['GOOGLE_APPLICATION_CREDENTIALS'])
    assert.deepEqual(keys({ ...api, CORS_ORIGINS: 'https://www.dekkoisho.com' }), ['CORS_ORIGINS'])
  })
  it('reports every missing required key', () => {
    assert.ok(keys({}).length >= 15)
  })
})
