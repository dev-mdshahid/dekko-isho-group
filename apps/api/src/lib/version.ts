import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** The monorepo root package.json version (bumped on every deploy). Works from src/ and dist/. */
function readVersion(): string {
  let dir = dirname(fileURLToPath(import.meta.url))
  for (let i = 0; i < 6; i++) {
    const file = join(dir, 'package.json')
    if (existsSync(file)) {
      const pkg = JSON.parse(readFileSync(file, 'utf8')) as { version?: string; workspaces?: unknown }
      if (pkg.workspaces && pkg.version) return pkg.version
    }
    dir = dirname(dir)
  }
  return '0.0.0'
}

export const APP_VERSION = readVersion()
