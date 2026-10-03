import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { talentPoolForm, yearInZone } from '@dekko-isho/shared'
import { config } from '../../src/config.js'
import { firestore } from '../../src/lib/firebase.js'
import { changeStatus, createJob, jobStore } from '../../src/services/jobs.js'
import { bootApp, cvPdf, jobInput, publishedJob, type Ids } from '../helpers.js'

let app: Express
let ids: Ids
let openJob: Awaited<ReturnType<typeof publishedJob>>

const year = yearInZone(config.timezone)

function uploadCv(jobId?: string) {
  const req = request(app).post('/api/public/cv')
  if (jobId) req.field('jobId', jobId)
  return req.attach('file', cvPdf, 'Rahim CV.pdf')
}

function answersFor(overrides: Record<string, unknown> = {}) {
  return { fullName: 'Rahim Uddin Ahmed', email: 'rahim.ahmed@example.com', phone: '01711223344', experienceYears: 6, consent: true, ...overrides }
}

beforeAll(async () => {
  ;({ app, ids } = await bootApp())
  openJob = await publishedJob(ids, { title: 'Senior Merchandiser', departmentId: ids.manufacturing, locationIds: [ids.gazipur] })
  await createJob(jobInput(ids, { title: 'Draft Role' }), 'test')
  const closed = await publishedJob(ids, { title: 'Closed Role' })
  await changeStatus(closed.id, 'close')
})

