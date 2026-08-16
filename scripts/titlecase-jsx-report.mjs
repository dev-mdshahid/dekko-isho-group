import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { toTitleCase } from './titlecase.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.')) continue
      walk(full, files)
    } else if (/\.tsx$/.test(entry)) {
      files.push(full)
    }
  }
  return files
}

const HEADING = /<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g
const PROP = /(?:title|heading|label)=(")([^"]*)"/g

for (const file of walk(path.join(ROOT, 'src'))) {
  const source = readFileSync(file, 'utf8')
  const rel = path.relative(ROOT, file)
  const lineOf = (index) => source.slice(0, index).split('\n').length

  for (const match of source.matchAll(HEADING)) {
    const text = match[2]
      .replace(/<[^>]*>/g, '')
      .replace(/\{'\s*'\}/g, ' ')
      .replace(/\{[^{}]*\}/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&apos;/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
    if (!text || !/[A-Za-z]/.test(text)) continue
    const next = toTitleCase(text)
    const flag = next === text ? 'ok  ' : 'FIX '
    console.log(`${flag}${rel}:${lineOf(match.index)}\n     ${text}${next === text ? '' : `\n  -> ${next}`}`)
  }

  for (const match of source.matchAll(PROP)) {
    const text = match[2].trim()
    if (!text || !/[A-Za-z]/.test(text)) continue
    const next = toTitleCase(text)
    if (next === text) continue
    console.log(`PROP ${rel}:${lineOf(match.index)}\n     ${text}\n  -> ${next}`)
  }
}
