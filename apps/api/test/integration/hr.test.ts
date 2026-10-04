import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { defaultApplicationForm } from '@dekko-isho/shared'
import { firestore } from '../../src/lib/firebase.js'
import { jobStore, tickJobs } from '../../src/services/jobs.js'
import { bearer, bootApp, cvPdf, jobInput, publishedJob, staffToken, type Ids } from '../helpers.js'

let app: Express
let ids: Ids
let admin: { token: string; uid: string }
let recruiter: { token: string; uid: string }
let viewer: { token: string; uid: string }
let applicationId: string

const as = (who: { token: string }) => bearer(who.token)

async function apply(jobId: string, formVersionId: string, email: string, phone = '01711223344') {
  const { body: cv } = await request(app).post('/api/public/cv').field('jobId', jobId).attach('file', cvPdf, 'cv.pdf').expect(200)
  const res = await request(app)
    .post('/api/public/applications')
    .send({ jobId, formVersionId, uploadId: cv.uploadId, answers: { fullName: 'Rahim Uddin Ahmed', email, phone, experienceYears: 6, consent: true } })
    .expect(201)
  return res.body as { applicationId: string; referenceId: string }
}

beforeAll(async () => {
  ;({ app, ids } = await bootApp())
  ;[admin, recruiter, viewer] = await Promise.all([staffToken('hr_admin'), staffToken('recruiter'), staffToken('viewer')])
  const job = await publishedJob(ids, { title: 'Quality Inspector', departmentId: ids.manufacturing })
  ;({ applicationId } = await apply(job.id, job.formVersionId, 'rahim.ahmed@example.com'))
})

describe('access', () => {
  it('needs a signed-in staff member', async () => {
    await request(app).get('/api/hr/me').expect(401)
    await request(app).get('/api/hr/me').set({ Authorization: 'Bearer not-a-token' }).expect(401)
  })

  it('returns the profile for each role', async () => {
    const res = await request(app).get('/api/hr/me').set(as(recruiter)).expect(200)
    expect(res.body).toMatchObject({ role: 'recruiter', email: 'recruiter@test.local' })
    const patched = await request(app).patch('/api/hr/me').set(as(viewer)).send({ notifyDigest: false }).expect(200)
    expect(patched.body.notifyDigest).toBe(false)
  })

  it('keeps viewers read-only', async () => {
    await request(app).get('/api/hr/jobs').set(as(viewer)).expect(200)
    await request(app).post('/api/hr/jobs').set(as(viewer)).send(jobInput(ids)).expect(403)
    await request(app).patch(`/api/hr/applications/${applicationId}`).set(as(viewer)).send({ status: 'reviewed' }).expect(403)
    await request(app).get('/api/hr/cv-bank/export').set(as(viewer)).expect(403)
  })

  it('keeps users, settings and the activity log for admins', async () => {
    await request(app).get('/api/hr/users').set(as(recruiter)).expect(403)
    await request(app).post('/api/hr/settings/departments').set(as(recruiter)).send({ name: 'Finance' }).expect(403)
    await request(app).get('/api/hr/audit').set(as(recruiter)).expect(403)
    const users = await request(app).get('/api/hr/users').set(as(admin)).expect(200)
    expect(users.body.users).toHaveLength(3)
  })

  it('blocks disabled staff', async () => {
    const temp = await staffToken('recruiter', 'temp@test.local')
    await request(app).patch(`/api/hr/users/${temp.uid}`).set(as(admin)).send({ disabled: true }).expect(200)
    await request(app).get('/api/hr/me').set(as(temp)).expect((r) => expect([401, 403]).toContain(r.status))
    await request(app).delete(`/api/hr/users/${temp.uid}`).set(as(admin)).expect(204)
  })

  it('protects the last admin', async () => {
    const res = await request(app).patch(`/api/hr/users/${admin.uid}`).set(as(admin)).send({ role: 'viewer' }).expect(400)
    expect(res.body.error).toMatch(/own admin/)
    await request(app).delete(`/api/hr/users/${admin.uid}`).set(as(admin)).expect(400)
  })

  it('invites new staff', async () => {
    const res = await request(app).post('/api/hr/users').set(as(admin)).send({ email: 'New.Person@Test.local', name: 'New Person', role: 'viewer' }).expect(201)
    expect(res.body.uid).toBeTruthy()
    await request(app).post(`/api/hr/users/${res.body.uid}/resend-invite`).set(as(admin)).expect(200)
    await request(app).post('/api/hr/users').set(as(admin)).send({ email: 'bad', name: 'x', role: 'viewer' }).expect(400)
  })
})