describe('health and meta', () => {
  it('reports healthy with the app version', async () => {
    const res = await request(app).get('/api/health').expect(200)
    expect(res.body).toMatchObject({ ok: true, storage: 'local', turnstile: false })
    expect(res.body.version).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it('lists active settings for filters', async () => {
    const res = await request(app).get('/api/public/meta').expect(200)
    expect(res.body.departments.map((d: { name: string }) => d.name)).toEqual(['Technology', 'Manufacturing'])
    expect(res.body.locations).toHaveLength(2)
  })

  it('returns JSON 404s for unknown routes', async () => {
    const res = await request(app).get('/api/nope').expect(404)
    expect(res.body.error).toBeTruthy()
  })
})

describe('roles', () => {
  it('lists only published, open roles', async () => {
    const res = await request(app).get('/api/public/jobs').expect(200)
    const titles = res.body.jobs.map((j: { title: string }) => j.title)
    expect(titles).toEqual(['Senior Merchandiser'])
    expect(res.body.jobs[0]).toMatchObject({ department: { name: 'Manufacturing' }, locations: [{ name: 'Gazipur' }], isOpen: true })
  })

  it('serves a role by slug with its form', async () => {
    const res = await request(app).get(`/api/public/jobs/${openJob.slug}`).expect(200)
    expect(res.body.formVersionId).toBe(openJob.formVersionId)
    expect(res.body.form.fields.map((f: { key: string }) => f.key)).toContain('cv')
  })

  it('still shows closed roles (so shared links explain they closed) but hides drafts', async () => {
    const closed = jobStore.all().find((j) => j.title === 'Closed Role')!
    const res = await request(app).get(`/api/public/jobs/${closed.slug}`).expect(200)
    expect(res.body.isOpen).toBe(false)
    const draft = jobStore.all().find((j) => j.title === 'Draft Role')!
    await request(app).get(`/api/public/jobs/${draft.slug}`).expect(404)
    await request(app).get('/api/public/jobs/does-not-exist').expect(404)
  })

  it('renders a share page with Open Graph tags', async () => {
    const res = await request(app).get(`/share/jobs/${openJob.slug}`).expect(200)
    expect(res.text).toContain('<meta property="og:title" content="Senior Merchandiser | Careers at Dekko ISHO Group">')
    expect(res.text).toContain(`/career/jobs/${openJob.slug}`)
  })
})

describe('applying', () => {
  it('reads a PDF CV and returns autofill values', async () => {
    const res = await uploadCv(openJob.id).expect(200)
    expect(res.body.status).toBe('succeeded')
    expect(res.body.autofill).toMatchObject({ fullName: 'Rahim Uddin Ahmed', email: 'rahim.ahmed@example.com', phone: '+8801711223344' })
  })

  it('rejects files that are not CVs', async () => {
    const res = await request(app).post('/api/public/cv').attach('file', Buffer.from('x'.repeat(500)), 'notes.txt').expect(400)
    expect(res.body.error).toMatch(/PDF, Word/)
    await request(app).post('/api/public/cv').expect(400)
  })

  it('refuses uploads for roles that are not open', async () => {
    const draft = jobStore.all().find((j) => j.title === 'Draft Role')!
    await uploadCv(draft.id).expect(400)
  })

  it('submits an application, gives a reference and blocks a double submit', async () => {
    const { body: cv } = await uploadCv(openJob.id).expect(200)
    const payload = { jobId: openJob.id, formVersionId: openJob.formVersionId, uploadId: cv.uploadId, answers: answersFor() }

    const res = await request(app).post('/api/public/applications').send(payload).expect(201)
    expect(res.body.referenceId).toBe(`DIG-${year}-00001`)

    const again = await request(app).post('/api/public/applications').send(payload).expect(400)
    expect(again.body.details.fields.cv).toBeTruthy()

    const apps = await firestore().collection('applications').get()
    expect(apps.size).toBe(1)
    expect(apps.docs[0].get('phoneE164')).toBe('+8801711223344')
    expect(jobStore.get(openJob.id)!.applicationsCount).toBe(1)
  })

  it('returns field errors for missing answers', async () => {
    const { body: cv } = await uploadCv(openJob.id).expect(200)
    const res = await request(app)
      .post('/api/public/applications')
      .send({ jobId: openJob.id, formVersionId: openJob.formVersionId, uploadId: cv.uploadId, answers: answersFor({ consent: false, email: 'bad' }) })
      .expect(400)
    expect(res.body.details.fields).toMatchObject({ consent: expect.any(String), email: expect.any(String) })
    const upload = await firestore().collection('uploads').doc(cv.uploadId).get()
    expect(upload.get('status')).toBe('pending')
  })

  it('rejects an outdated form version', async () => {
    const { body: cv } = await uploadCv(openJob.id).expect(200)
    await request(app)
      .post('/api/public/applications')
      .send({ jobId: openJob.id, formVersionId: 'old', uploadId: cv.uploadId, answers: answersFor() })
      .expect(400)
  })

  it('accepts talent pool CVs once a future-roles circular is live', async () => {
    await request(app).get('/api/public/talent-pool').expect(404)
    const pool = await createJob(
      jobInput(ids, { title: 'Apply for a future position', isTalentPool: true, form: talentPoolForm(['Technology'], ['Dhaka']) }),
      'test',
    )
    await changeStatus(pool.id, 'publish')
    const { body: detail } = await request(app).get('/api/public/talent-pool').expect(200)
    expect((await request(app).get('/api/public/jobs')).body.jobs.some((j: { id: string }) => j.id === pool.id)).toBe(false)

    const { body: cv } = await uploadCv(pool.id).expect(200)
    const res = await request(app)
      .post('/api/public/applications')
      .send({
        jobId: pool.id,
        formVersionId: detail.formVersionId,
        uploadId: cv.uploadId,
        answers: answersFor({ email: 'fatema@example.com', interestDepartments: ['Technology'] }),
      })
      .expect(201)
    expect(res.body.referenceId).toBe(`DIG-TP-${year}-00001`)
  })
})

describe('contact and subscribe', () => {
  it('stores contact messages', async () => {
    await request(app)
      .post('/api/public/contact')
      .send({ name: 'Karim', email: 'karim@example.com', message: 'Hello there', source: 'home' })
      .expect(201)
    const messages = await firestore().collection('messages').get()
    expect(messages.docs[0].get('source')).toBe('home')
  })

  it('validates contact input', async () => {
    const res = await request(app).post('/api/public/contact').send({ name: '', email: 'nope', message: '' }).expect(400)
    expect(res.body.details.fields.email).toBeTruthy()
  })

  it('stores each subscriber once', async () => {
    await request(app).post('/api/public/subscribe').send({ email: 'News@Example.com' }).expect(201)
    await request(app).post('/api/public/subscribe').send({ email: 'news@example.com' }).expect(201)
    const subs = await firestore().collection('subscribers').get()
    expect(subs.size).toBe(1)
  })

  it('rejects invalid JSON bodies cleanly', async () => {
    await request(app).post('/api/public/contact').set('Content-Type', 'application/json').send('{bad').expect(400)
  })
})

describe('files', () => {
  it('rejects bad download links and media paths', async () => {
    await request(app).get('/api/files/not-a-token').expect(404)
    await request(app).get('/api/media/circulars/x/../../secret.png').expect(404)
  })
})
