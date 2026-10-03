import assert from 'node:assert/strict'
import { describe, it } from 'vitest'
import { config, productionConfigProblems, type AppConfig } from '../src/config.js'
import { phoneSearchDigits, toE164 } from '../src/lib/phone.js'
import { plainText, sanitizeDescription } from '../src/lib/sanitize.js'
import { safeFileName, signLocalToken, verifyLocalToken } from '../src/lib/storage.js'

describe('phone', () => {
  it('normalises local, +880 and 00880 formats', () => {
    for (const raw of ['01711223344', '+880 1711-223344', '008801711223344']) {
      assert.equal(toE164(raw), '+8801711223344', raw)
    }
  })
  it('rejects short or implausible numbers', () => {
    assert.equal(toE164('12345'), null)
    assert.equal(toE164(''), null)
  })
  it('reduces numbers to national digits for search', () => {
    assert.equal(phoneSearchDigits('+8801711223344'), '1711223344')
    assert.equal(phoneSearchDigits('01711223344'), '1711223344')
  })
})

describe('sanitizeDescription', () => {
  it('strips scripts, handlers and disallowed images', () => {
    const html = sanitizeDescription(
      '<h1>Role</h1><p onclick="x()">Hi<script>alert(1)</script></p><img src="https://evil.test/a.png"><img src="https://cdn.ok/b.png">',
      ['https://cdn.ok/'],
    )
    assert.ok(!html.includes('script'))
    assert.ok(!html.includes('onclick'))
    assert.ok(!html.includes('evil.test'))
    assert.ok(html.includes('https://cdn.ok/b.png'))
    assert.ok(html.startsWith('<h2>'))
  })
  it('opens links in a new tab safely', () => {
    const html = sanitizeDescription('<a href="https://x.test">x</a>', [])
    assert.ok(html.includes('rel="noopener noreferrer"'))
  })
  it('turns HTML into plain text', () => {
    assert.equal(plainText('<p>Hello</p>\n<p><b>world</b></p>'), 'Hello world')
  })
})

describe('storage helpers', () => {
  it('makes file names safe', () => {
    assert.equal(safeFileName('../../etc/passwd'), 'passwd')
    assert.equal(safeFileName('My CV (final).pdf'), 'My-CV-final-.pdf')
    assert.equal(safeFileName(''), 'file')
  })

  it('signs and verifies download tokens', () => {
    const token = signLocalToken('cv/a.pdf', 60, 'cv.pdf')
    assert.deepEqual(verifyLocalToken(token), { key: 'cv/a.pdf', downloadName: 'cv.pdf' })
  })

  it('rejects tampered and expired tokens', () => {
    const token = signLocalToken('cv/a.pdf', 60)
    const [payload, sig] = token.split('.')
    const forged = Buffer.from(JSON.stringify({ k: 'cv/other.pdf', e: Date.now() + 60000 })).toString('base64url')
    assert.equal(verifyLocalToken(`${forged}.${sig}`), null)
    assert.equal(verifyLocalToken(`${payload}.${sig[0] === 'x' ? 'y' : 'x'}${sig.slice(1)}`), null)
    assert.equal(verifyLocalToken(signLocalToken('cv/a.pdf', -1)), null)
  })
})

describe('production config guard', () => {
  const prod = (patch: { secret?: string; driver?: 'b2' | 'local'; projectId?: string; b2?: Partial<AppConfig['storage']['b2']> } = {}): AppConfig => ({
    ...config,
    isProd: true,
    firebase: { ...config.firebase, projectId: patch.projectId ?? 'dekko-isho-group' },
    storage: {
      ...config.storage,
      driver: patch.driver ?? 'b2',
      signingSecret: patch.secret ?? 'a'.repeat(64),
      b2: { keyId: 'k', applicationKey: 'a', bucketId: 'b', bucketName: 'n', prefix: 'p/', ...patch.b2 },
    },
  })

  it('accepts a complete production config', () => {
    assert.deepEqual(productionConfigProblems(prod(), {}), [])
  })
  it('ignores non-production runs', () => {
    assert.deepEqual(productionConfigProblems(config, { FIRESTORE_EMULATOR_HOST: 'x' }), [])
  })
  it('flags dev defaults, emulators, demo projects and missing storage', () => {
    assert.equal(productionConfigProblems(prod({ secret: 'dev-only-signing-secret' }), {}).length, 1)
    assert.equal(productionConfigProblems(prod(), { FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099' }).length, 1)
    assert.equal(productionConfigProblems(prod({ projectId: 'demo-x' }), {}).length, 1)
    assert.equal(productionConfigProblems(prod({ driver: 'local' }), {}).length, 1)
    assert.equal(productionConfigProblems(prod({ b2: { bucketId: '' } }), {}).length, 1)
  })
})
