import { beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { defaultApplicationForm, type FormField } from '@dekko-isho/shared'
import { config } from '../../src/config.js'
import { firestore } from '../../src/lib/firebase.js'
import { closingSoon, sendDailyDigest, startCron, stopCron } from '../../src/services/cron.js'
import { jobStore } from '../../src/services/jobs.js'
import { cleanupPendingUploads } from '../../src/services/uploads.js'
import { sendMail } from '../../src/services/mail.js'
import { bearer, bootApp, cvPdf, publishedJob, staffToken, type Ids } from '../helpers.js'

vi.mock('../../src/services/mail.js', async (original) => ({ ...(await original<object>()), sendMail: vi.fn() }))

let app: Express
let ids: Ids
let admin: { token: string; uid: string }
let job: Awaited<ReturnType<typeof publishedJob>>

const pngBytes = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d4944415478da63f8ffff3f0005fe02fea7d6a1c40000000049454e44ae426082', 'hex')

beforeAll(async () => {
  ;({ app, ids } = await bootApp())
  admin = await staffToken('hr_admin')
  const form = defaultApplicationForm()
  const portfolio: FormField = { id: 'portfolio', key: 'portfolio', label: 'Portfolio', type: 'file', helpText: '', placeholder: '', required: false, locked: false, options: [], autofill: null }
  form.fields.splice(form.fields.length - 1, 0, portfolio)
  job = await publishedJob(ids, { title: 'Fashion Designer', form, deadline: new Date(Date.now() + 24 * 3600_000).toISOString() })
  const stored = jobStore.get(job.id)!
  stored.createdBy = admin.uid
})

describe('attachments', () => {
  it('accepts an extra file and links it to the application', async () => {
    const att = await request(app).post('/api/public/attachments').field('jobId', job.id).attach('file', pngBytes, 'board.png').expect(200)
    const { body: cv } = await request(app).post('/api/public/cv').field('jobId', job.id).attach('file', cvPdf, 'cv.pdf').expect(200)
    const res = await request(app)
      .post('/api/public/applications')
      .send({
        jobId: job.id,
        formVersionId: job.formVersionId,
        uploadId: cv.uploadId,
        answers: { fullName: 'Nusrat Jahan', email: 'nusrat@example.com', phone: '01811223344', experienceYears: 4, consent: true, portfolio: att.body },
      })
    expect(res.body).toMatchObject({ referenceId: expect.any(String) })
    const file = await request(app).get(`/api/hr/applications/${res.body.applicationId}/file`).query({ attachment: 'portfolio' }).set(bearer(admin.token)).expect(200)
    expect(file.body.contentType).toBe('image/png')
  })

  it('rejects unsupported attachment types', async () => {
    await request(app).post('/api/public/attachments').attach('file', Buffer.from('MZ' + 'x'.repeat(200)), 'tool.exe').expect(400)
  })
})

describe('scheduled tasks', () => {
  it('sends the daily digest to staff who want it', async () => {
    const spy = vi.mocked(sendMail)
    spy.mockClear()
    await request(app).post('/api/hr/digest/send').set(bearer(admin.token)).expect(200)
    expect(spy).toHaveBeenCalledWith('hr_admin@test.local', expect.objectContaining({ subject: expect.stringMatching(/new application/) }), 'daily-digest')
    spy.mockClear()
    await sendDailyDigest(true)
    expect(spy).not.toHaveBeenCalled()
  })

  it('warns the owner once when a circular is about to close', async () => {
    const spy = vi.mocked(sendMail)
    spy.mockClear()
    await closingSoon()
    expect(spy).toHaveBeenCalledWith(['hr_admin@test.local'], expect.objectContaining({ subject: expect.stringContaining('Fashion Designer') }), 'circular-closing')
    spy.mockClear()
    await closingSoon()
    expect(spy).not.toHaveBeenCalled()
  })

  it('removes files that were uploaded but never sent', async () => {
    const { body } = await request(app).post('/api/public/cv').attach('file', cvPdf, 'cv.pdf').expect(200)
    const ref = firestore().collection('uploads').doc(body.uploadId)
    expect(await cleanupPendingUploads()).toBe(0)
    await ref.update({ createdAt: new Date(Date.now() - 48 * 3600_000).toISOString() })
    expect(await cleanupPendingUploads()).toBe(1)
    expect((await ref.get()).exists).toBe(false)
  })

  it('only starts timers when enabled', () => {
    vi.useFakeTimers()
    try {
      startCron()
      expect(vi.getTimerCount()).toBe(0)
      config.cronEnabled = true
      startCron()
      expect(vi.getTimerCount()).toBeGreaterThan(0)
      stopCron()
    } finally {
      config.cronEnabled = false
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  })
})