describe('circulars', () => {
  it('creates, edits, publishes and closes a circular', async () => {
    const created = await request(app).post('/api/hr/jobs').set(as(recruiter)).send(jobInput(ids, { title: 'Data Analyst' })).expect(201)
    expect(created.body).toMatchObject({ status: 'draft', slug: 'data-analyst' })
    const id = created.body.id

    const edited = await request(app).put(`/api/hr/jobs/${id}`).set(as(recruiter)).send(jobInput(ids, { title: 'Senior Data Analyst' })).expect(200)
    expect(edited.body.title).toBe('Senior Data Analyst')

    const published = await request(app).post(`/api/hr/jobs/${id}/status`).set(as(recruiter)).send({ action: 'publish' }).expect(200)
    expect(published.body.status).toBe('published')
    const site = await request(app).get('/api/public/jobs').expect(200)
    expect(site.body.jobs.map((j: { title: string }) => j.title)).toContain('Senior Data Analyst')

    await request(app).post(`/api/hr/jobs/${id}/status`).set(as(recruiter)).send({ action: 'close' }).expect(200)
    await request(app).post(`/api/hr/jobs/${id}/status`).set(as(recruiter)).send({ action: 'explode' }).expect(400)

    const list = await request(app).get('/api/hr/jobs').set(as(viewer)).expect(200)
    const row = list.body.jobs.find((j: { id: string }) => j.id === id)
    expect(row).toMatchObject({ status: 'closed', departmentName: 'Technology', locationNames: ['Dhaka'] })
    expect(row.form).toBeUndefined()
  })

  it('schedules a circular with a future start date', async () => {
    const publishAt = new Date(Date.now() + 3600_000).toISOString()
    const job = await request(app).post('/api/hr/jobs').set(as(admin)).send(jobInput(ids, { title: 'Night Shift Lead', publishAt })).expect(201)
    const res = await request(app).post(`/api/hr/jobs/${job.body.id}/status`).set(as(admin)).send({ action: 'publish' }).expect(200)
    expect(res.body.status).toBe('scheduled')
  })

  it('validates circular input', async () => {
    const res = await request(app).post('/api/hr/jobs').set(as(admin)).send(jobInput(ids, { title: '' })).expect(400)
    expect(res.body.details.fields.title).toBeTruthy()
    const form = defaultApplicationForm()
    form.fields = form.fields.filter((f) => f.key !== 'email')
    await request(app).post('/api/hr/jobs').set(as(admin)).send(jobInput(ids, { title: 'No email', form })).expect(400)
  })

  it('duplicates and deletes circulars (admins only delete)', async () => {
    const original = jobStore.all().find((j) => j.title === 'Quality Inspector')!
    const copy = await request(app).post(`/api/hr/jobs/${original.id}/duplicate`).set(as(recruiter)).expect(201)
    expect(copy.body).toMatchObject({ title: 'Quality Inspector (copy)', status: 'draft', applicationsCount: 0 })

    await request(app).delete(`/api/hr/jobs/${copy.body.id}`).set(as(recruiter)).expect(403)
    await request(app).delete(`/api/hr/jobs/${copy.body.id}`).set(as(admin)).expect(204)
    await request(app).get(`/api/hr/jobs/${copy.body.id}`).set(as(admin)).expect(404)

    const blocked = await request(app).delete(`/api/hr/jobs/${original.id}`).set(as(admin)).expect(400)
    expect(blocked.body.error).toMatch(/Archive it instead/)
  })

  it('closes scheduled circulars whose deadline passed while waiting', async () => {
    const job = await request(app).post('/api/hr/jobs').set(as(admin)).send(jobInput(ids, { title: 'Missed Window' })).expect(201)
    const stored = jobStore.get(job.body.id)!
    Object.assign(stored, { status: 'scheduled', publishAt: new Date(Date.now() - 7200_000).toISOString(), deadline: new Date(Date.now() - 3600_000).toISOString() })
    const { published, closed } = await tickJobs()
    expect(closed.map((j) => j.id)).toContain(stored.id)
    expect(published.map((j) => j.id)).not.toContain(stored.id)
    expect(jobStore.get(stored.id)!.status).toBe('closed')
  })

  it('serves the default form and dashboard', async () => {
    const form = await request(app).get('/api/hr/jobs/default-form').set(as(viewer)).expect(200)
    expect(form.body.fields.map((f: { key: string }) => f.key)).toEqual(expect.arrayContaining(['cv', 'fullName', 'email', 'phone', 'consent']))
    const dash = await request(app).get('/api/hr/dashboard').set(as(viewer)).expect(200)
    expect(dash.body.jobs.published).toBeGreaterThan(0)
    expect(dash.body.recent.length).toBeGreaterThan(0)
  })
})

