import mammoth from 'mammoth'
import OpenAI from 'openai'
import { PDFParse } from 'pdf-parse'
import sharp from 'sharp'
import { cvProfile, EDUCATION_LEVELS, EDUCATION_RANK, type CvProfile, type EducationLevel } from '@dekko-isho/shared'
import { config } from '../../config.js'
import { logger } from '../../lib/logger.js'
import { toE164 } from '../../lib/phone.js'

export const CV_PROMPT_VERSION = 'cv-v1'

export type CvExtraction = {
  status: 'succeeded' | 'failed'
  method: 'pdf-text' | 'docx' | 'doc' | 'vision' | 'none'
  rawText: string
  profile: CvProfile
  model: string | null
  promptVersion: string
  error: string | null
}

// ── Text extraction ──────────────────────────────────────────────────────────

function tidy(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function pdfText(buffer: Buffer): Promise<{ text: string; pages: number }> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  try {
    const result = await parser.getText()
    return { text: tidy(result.text ?? ''), pages: Math.max(1, result.total ?? 1) }
  } finally {
    await parser.destroy().catch(() => undefined)
  }
}

function legacyDocText(buffer: Buffer): string {
  const runs = buffer.toString('latin1').match(/[\x20-\x7e\n\r\t]{4,}/g) ?? []
  return tidy(runs.filter((r) => /[a-zA-Z]{3,}/.test(r)).join('\n'))
}

// ── LLM extraction ───────────────────────────────────────────────────────────

const S = { type: ['string', 'null'] }
const N = { type: ['number', 'null'] }
const I = { type: ['integer', 'null'] }
const obj = (properties: Record<string, unknown>) => ({
  type: 'object',
  additionalProperties: false,
  properties,
  required: Object.keys(properties),
})

const PROFILE_SCHEMA = obj({
  fullName: S,
  email: S,
  phone: S,
  location: obj({ city: S, country: S }),
  links: obj({ linkedin: S, portfolio: S, other: { type: 'array', items: { type: 'string' } } }),
  summary: S,
  currentTitle: S,
  currentCompany: S,
  totalExperienceYears: N,
  experience: {
    type: 'array',
    items: obj({ title: S, company: S, location: S, startDate: S, endDate: S, description: S }),
  },
  education: {
    type: 'array',
    items: obj({
      degree: S,
      level: { type: ['string', 'null'], enum: [...EDUCATION_LEVELS, null] },
      field: S,
      institution: S,
      startYear: I,
      endYear: I,
      result: S,
    }),
  },
  highestEducationLevel: { type: ['string', 'null'], enum: [...EDUCATION_LEVELS, null] },
  skills: { type: 'array', items: { type: 'string' } },
  languages: { type: 'array', items: { type: 'string' } },
  certifications: { type: 'array', items: obj({ name: S, issuer: S, year: I }) },
})

const VISION_SCHEMA = obj({ rawText: { type: 'string' }, profile: PROFILE_SCHEMA })

const SYSTEM_PROMPT = `You extract structured data from a job applicant's CV (résumé), often from Bangladesh.
Rules:
- Only use information present in the CV. Use null (or an empty array) when something is missing. Never invent data.
- If the document is blank, unreadable or not a CV, return an empty rawText and null/empty values everywhere. Never produce example or placeholder data.
- Dates: "YYYY-MM" when month is known, otherwise "YYYY". Use "present" for current roles.
- experience: most recent first. currentTitle/currentCompany = the most recent role.
- totalExperienceYears: total professional experience in years (one decimal), excluding overlaps and education.
- education level mapping: SSC/O-Level/Secondary → "SSC"; HSC/A-Level/Higher Secondary → "HSC"; Diploma/Polytechnic → "Diploma";
  BSc/BA/BBA/BCom/B.Tech/Honours/Bachelor → "Bachelor"; MSc/MA/MBA/MCom/Masters → "Master"; PhD/Doctorate → "PhD"; else "Other".
- highestEducationLevel: the highest level found.
- skills: concise skill names (tools, technologies, domain skills), max 30, no duplicates.
- phone: as written, keep country code if present. email: lowercase.
- location.city: where the candidate currently lives, if stated.`

let client: OpenAI | null = null
const openai = () => (client ??= new OpenAI({ apiKey: config.openai.apiKey, timeout: 60_000, maxRetries: 1 }))

