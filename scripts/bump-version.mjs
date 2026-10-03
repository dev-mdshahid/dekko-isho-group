#!/usr/bin/env node
/**
 * Bumps the release version in the root package.json (and its lockfile entry) and prints the new value.
 * The root version is the one shown in the website footer, the HR portal and the API health check.
 *
 *   node scripts/bump-version.mjs            patch: 1.0.3 → 1.0.4
 *   node scripts/bump-version.mjs minor      1.0.3 → 1.1.0
 *   node scripts/bump-version.mjs major      1.0.3 → 2.0.0
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function nextVersion(current, part = 'patch') {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(current)
  if (!m) throw new Error(`Version "${current}" is not in x.y.z form`)
  const [major, minor, patch] = m.slice(1).map(Number)
  if (part === 'major') return `${major + 1}.0.0`
  if (part === 'minor') return `${major}.${minor + 1}.0`
  if (part === 'patch') return `${major}.${minor}.${patch + 1}`
  throw new Error(`Unknown version part "${part}" (use patch, minor or major)`)
}

function rewrite(file, update) {
  const raw = readFileSync(file, 'utf8')
  const json = JSON.parse(raw)
  update(json)
  writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pkgFile = resolve(ROOT, 'package.json')
  const current = JSON.parse(readFileSync(pkgFile, 'utf8')).version
  const next = nextVersion(current, process.argv[2] ?? 'patch')
  rewrite(pkgFile, (p) => {
    p.version = next
  })
  const lockFile = resolve(ROOT, 'package-lock.json')
  if (existsSync(lockFile)) {
    rewrite(lockFile, (l) => {
      l.version = next
      if (l.packages?.['']) l.packages[''].version = next
    })
  }
  console.log(next)
}