describe('form templates', () => {
  it('saves, updates and removes a template', async () => {
    const created = await request(app).post('/api/hr/form-templates').set(as(recruiter)).send({ name: 'Factory roles', schema: defaultApplicationForm() }).expect(201)
    await request(app).put(`/api/hr/form-templates/${created.body.id}`).set(as(recruiter)).send({ name: 'Factory roles v2', schema: defaultApplicationForm() }).expect(200)
    const list = await request(app).get('/api/hr/form-templates').set(as(viewer)).expect(200)
    expect(list.body.templates.map((t: { name: string }) => t.name)).toContain('Factory roles v2')
    await request(app).put('/api/hr/form-templates/missing').set(as(recruiter)).send({ name: 'x', schema: defaultApplicationForm() }).expect(404)
    await request(app).delete(`/api/hr/form-templates/${created.body.id}`).set(as(recruiter)).expect(204)
  })
})

describe('settings', () => {
  it('manages lists and refuses to delete ones in use', async () => {
    const created = await request(app).post('/api/hr/settings/departments').set(as(admin)).send({ name: 'Finance' }).expect(201)
    await request(app).put(`/api/hr/settings/departments/${created.body.id}`).set(as(admin)).send({ name: 'Finance & Accounts' }).expect(200)
    await request(app).delete(`/api/hr/settings/departments/${created.body.id}`).set(as(admin)).expect(204)
    await request(app).delete(`/api/hr/settings/departments/${ids.manufacturing}`).set(as(admin)).expect(400)
    await request(app).post('/api/hr/settings/planets').set(as(admin)).send({ name: 'Mars' }).expect(404)
  })

  it('validates custom field keys and prevents duplicates', async () => {
    const field = { key: 'shift', label: 'Shift', type: 'select', options: ['Day', 'Night'] }
    const created = await request(app).post('/api/hr/settings/custom-fields').set(as(admin)).send(field).expect(201)
    const dupe = await request(app).post('/api/hr/settings/custom-fields').set(as(admin)).send(field).expect(400)
    expect(dupe.body.error).toMatch(/already used/)
    const bad = await request(app).post('/api/hr/settings/custom-fields').set(as(admin)).send({ ...field, key: 'Shift Pattern' }).expect(400)
    expect(bad.body.details.fields.key).toBeTruthy()
    await request(app).put(`/api/hr/settings/custom-fields/${created.body.id}`).set(as(admin)).send({ ...field, label: 'Work shift' }).expect(200)
    const settings = await request(app).get('/api/hr/settings').set(as(viewer)).expect(200)
    expect(settings.body.customFields.map((f: { label: string }) => f.label)).toContain('Work shift')
    await request(app).delete(`/api/hr/settings/custom-fields/${created.body.id}`).set(as(admin)).expect(204)
  })
})

