import { createHash, createHmac, timingSafeEqual } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import { config } from '../config.js'
import { logger } from './logger.js'

export type StoredObject = { key: string; fileId: string | null; contentType: string; size: number }

export interface Storage {
  readonly driver: 'b2' | 'local'
  put(key: string, body: Buffer, contentType: string): Promise<StoredObject>
  get(key: string): Promise<{ body: Buffer; contentType: string }>
  move(from: StoredObject, toKey: string): Promise<StoredObject>
  delete(key: string, fileId?: string | null): Promise<void>
  /** Short-lived download link. `downloadName` sets the file name the browser shows. */
  signedUrl(key: string, seconds: number, downloadName?: string): Promise<string>
}

function assertSafeKey(key: string) {
  if (!key || key.startsWith('/') || key.includes('..') || key.includes('\\')) {
    throw new Error(`Unsafe storage key: ${key}`)
  }
}

function contentDisposition(downloadName?: string) {
  if (!downloadName) return undefined
  const safe = downloadName.replace(/["\r\n]/g, '').slice(0, 150)
  return `inline; filename="${safe.replace(/[^\x20-\x7e]/g, '_')}"; filename*=UTF-8''${encodeURIComponent(safe)}`
}

// ── Backblaze B2 (native API) ────────────────────────────────────────────────

type B2Auth = { apiUrl: string; downloadUrl: string; token: string; expiresAt: number }

export class B2Storage implements Storage {
  readonly driver = 'b2' as const
  private auth: B2Auth | null = null

  constructor(private cfg: typeof config.storage.b2 = config.storage.b2) {}

  private full(key: string) {
    assertSafeKey(key)
    return `${this.cfg.prefix}${key}`
  }

  private encodeName(name: string) {
    return name.split('/').map(encodeURIComponent).join('/')
  }

  private async authorize(force = false): Promise<B2Auth> {
    if (!force && this.auth && this.auth.expiresAt > Date.now()) return this.auth
    const basic = Buffer.from(`${this.cfg.keyId}:${this.cfg.applicationKey}`).toString('base64')
    const res = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
      headers: { Authorization: `Basic ${basic}` },
    })
    if (!res.ok) throw new Error(`B2 authorize failed (${res.status}): ${await res.text()}`)
    const data = (await res.json()) as {
      authorizationToken: string
      apiInfo: { storageApi: { apiUrl: string; downloadUrl: string } }
    }
    this.auth = {
      apiUrl: data.apiInfo.storageApi.apiUrl,
      downloadUrl: data.apiInfo.storageApi.downloadUrl,
      token: data.authorizationToken,
      expiresAt: Date.now() + 20 * 60 * 60 * 1000,
    }
    return this.auth
  }

  private async call<T>(op: string, body: Record<string, unknown>, retry = true): Promise<T> {
    const auth = await this.authorize()
    const res = await fetch(`${auth.apiUrl}/b2api/v3/${op}`, {
      method: 'POST',
      headers: { Authorization: auth.token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 401 && retry) {
      await this.authorize(true)
      return this.call<T>(op, body, false)
    }
    if (!res.ok) throw new Error(`B2 ${op} failed (${res.status}): ${await res.text()}`)
    return (await res.json()) as T
  }

  async put(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    const fileName = this.full(key)
    const sha1 = createHash('sha1').update(body).digest('hex')
    for (let attempt = 0; attempt < 3; attempt++) {
      const upload = await this.call<{ uploadUrl: string; authorizationToken: string }>('b2_get_upload_url', {
        bucketId: this.cfg.bucketId,
      })
      const res = await fetch(upload.uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: upload.authorizationToken,
          'X-Bz-File-Name': this.encodeName(fileName),
          'Content-Type': contentType || 'b2/x-auto',
          'Content-Length': String(body.length),
          'X-Bz-Content-Sha1': sha1,
        },
        body: new Uint8Array(body),
      })
      if (res.ok) {
        const data = (await res.json()) as { fileId: string }
        return { key, fileId: data.fileId, contentType, size: body.length }
      }
      if (res.status !== 503 && res.status !== 408 && res.status !== 401) {
        throw new Error(`B2 upload failed (${res.status}): ${await res.text()}`)
      }
      logger.warn({ status: res.status, attempt }, 'B2 upload retry')
    }
    throw new Error('B2 upload failed after retries')
  }

  async get(key: string) {
    const auth = await this.authorize()
    const res = await fetch(`${auth.downloadUrl}/file/${this.cfg.bucketName}/${this.encodeName(this.full(key))}`, {
      headers: { Authorization: auth.token },
    })
    if (!res.ok) throw new Error(`B2 download failed (${res.status})`)
    return { body: Buffer.from(await res.arrayBuffer()), contentType: res.headers.get('content-type') || 'application/octet-stream' }
  }

  async move(from: StoredObject, toKey: string): Promise<StoredObject> {
    if (!from.fileId) throw new Error('B2 move needs the source fileId')
    const copied = await this.call<{ fileId: string }>('b2_copy_file', {
      sourceFileId: from.fileId,
      fileName: this.full(toKey),
    })
    await this.call('b2_delete_file_version', { fileName: this.full(from.key), fileId: from.fileId }).catch((err) =>
      logger.warn({ err, key: from.key }, 'B2 delete after copy failed'),
    )
    return { ...from, key: toKey, fileId: copied.fileId }
  }

  async delete(key: string, fileId?: string | null) {
    const fileName = this.full(key)
    if (fileId) {
      await this.call('b2_delete_file_version', { fileName, fileId })
      return
    }
    const versions = await this.call<{ files: Array<{ fileId: string; fileName: string }> }>('b2_list_file_versions', {
      bucketId: this.cfg.bucketId,
      startFileName: fileName,
      prefix: fileName,
      maxFileCount: 100,
    })
    for (const file of versions.files.filter((f) => f.fileName === fileName)) {
      await this.call('b2_delete_file_version', { fileName, fileId: file.fileId })
    }
  }

  async signedUrl(key: string, seconds: number, downloadName?: string) {
    const auth = await this.authorize()
    const fileName = this.full(key)
    const disposition = contentDisposition(downloadName)
    const data = await this.call<{ authorizationToken: string }>('b2_get_download_authorization', {
      bucketId: this.cfg.bucketId,
      fileNamePrefix: fileName,
      validDurationInSeconds: Math.max(1, Math.min(seconds, 3600)),
      ...(disposition ? { b2ContentDisposition: disposition } : {}),
    })
    const qs = new URLSearchParams({ Authorization: data.authorizationToken })
    if (disposition) qs.set('b2ContentDisposition', disposition)
    return `${auth.downloadUrl}/file/${this.cfg.bucketName}/${this.encodeName(fileName)}?${qs}`
  }
}

