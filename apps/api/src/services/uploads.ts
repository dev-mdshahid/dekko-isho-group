import { createHash, randomUUID } from 'node:crypto'
import { fileTypeFromBuffer } from 'file-type'
import { ATTACHMENT_MAX_BYTES, CV_MAX_BYTES, type CvUploadResponse, type Job } from '@dekko-isho/shared'
import { config } from '../config.js'
import { firestore, nowIso } from '../lib/firebase.js'
import { badRequest } from '../lib/http.js'
import { createLimiter } from '../lib/limit.js'
import { logger } from '../lib/logger.js'
import { storage, storageKeys, type StoredObject } from '../lib/storage.js'
import { buildAutofill } from './cv/autofill.js'
import { extractCv } from './cv/extract.js'

const limit = createLimiter(config.cvParseConcurrency)

const ALLOWED: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/msword': 'doc',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

export type UploadDoc = {
  kind: 'cv' | 'attachment'
  status: 'pending' | 'claimed' | 'attached'
  jobId: string | null
  object: StoredObject
  originalName: string
  sha256: string
  ip: string | null
  createdAt: string
  applicationId: string | null
  extractionStatus?: 'succeeded' | 'failed'
}

/** Detects the real file type from its bytes, not the extension. */
async function detect(buffer: Buffer, originalName: string): Promise<{ mime: string; ext: string }> {
  const ft = await fileTypeFromBuffer(buffer)
  let mime = ft?.mime as string | undefined
  if (mime === 'application/x-cfb' && /\.doc$/i.test(originalName)) mime = 'application/msword'
  if (!mime || !ALLOWED[mime]) {
    throw badRequest('Please upload a PDF, Word document (.doc, .docx), JPG or PNG file')
  }
  return { mime, ext: ALLOWED[mime] }
}

export async function uploadCv(params: { buffer: Buffer; originalName: string; ip?: string; job: Job | null }): Promise<CvUploadResponse> {
  const { buffer, originalName, job } = params
  if (buffer.length > CV_MAX_BYTES) throw badRequest('Your CV is larger than 10 MB. Please upload a smaller file')
  if (buffer.length < 200) throw badRequest('This file looks empty. Please upload your CV again')
  const { mime, ext } = await detect(buffer, originalName)

  const uploadId = randomUUID()
  const object = await storage().put(storageKeys.pendingCv(uploadId, ext), buffer, mime)
  const db = firestore()
  const doc: UploadDoc = {
    kind: 'cv',
    status: 'pending',
    jobId: job?.id ?? null,
    object,
    originalName: originalName.slice(0, 200),
    sha256: createHash('sha256').update(buffer).digest('hex'),
    ip: params.ip ?? null,
    createdAt: nowIso(),
    applicationId: null,
  }
  await db.collection('uploads').doc(uploadId).set(doc)

  const extraction = await limit(() => extractCv(buffer, mime, originalName))
  await Promise.all([
    db.collection('cvExtractions').doc(uploadId).set({ ...extraction, createdAt: nowIso() }),
    db.collection('uploads').doc(uploadId).update({ extractionStatus: extraction.status }),
  ])
  logger.info({ uploadId, method: extraction.method, status: extraction.status, model: extraction.model }, 'cv processed')

  return {
    uploadId,
    fileName: originalName,
    status: extraction.status,
    autofill: job ? buildAutofill(job.form, extraction.profile) : {},
  }
}

export async function uploadAttachment(params: { buffer: Buffer; originalName: string; ip?: string; jobId: string | null }) {
  if (params.buffer.length > ATTACHMENT_MAX_BYTES) throw badRequest('Files must be 10 MB or smaller')
  const { mime, ext } = await detect(params.buffer, params.originalName)
  const uploadId = randomUUID()
  const object = await storage().put(storageKeys.pendingAttachment(uploadId, ext), params.buffer, mime)
  const doc: UploadDoc = {
    kind: 'attachment',
    status: 'pending',
    jobId: params.jobId,
    object,
    originalName: params.originalName.slice(0, 200),
    sha256: createHash('sha256').update(params.buffer).digest('hex'),
    ip: params.ip ?? null,
    createdAt: nowIso(),
    applicationId: null,
  }
  await firestore().collection('uploads').doc(uploadId).set(doc)
  return { uploadId, name: params.originalName }
}

/** Removes uploads that were never attached to an application (older than 24 hours). */
export async function cleanupPendingUploads(): Promise<number> {
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  const db = firestore()
  const snap = await db.collection('uploads').where('status', '==', 'pending').where('createdAt', '<', cutoff).limit(200).get()
  for (const doc of snap.docs) {
    const data = doc.data() as UploadDoc
    await storage()
      .delete(data.object.key, data.object.fileId)
      .catch((err) => logger.warn({ err, key: data.object.key }, 'pending file delete failed'))
    await Promise.all([doc.ref.delete(), db.collection('cvExtractions').doc(doc.id).delete()])
  }
  if (snap.size) logger.info({ removed: snap.size }, 'pending uploads cleaned')
  return snap.size
}