describe('CV bank and applications', () => {
  it('finds the application by name, skill text and filters', async () => {
    const all = await request(app).get('/api/hr/cv-bank').set(as(viewer)).expect(200)
    expect(all.body.total).toBe(1)
    expect(all.body.rows[0]).toMatchObject({ applicationId, fullName: 'Rahim Uddin Ahmed', jobTitle: 'Quality Inspector', departmentName: 'Manufacturing' })

    const byName = await request(app).get('/api/hr/cv-bank').query({ q: 'rahim' }).set(as(viewer)).expect(200)
    expect(byName.body.total).toBe(1)
    const none = await request(app).get('/api/hr/cv-bank').query({ q: 'nobody-matches-this' }).set(as(viewer)).expect(200)
    expect(none.body.total).toBe(0)
    const byDept = await request(app).get('/api/hr/cv-bank').query({ departmentId: ids.tech }).set(as(viewer)).expect(200)
    expect(byDept.body.total).toBe(0)
  })

  it('updates status and tags, and adds notes', async () => {
    const res = await request(app).patch(`/api/hr/applications/${applicationId}`).set(as(recruiter)).send({ status: 'shortlisted', tags: ['strong'] }).expect(200)
    expect(res.body).toMatchObject({ status: 'shortlisted', tags: ['strong'] })
    await request(app).patch(`/api/hr/applications/${applicationId}`).set(as(recruiter)).send({ status: 'maybe' }).expect(400)

    await request(app).post(`/api/hr/applications/${applicationId}/notes`).set(as(recruiter)).send({ body: 'Great interview' }).expect(201)
    await request(app).post(`/api/hr/applications/${applicationId}/notes`).set(as(recruiter)).send({ body: '' }).expect(400)

    const detail = await request(app).get(`/api/hr/applications/${applicationId}`).set(as(viewer)).expect(200)
    expect(detail.body).toMatchObject({ status: 'shortlisted', tags: ['strong'] })
    expect(detail.body.notes[0].body).toBe('Great interview')
    expect(detail.body.form.fields.length).toBeGreaterThan(0)

    const tags = await request(app).get('/api/hr/cv-bank/tags').set(as(viewer)).expect(200)
    expect(tags.body.tags).toContain('strong')
    await request(app).get('/api/hr/applications/missing').set(as(viewer)).expect(404)
  })

  it('validates profile edits', async () => {
    const detail = await request(app).get(`/api/hr/applications/${applicationId}`).set(as(viewer)).expect(200)
    const profile = { ...detail.body.profile, totalExperienceYears: 75 }
    await request(app).put(`/api/hr/applications/${applicationId}/profile`).set(as(recruiter)).send(profile).expect(400)
    const ok = await request(app)
      .put(`/api/hr/applications/${applicationId}/profile`)
      .set(as(recruiter))
      .send({ ...detail.body.profile, totalExperienceYears: 8, skills: ['Quality control', 'quality control', 'AQL'] })
      .expect(200)
    expect(ok.body.profile.totalExperienceYears).toBe(8)
    const row = (await request(app).get('/api/hr/cv-bank').set(as(viewer))).body.rows[0]
    expect(row.expYears).toBe(8)
  })

  it('gives short-lived file links and rejects unknown attachments', async () => {
    const res = await request(app).get(`/api/hr/applications/${applicationId}/file`).set(as(viewer)).expect(200)
    expect(res.body).toMatchObject({ contentType: 'application/pdf' })
    expect(res.body.url).toContain('/api/files/')
    const file = await request(app).get(new URL(res.body.url).pathname + new URL(res.body.url).search).expect(200)
    expect(file.headers['content-type']).toContain('application/pdf')

    await request(app).get(`/api/hr/applications/${applicationId}/file`).query({ attachment: 'constructor' }).set(as(viewer)).expect(404)
    await request(app).get(`/api/hr/applications/${applicationId}/file`).query({ attachment: 'portfolio' }).set(as(viewer)).expect(404)
  })

  it('shows the candidate with all their applications', async () => {
    const detail = await request(app).get(`/api/hr/applications/${applicationId}`).set(as(viewer)).expect(200)
    const candidate = await request(app).get(`/api/hr/candidates/${detail.body.candidateId}`).set(as(viewer)).expect(200)
    expect(candidate.body.applications).toHaveLength(1)
    await request(app).get('/api/hr/candidates/missing').set(as(viewer)).expect(404)
  })

  it('exports the CV bank as CSV', async () => {
    const res = await request(app).get('/api/hr/cv-bank/export').set(as(recruiter)).expect(200)
    expect(res.headers['content-type']).toContain('text/csv')
    const [header, row] = res.text.trim().split('\n')
    expect(header).toContain('Name')
    expect(row).toContain('Rahim Uddin Ahmed')
  })

  it('records sensitive actions in the activity log', async () => {
    const res = await request(app).get('/api/hr/audit').set(as(admin)).expect(200)
    const actions = res.body.entries.map((e: { action: string }) => e.action)
    expect(actions).toEqual(expect.arrayContaining(['job.create', 'application.status', 'application.cv.view', 'cvbank.export', 'template.create', 'user.invite']))
    const stored = await firestore().collection('auditLog').count().get()
    expect(stored.data().count).toBe(res.body.entries.length)
  })
})