async function llmFromText(text: string): Promise<{ profile: unknown; model: string }> {
  const model = config.openai.textModel
  const response = await openai().responses.create({
    model,
    store: config.openai.store,
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `CV text:\n\n${text.slice(0, 40_000)}` },
    ],
    text: { format: { type: 'json_schema', name: 'cv_profile', schema: PROFILE_SCHEMA, strict: true } },
  })
  return { profile: JSON.parse(response.output_text), model }
}

/** Transparent PNGs read as black-on-black to the model; flatten onto white, fix rotation, cap size. */
async function prepareImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer, { failOn: 'none' })
    .rotate()
    .flatten({ background: '#ffffff' })
    .resize({ width: 2000, height: 2800, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer()
}

async function llmFromFile(buffer: Buffer, mime: string, fileName: string): Promise<{ rawText: string; profile: unknown; model: string }> {
  const model = config.openai.visionModel
  const part =
    mime === 'application/pdf'
      ? ({ type: 'input_file', filename: fileName || 'cv.pdf', file_data: `data:application/pdf;base64,${buffer.toString('base64')}` } as const)
      : ({ type: 'input_image', image_url: `data:image/jpeg;base64,${(await prepareImage(buffer)).toString('base64')}`, detail: 'high' } as const)
  const response = await openai().responses.create({
    model,
    store: config.openai.store,
    input: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          part,
          { type: 'input_text', text: 'Transcribe the CV text into rawText (plain text, reading order), then extract the profile.' },
        ],
      },
    ],
    text: { format: { type: 'json_schema', name: 'cv_scan', schema: VISION_SCHEMA, strict: true } },
  })
  const parsed = JSON.parse(response.output_text) as { rawText: string; profile: unknown }
  return { ...parsed, model }
}

// ── Heuristic fallback (no OpenAI key, or the model failed) ──────────────────

