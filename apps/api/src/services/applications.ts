import { FieldValue } from 'firebase-admin/firestore'
import {
  APPLICATION_STATUS_LABELS,
  cvProfile,
  makeReferenceId,
  validateAnswers,
  yearInZone,
  type ApplicationStatus,
  type ApplicationSubmit,
  type ApplicationSubmitResponse,
  type CvBankQuery,
  type CvProfile,
  type EducationLevel,
  type FileRef,
  type Job,
} from '@dekko-isho/shared'
import { applicationReceived, talentPoolAcknowledgement } from '../email/templates.js'
import { config } from '../config.js'
import { firestore, nowIso } from '../lib/firebase.js'
import { badRequest, notFound, parse } from '../lib/http.js'
import { logger } from '../lib/logger.js'
import { toE164 } from '../lib/phone.js'
import { safeFileName, storage, storageKeys } from '../lib/storage.js'
import { normaliseProfile } from './cv/extract.js'
import { applicationsForCandidate, indexApplication, patchIndex, searchCvBank, type ApplicationDoc } from './cvbank.js'
import { bumpApplications, jobStore } from './jobs.js'
import { lookups } from './lookups.js'
import { mailCtx, sendMail } from './mail.js'
import type { UploadDoc } from './uploads.js'

const db = () => firestore()

async function nextReferenceId(talentPool: boolean): Promise<string> {
  const year = yearInZone(config.timezone)
  const counterId = talentPool ? `talentPool-${year}` : `applications-${year}`
  const ref = db().collection('counters').doc(counterId)
  const seq = await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref)
    const next = ((snap.exists ? (snap.get('value') as number) : 0) || 0) + 1
    tx.set(ref, { value: next, updatedAt: nowIso() })
    return next
  })
  return makeReferenceId(talentPool ? 'DIG-TP' : 'DIG', seq, year)
}

/** Atomically moves pending uploads to `claimed` so a double-submit can't attach the same files twice. */
async function claimUploads(ids: string[]): Promise<string | null> {
  return db().runTransaction(async (tx) => {
    const refs = ids.map((id) => db().collection('uploads').doc(id))
    const snaps = await Promise.all(refs.map((r) => tx.get(r)))
    const taken = snaps.find((s) => (s.data() as UploadDoc | undefined)?.status !== 'pending')
    if (taken) return taken.id
    for (const r of refs) tx.update(r, { status: 'claimed' })
    return null
  })
}