describe('removing an application', () => {
  it('lets editors permanently remove an application and everything attached to it', async () => {
    const job = await publishedJob(ids, { title: 'Pattern Maker', departmentId: ids.manufacturing })
    const { applicationId: id } = await apply(job.id, job.formVersionId, 'removed.candidate@example.com')
    await request(app).post(`/api/hr/applications/${id}/notes`).set(as(recruiter)).send({ body: 'Note to be removed' }).expect(201)
    const { candidateId, uploadId } = (await firestore().collection('applications').doc(id).get()).data() as { candidateId: string; uploadId: string }
    expect(jobStore.get(job.id)?.applicationsCount).toBe(1)

    await request(app).delete(`/api/hr/applications/${id}`).set(as(viewer)).expect(403)
    await request(app).delete(`/api/hr/applications/${id}`).set(as(recruiter)).expect(204)
    await request(app).delete(`/api/hr/applications/${id}`).set(as(recruiter)).expect(404)

    await request(app).get(`/api/hr/applications/${id}`).set(as(viewer)).expect(404)
    const bank = await request(app).get('/api/hr/cv-bank').set(as(viewer)).expect(200)
    expect(bank.body.rows.map((r: { applicationId: string }) => r.applicationId)).not.toContain(id)
    expect(bank.body.rows.map((r: { applicationId: string }) => r.applicationId)).toContain(applicationId)

    expect((await firestore().collection('applications').doc(id).collection('notes').get()).empty).toBe(true)
    // Same phone as the first applicant, so they share a candidate that must survive without this application.
    const candidate = await firestore().collection('candidates').doc(candidateId).get()
    expect(candidate.get('applicationIds')).toEqual([applicationId])
    expect((await firestore().collection('uploads').doc(uploadId).get()).exists).toBe(false)
    expect(jobStore.get(job.id)).toMatchObject({ applicationsCount: 0, newApplicationsCount: 0 })

    const audit = await request(app).get('/api/hr/audit').set(as(admin)).expect(200)
    expect(audit.body.entries.map((e: { action: string }) => e.action)).toContain('application.delete')
  })

  it('removes the candidate too when it was their only application', async () => {
    const job = await publishedJob(ids, { title: 'Cutting Master', departmentId: ids.manufacturing })
    const { applicationId: id } = await apply(job.id, job.formVersionId, 'solo.candidate@example.com', '01899887766')
    const { candidateId } = (await firestore().collection('applications').doc(id).get()).data() as { candidateId: string }
    await request(app).delete(`/api/hr/applications/${id}`).set(as(admin)).expect(204)
    expect((await firestore().collection('candidates').doc(candidateId).get()).exists).toBe(false)
  })
})
