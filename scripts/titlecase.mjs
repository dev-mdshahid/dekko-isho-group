import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(import.meta.dirname, '..')
const APPLY = process.argv.includes('--apply')

// Articles, coordinating conjunctions and short prepositions stay lowercase
// unless they open or close the title (or follow a colon/dash).
const MINOR = new Set([
  'a', 'an', 'the',
  'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'as',
  'at', 'by', 'in', 'of', 'off', 'on', 'out', 'per', 'to', 'up', 'via', 'vs',
  'from', 'into', 'onto', 'over', 'upon', 'with',
])

// Proper nouns and official names that must keep their own casing.
const SKIP = new Set([
  'Lub-rref BD Ltd.',
  'Good Health and Well-being',
  'Fashion Is Constantly Evolving and So Are We',
])

const LETTER = /[A-Za-z]/
const SEGMENT_END = /[:;!?—–]["'”’)]?$/

function isProtected(core) {
  // Acronyms, numerals, brand casing and mixed case are left untouched.
  if (/\d/.test(core)) return true
  const letters = core.replace(/[^A-Za-z]/g, '')
  if (!letters) return true
  if (letters.length > 1 && letters === letters.toUpperCase()) return true
  return /[A-Z]/.test(letters.slice(1))
}

function capitalize(core) {
  const idx = core.search(LETTER)
  if (idx === -1) return core
  return core.slice(0, idx) + core[idx].toUpperCase() + core.slice(idx + 1)
}

function transformCore(core, { isFirst, isLast }) {
  if (isProtected(core)) return core
  if (core.includes('-')) {
    const parts = core.split('-')
    return parts
      .map((part, i) => {
        if (isProtected(part)) return part
        const first = isFirst && i === 0
        const last = isLast && i === parts.length - 1
        if (!first && !last && MINOR.has(part.toLowerCase())) return part.toLowerCase()
        return capitalize(part)
      })
      .join('-')
  }
  if (!isFirst && !isLast && MINOR.has(core.toLowerCase())) return core.toLowerCase()
  return capitalize(core)
}

export function toTitleCase(value) {
  const tokens = value.split(/(\s+)/)
  const wordIndexes = tokens.flatMap((token, i) => (LETTER.test(token) ? [i] : []))
  if (!wordIndexes.length) return value
  const lastWordIndex = wordIndexes[wordIndexes.length - 1]

  let startsSegment = true
  const out = tokens.map((token, i) => {
    if (!LETTER.test(token)) return token
    const isFirst = startsSegment
    const isLast = i === lastWordIndex
    startsSegment = SEGMENT_END.test(token)
    const [, lead, core, trail] = token.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/s)
    return lead + transformCore(core, { isFirst, isLast }) + trail
  })
  return out.join('')
}

function shouldSkip(value) {
  if (SKIP.has(value)) return true
  if (value.trim().startsWith('"')) return true // pull quotes, not titles
  if (value.trim().split(/\s+/).length > 14) return true // sentences, not titles
  return false
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue
      walk(full, files)
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(full)
    }
  }
  return files
}

const KEYS =
  /(\b(?:title|heading|headline|badge|snapshotHeadline|governanceTitle|traceabilityTitle|standardsTitle)\s*:\s*)('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g

function main() {
  const changes = []
  for (const file of walk(path.join(ROOT, 'src'))) {
    const source = readFileSync(file, 'utf8')
    const updated = source.replace(KEYS, (whole, prefix, literal) => {
      const quote = literal[0]
      const decoded = literal.slice(1, -1).replace(/\\'/g, "'").replace(/\\"/g, '"')
      if (shouldSkip(decoded)) return whole
      const next = toTitleCase(decoded)
      if (next === decoded) return whole
      changes.push({ file: path.relative(ROOT, file), from: decoded, to: next })
      const encoded = quote === "'" ? next.replace(/'/g, "\\'") : next.replace(/"/g, '\\"')
      return prefix + quote + encoded + quote
    })
    if (APPLY && updated !== source) writeFileSync(file, updated)
  }

  for (const change of changes) {
    console.log(`${change.file}\n  - ${change.from}\n  + ${change.to}`)
  }
  console.log(`\n${changes.length} title${changes.length === 1 ? '' : 's'} ${APPLY ? 'updated' : 'would change'}`)
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
if (isDirectRun) main()