// ── Local disk (development) ─────────────────────────────────────────────────

class LocalStorage implements Storage {
  readonly driver = 'local' as const
  private root = resolve(config.storage.localDir)

  private path(key: string) {
    assertSafeKey(key)
    const full = resolve(this.root, config.storage.b2.prefix, key)
    if (!full.startsWith(this.root + sep)) throw new Error('Path escapes storage root')
    return full
  }

  async put(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    const file = this.path(key)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, body)
    await writeFile(`${file}.meta.json`, JSON.stringify({ contentType }))
    return { key, fileId: null, contentType, size: body.length }
  }

  async get(key: string) {
    const file = this.path(key)
    const body = await readFile(file)
    const meta = JSON.parse(await readFile(`${file}.meta.json`, 'utf8').catch(() => '{}')) as { contentType?: string }
    return { body, contentType: meta.contentType || 'application/octet-stream' }
  }

  async move(from: StoredObject, toKey: string): Promise<StoredObject> {
    const src = this.path(from.key)
    const dest = this.path(toKey)
    await mkdir(dirname(dest), { recursive: true })
    await rename(src, dest)
    await rename(`${src}.meta.json`, `${dest}.meta.json`).catch(() => undefined)
    return { ...from, key: toKey }
  }

  async delete(key: string) {
    const file = this.path(key)
    await rm(file, { force: true })
    await rm(`${file}.meta.json`, { force: true })
  }

  async signedUrl(key: string, seconds: number, downloadName?: string) {
    return `${config.apiPublicUrl}/api/files/${signLocalToken(key, seconds, downloadName)}`
  }
}

function hmac(data: string) {
  return createHmac('sha256', config.storage.signingSecret).update(data).digest('base64url')
}

export function signLocalToken(key: string, seconds: number, downloadName?: string) {
  const payload = Buffer.from(JSON.stringify({ k: key, e: Date.now() + seconds * 1000, n: downloadName })).toString('base64url')
  return `${payload}.${hmac(payload)}`
}

export function verifyLocalToken(token: string): { key: string; downloadName?: string } | null {
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = hmac(payload)
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { k: string; e: number; n?: string }
  if (data.e < Date.now()) return null
  return { key: data.k, downloadName: data.n }
}

let instance: Storage | undefined

export function storage(): Storage {
  if (instance) return instance
  if (config.storage.driver === 'b2') {
    const { keyId, applicationKey, bucketId, bucketName } = config.storage.b2
    if (!keyId || !applicationKey || !bucketId || !bucketName) {
      throw new Error('STORAGE_DRIVER=b2 needs B2_KEY_ID, B2_APPLICATION_KEY, B2_BUCKET_ID and B2_BUCKET_NAME')
    }
    instance = new B2Storage()
  } else {
    instance = new LocalStorage()
  }
  logger.info({ driver: instance.driver, prefix: config.storage.b2.prefix }, 'storage ready')
  return instance
}

export const storageKeys = {
  pendingCv: (uploadId: string, ext: string, d = new Date()) =>
    `cv/pending/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${uploadId}.${ext}`,
  pendingAttachment: (uploadId: string, ext: string, d = new Date()) =>
    `attachments/pending/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${uploadId}.${ext}`,
  candidateCv: (candidateId: string, applicationId: string, ext: string) =>
    `cv/candidates/${candidateId}/${applicationId}/cv.${ext}`,
  attachment: (candidateId: string, applicationId: string, fieldKey: string, safeName: string) =>
    `attachments/${candidateId}/${applicationId}/${fieldKey}/${safeName}`,
  circularImage: (jobId: string, imageId: string, ext: string) => `circulars/${jobId}/images/${imageId}.${ext}`,
}

export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'file'
  return base
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100) || 'file'
}

export function joinKey(...parts: string[]) {
  return join(...parts).split(sep).join('/')
}