async function findOrCreateCandidate(email: string, phoneE164: string | null, fullName: string): Promise<string> {
  const candidates = db().collection('candidates')
  let snap = await candidates.where('email', '==', email).limit(1).get()
  if (snap.empty && phoneE164) snap = await candidates.where('phoneE164', '==', phoneE164).limit(1).get()
  if (!snap.empty) return snap.docs[0].id
  const ref = candidates.doc()
  await ref.set({ email, phoneE164, fullName, createdAt: nowIso(), updatedAt: nowIso(), applicationIds: [] })
  return ref.id
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

export async function submitApplication(input: ApplicationSubmit): Promise<ApplicationSubmitResponse> {
  const job = jobStore.get(input.jobId)
  if (!job || job.status !== 'published') throw badRequest('This role is no longer accepting applications')
  if (job.deadline && Date.parse(job.deadline) < Date.now()) throw badRequest('The deadline for this role has passed')
  const formVersion = jobStore.form(input.formVersionId)
  if (!formVersion || formVersion.jobId !== job.id) throw badRequest('This form has been updated. Please refresh the page and try again')

  const uploadRef = db().collection('uploads').doc(input.uploadId)
  const uploadSnap = await uploadRef.get()
  const upload = uploadSnap.data() as UploadDoc | undefined
  if (!upload || upload.kind !== 'cv' || upload.status !== 'pending') throw badRequest('Please upload your CV again', { fields: { cv: 'Please upload your CV again' } })

  const validation = validateAnswers(formVersion.schema, input.answers)
  if (!validation.ok) throw badRequest('Please check the highlighted fields', { fields: validation.errors })
  const answers = validation.clean

  const fileFields = formVersion.schema.fields.filter((f) => f.type === 'file' && answers[f.key])
  const attachmentUploads = new Map<string, UploadDoc>()
  for (const f of fileFields) {
    const ref = answers[f.key] as FileRef
    const snap = await db().collection('uploads').doc(ref.uploadId).get()
    const data = snap.data() as UploadDoc | undefined
    if (!data || data.kind !== 'attachment' || data.status !== 'pending') throw badRequest('Please check the highlighted fields', { fields: { [f.key]: 'Please upload the file again' } })
    attachmentUploads.set(f.key, data)
  }

  const email = String(answers.email)
  const phoneRaw = String(answers.phone)
  const phoneE164 = toE164(phoneRaw)
  const fullName = String(answers.fullName)

  const attachmentIds = fileFields.map((f) => (answers[f.key] as FileRef).uploadId)
  const taken = await claimUploads([input.uploadId, ...attachmentIds])
  if (taken === input.uploadId) throw badRequest('Your application is already being sent', { fields: { cv: 'Please upload your CV again' } })
  if (taken) throw badRequest('Please check the highlighted fields')

  // Where each claimed upload's file currently lives, so a failure can hand it back as pending.
  const current = new Map<string, UploadDoc['object']>([[input.uploadId, upload.object]])
  for (const [key, data] of attachmentUploads) current.set((answers[key] as FileRef).uploadId, data.object)
  let committed = false
  try {
    const extractionSnap = await db().collection('cvExtractions').doc(input.uploadId).get()
    const extracted = normaliseProfile(extractionSnap.get('profile'))
    const cvText = String(extractionSnap.get('rawText') ?? '')

    const candidateId = await findOrCreateCandidate(email, phoneE164, fullName)
    const appRef = db().collection('applications').doc()
    const referenceId = await nextReferenceId(job.isTalentPool)

    const ext = upload.object.key.split('.').pop() ?? 'pdf'
    const cvObject = await storage().move(upload.object, storageKeys.candidateCv(candidateId, appRef.id, ext))
    current.set(input.uploadId, cvObject)
    const attachments: ApplicationDoc['attachments'] = {}
    for (const [key, data] of attachmentUploads) {
      const moved = await storage().move(data.object, storageKeys.attachment(candidateId, appRef.id, key, safeFileName(data.originalName)))
      current.set((answers[key] as FileRef).uploadId, moved)
      attachments[key] = { ...moved, originalName: data.originalName }
    }

    // Form answers win over what the CV said: the applicant reviewed them.
    const expYears = typeof answers.experienceYears === 'number' ? answers.experienceYears : extracted.totalExperienceYears
    const now = nowIso()
    const doc: ApplicationDoc = {
      jobId: job.id,
      jobTitle: job.title,
      candidateId,
      formVersionId: formVersion.id,
      uploadId: input.uploadId,
      referenceId,
      answers,
      cvFile: { ...cvObject, originalName: upload.originalName },
      attachments,
      status: 'new',
      source: job.isTalentPool ? 'talent_pool' : 'circular',
      tags: [],
      submittedAt: now,
      updatedAt: now,
      departmentId: job.departmentId,
      locationIds: job.locationIds,
      jobTypeId: job.jobTypeId,
      customFields: job.customFields,
      fullName,
      email,
      phoneE164,
      phoneRaw,
      city: str(answers.city) ?? extracted.location.city,
      expYears: expYears ?? null,
      eduLevel: extracted.highestEducationLevel,
      skills: extracted.skills,
      currentTitle: str(answers.currentTitle) ?? extracted.currentTitle,
      currentCompany: str(answers.currentCompany) ?? extracted.currentCompany,
      profile: extracted,
      profileEdited: false,
    }

    const batch = db().batch()
    batch.set(appRef, doc)
    batch.update(db().collection('candidates').doc(candidateId), {
      fullName,
      phoneE164: phoneE164 ?? FieldValue.delete(),
      latestProfile: extracted,
      latestApplicationAt: now,
      applicationIds: FieldValue.arrayUnion(appRef.id),
      updatedAt: now,
    })
    batch.update(uploadRef, { status: 'attached', applicationId: appRef.id, object: cvObject })
    for (const f of fileFields) {
      const ref = answers[f.key] as FileRef
      batch.update(db().collection('uploads').doc(ref.uploadId), { status: 'attached', applicationId: appRef.id, object: attachments[f.key] })
    }
    await batch.commit()
    committed = true

    indexApplication(appRef.id, doc, cvText)
    bumpApplications(job.id, { total: 1, fresh: 1 })
    sendConfirmation(job, doc)
    logger.info({ applicationId: appRef.id, referenceId, jobId: job.id }, 'application submitted')
    return { applicationId: appRef.id, referenceId }
  } catch (err) {
    if (!committed) {
      await Promise.all(
        [...current].map(([id, object]) =>
          db().collection('uploads').doc(id).update({ status: 'pending', object }).catch(() => undefined),
        ),
      )
    }
    throw err
  }
}

function sendConfirmation(job: Job, a: ApplicationDoc) {
  if (job.isTalentPool) {
    const interests = Array.isArray(a.answers.interestDepartments) ? (a.answers.interestDepartments as string[]).join(', ') : undefined
    sendMail(a.email, talentPoolAcknowledgement(mailCtx(), { applicantName: a.fullName, referenceId: a.referenceId, interests }), 'talent-pool-ack')
    return
  }
  sendMail(
    a.email,
    applicationReceived(mailCtx(), {
      applicantName: a.fullName,
      jobTitle: job.title,
      department: lookups.get('departments', job.departmentId)?.name,
      location: job.locationIds.map((id) => lookups.get('locations', id)?.name).filter(Boolean).join(', ') || undefined,
      jobType: lookups.get('jobTypes', job.jobTypeId)?.name,
      referenceId: a.referenceId,
      submittedAt: a.submittedAt,
    }),
    'application-received',
  )
}

// ── HR reads & updates ───────────────────────────────────────────────────────

export async function getApplication(id: string) {
  const snap = await db().collection('applications').doc(id).get()
  if (!snap.exists) throw notFound('Application not found')
  const a = snap.data() as ApplicationDoc
  const [notes, extraction] = await Promise.all([
    db().collection('applications').doc(id).collection('notes').orderBy('createdAt', 'desc').get(),
    db().collection('cvExtractions').doc(a.uploadId).get(),
  ])
  const form = jobStore.form(a.formVersionId)?.schema ?? { fields: [] }
  return {
    id,
    ...a,
    form,
    extraction: extraction.exists
      ? { status: extraction.get('status'), method: extraction.get('method'), model: extraction.get('model'), rawText: String(extraction.get('rawText') ?? '') }
      : null,
    notes: notes.docs.map((n) => ({ id: n.id, ...n.data() })),
    otherApplications: applicationsForCandidate(a.candidateId).filter((r) => r.applicationId !== id),
  }
}

export async function updateApplication(id: string, patch: { status?: ApplicationStatus; tags?: string[] }, by: { uid: string; name: string }) {
  const ref = db().collection('applications').doc(id)
  const snap = await ref.get()
  if (!snap.exists) throw notFound('Application not found')
  const a = snap.data() as ApplicationDoc
  const update: Partial<ApplicationDoc> = { updatedAt: nowIso() }
  if (patch.tags) update.tags = [...new Set(patch.tags)]
  if (patch.status && patch.status !== a.status) {
    update.status = patch.status
    await ref.collection('notes').add({
      kind: 'status',
      body: `Moved from ${APPLICATION_STATUS_LABELS[a.status]} to ${APPLICATION_STATUS_LABELS[patch.status]}`,
      authorUid: by.uid,
      authorName: by.name,
      createdAt: nowIso(),
    })
    if (a.status === 'new') bumpApplications(a.jobId, { fresh: -1 })
    if (patch.status === 'new') bumpApplications(a.jobId, { fresh: 1 })
  }
  await ref.update(update)
  patchIndex(id, { status: update.status ?? a.status, tags: update.tags ?? a.tags })
  return { ...a, ...update }
}

export async function addNote(id: string, body: string, by: { uid: string; name: string }) {
  const ref = db().collection('applications').doc(id)
  if (!(await ref.get()).exists) throw notFound('Application not found')
  const note = { kind: 'note', body, authorUid: by.uid, authorName: by.name, createdAt: nowIso() }
  const added = await ref.collection('notes').add(note)
  return { id: added.id, ...note }
}

export async function updateProfile(id: string, profileInput: unknown) {
  const ref = db().collection('applications').doc(id)
  const snap = await ref.get()
  if (!snap.exists) throw notFound('Application not found')
  const a = snap.data() as ApplicationDoc
  const profile: CvProfile = normaliseProfile(parse(cvProfile, profileInput))
  const update = {
    profile,
    profileEdited: true,
    skills: profile.skills,
    eduLevel: profile.highestEducationLevel as EducationLevel | null,
    expYears: profile.totalExperienceYears ?? a.expYears,
    city: profile.location.city ?? a.city,
    currentTitle: profile.currentTitle ?? a.currentTitle,
    currentCompany: profile.currentCompany ?? a.currentCompany,
    updatedAt: nowIso(),
  }
  await ref.update(update)
  const extraction = await db().collection('cvExtractions').doc(a.uploadId).get()
  indexApplication(id, { ...a, ...update }, String(extraction.get('rawText') ?? ''))
  return { ...a, ...update }
}

export async function cvDownloadUrl(id: string, attachmentKey?: string) {
  const snap = await db().collection('applications').doc(id).get()
  if (!snap.exists) throw notFound('Application not found')
  const a = snap.data() as ApplicationDoc
  const file = attachmentKey ? (Object.hasOwn(a.attachments, attachmentKey) ? a.attachments[attachmentKey] : undefined) : a.cvFile
  if (!file) throw notFound('File not found')
  const ext = file.key.split('.').pop()
  const name = attachmentKey ? file.originalName : `${safeFileName(a.fullName)}-${a.referenceId}.${ext}`
  return { url: await storage().signedUrl(file.key, 300, name), contentType: file.contentType, name }
}

export async function getCandidate(id: string) {
  const snap = await db().collection('candidates').doc(id).get()
  if (!snap.exists) throw notFound('Candidate not found')
  return { id, ...snap.data(), applications: applicationsForCandidate(id) }
}

// ── Export ───────────────────────────────────────────────────────────────────

function csvCell(v: unknown): string {
  let s = v == null ? '' : Array.isArray(v) ? v.join('; ') : String(v)
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d\s-]+$/.test(s)) s = `'${s}`
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportCvBankCsv(q: CvBankQuery): string {
  const { rows } = searchCvBank({ ...q, page: 1, pageSize: 200 }, { all: true })
  const header = ['Name', 'Email', 'Phone', 'Role', 'Department', 'Location', 'Status', 'Experience (years)', 'Education', 'Current title', 'Current company', 'City', 'Skills', 'Tags', 'Source', 'Submitted']
  const lines = rows.map((r) =>
    [
      r.fullName,
      r.email,
      r.phone,
      r.jobTitle,
      r.departmentName,
      r.locationNames,
      APPLICATION_STATUS_LABELS[r.status],
      r.expYears,
      r.eduLevel,
      r.currentTitle,
      r.currentCompany,
      r.city,
      r.skills,
      r.tags,
      r.source === 'talent_pool' ? 'Future roles' : 'Circular',
      r.submittedAt.slice(0, 10),
    ]
      .map(csvCell)
      .join(','),
  )
  return `\uFEFF${[header.join(','), ...lines].join('\r\n')}`
}