function heuristicProfile(text: string): unknown {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null
  const phone = text.match(/(?:\+?88)?0?1[3-9]\d{2}[-\s]?\d{3}[-\s]?\d{3}/)?.[0] ?? text.match(/\+?\d[\d\s-]{8,}\d/)?.[0] ?? null
  const linkedin = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i)?.[0] ?? null
  const firstLine = text
    .split('\n')
    .map((l) => l.trim())
    .find((l) => /^[A-Za-z.\s'-]{4,60}$/.test(l) && l.split(/\s+/).length <= 5 && !/curriculum|resume|vitae|cv/i.test(l))
  return {
    fullName: firstLine ?? null,
    email: email?.toLowerCase() ?? null,
    phone,
    links: { linkedin, portfolio: null, other: [] },
  }
}

// ── Normalisation ────────────────────────────────────────────────────────────

function yearsFromExperience(profile: CvProfile): number | null {
  const spans = profile.experience
    .map((e) => {
      const start = e.startDate ? Date.parse(e.startDate.length === 4 ? `${e.startDate}-01` : e.startDate) : NaN
      const endRaw = e.endDate && !/present|current|now/i.test(e.endDate) ? e.endDate : null
      const end = endRaw ? Date.parse(endRaw.length === 4 ? `${endRaw}-12` : endRaw) : Date.now()
      return Number.isFinite(start) && Number.isFinite(end) && end > start ? [start, end] : null
    })
    .filter((x): x is number[] => x !== null)
    .sort((a, b) => a[0] - b[0])
  if (!spans.length) return null
  let total = 0
  let [curStart, curEnd] = spans[0]
  for (const [s, e] of spans.slice(1)) {
    if (s <= curEnd) curEnd = Math.max(curEnd, e)
    else {
      total += curEnd - curStart
      ;[curStart, curEnd] = [s, e]
    }
  }
  total += curEnd - curStart
  return Math.round((total / (365.25 * 24 * 3600 * 1000)) * 10) / 10
}

/** Drops only the top-level fields that fail validation, keeping the rest of what the CV said. */
function parseLeniently(input: unknown): CvProfile {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return cvProfile.parse({})
  const data: Record<string, unknown> = { ...(input as Record<string, unknown>) }
  for (let attempt = 0; attempt < 5; attempt++) {
    const result = cvProfile.safeParse(data)
    if (result.success) return result.data
    const bad = new Set(result.error.issues.map((i) => String(i.path[0] ?? '')))
    if (bad.has('')) break
    for (const key of bad) delete data[key]
  }
  return cvProfile.parse({})
}

export function normaliseProfile(input: unknown): CvProfile {
  const profile = parseLeniently(input)
  if (profile.fullName && profile.fullName === profile.fullName.toUpperCase()) {
    profile.fullName = profile.fullName.toLowerCase().replace(/(^|[\s.'-])(\p{L})/gu, (_m, sep: string, ch: string) => sep + ch.toUpperCase())
  }
  for (const key of ['linkedin', 'portfolio'] as const) {
    const url = profile.links[key]
    if (url && !/^https?:\/\//i.test(url)) profile.links[key] = `https://${url}`
  }
  if (profile.email) profile.email = profile.email.toLowerCase().trim()
  if (profile.phone) profile.phone = toE164(profile.phone) ?? profile.phone
  profile.skills = [...new Set(profile.skills.map((s) => s.trim()).filter(Boolean))].slice(0, 40)
  if (!profile.highestEducationLevel && profile.education.length) {
    const best = profile.education
      .map((e) => e.level)
      .filter((l): l is EducationLevel => l !== null)
      .sort((a, b) => EDUCATION_RANK[b] - EDUCATION_RANK[a])[0]
    profile.highestEducationLevel = best ?? null
  }
  if (profile.totalExperienceYears == null) profile.totalExperienceYears = yearsFromExperience(profile)
  return profile
}

/** Drops identity fields the model returned that don't appear in the document text. */
export function groundProfile(profile: CvProfile, rawText: string): CvProfile {
  const text = rawText.toLowerCase()
  const digits = rawText.replace(/\D/g, '')
  if (profile.email && !text.includes(profile.email.toLowerCase())) profile.email = null
  if (profile.phone && !digits.includes(profile.phone.replace(/\D/g, '').slice(-8))) profile.phone = null
  if (profile.fullName) {
    const parts = profile.fullName.toLowerCase().split(/\s+/).filter((p) => p.length > 1)
    if (!parts.some((p) => text.includes(p))) profile.fullName = null
  }
  return profile
}

export async function extractCv(buffer: Buffer, mime: string, fileName: string): Promise<CvExtraction> {
  const base = { promptVersion: CV_PROMPT_VERSION, error: null as string | null }
  let method: CvExtraction['method'] = 'none'
  let rawText = ''
  let needsVision = false

  try {
    if (mime === 'application/pdf') {
      const { text, pages } = await pdfText(buffer)
      method = 'pdf-text'
      rawText = text
      needsVision = text.length < 120 || text.length / pages < 50
    } else if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      method = 'docx'
      rawText = tidy((await mammoth.extractRawText({ buffer })).value)
    } else if (mime === 'application/msword') {
      method = 'doc'
      rawText = legacyDocText(buffer)
    } else if (mime.startsWith('image/')) {
      needsVision = true
    }
  } catch (err) {
    logger.warn({ err, mime }, 'cv text extraction failed')
    needsVision = mime === 'application/pdf'
  }

  if (!config.openai.apiKey) {
    const ok = rawText.length > 50
    return { ...base, status: ok ? 'succeeded' : 'failed', method, rawText, profile: normaliseProfile(heuristicProfile(rawText)), model: null, error: ok ? null : 'no_text' }
  }

  try {
    if (needsVision) {
      const result = await llmFromFile(buffer, mime, fileName)
      const text = tidy(result.rawText)
      if (text.length < 50) {
        return { ...base, status: 'failed', method: 'vision', rawText: text, profile: normaliseProfile({}), model: result.model, error: 'unreadable' }
      }
      return { ...base, status: 'succeeded', method: 'vision', rawText: text, profile: groundProfile(normaliseProfile(result.profile), text), model: result.model }
    }
    if (rawText.length < 50) {
      return { ...base, status: 'failed', method, rawText, profile: normaliseProfile({}), model: null, error: 'no_text' }
    }
    const result = await llmFromText(rawText)
    return { ...base, status: 'succeeded', method, rawText, profile: groundProfile(normaliseProfile(result.profile), rawText), model: result.model }
  } catch (err) {
    logger.error({ err, method }, 'cv llm extraction failed')
    return {
      ...base,
      status: rawText.length > 50 ? 'succeeded' : 'failed',
      method,
      rawText,
      profile: normaliseProfile(heuristicProfile(rawText)),
      model: null,
      error: 'llm_failed',
    }
  }
}
