import { useEffect, useMemo, useState } from 'react'
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, FileText, Save, Trash2 } from 'lucide-react'
import {
  formatSalary,
  type CustomFieldDefinition,
  type CustomFieldValue,
  type FormSchema,
  type FormTemplate,
  type Job,
  type JobInput,
  type LookupItem,
  type Salary,
} from '@dekko-isho/shared'
import { FormBuilder } from '../components/FormBuilder'
import { RichTextEditor } from '../components/RichTextEditor'
import { Button, Checkbox, ErrorNote, Field, Input, JobStatusBadge, Modal, Select, SkeletonRows, Textarea, useUi } from '../components/ui'
import { api, ApiError } from '../lib/api'
import { formatDateTime, fromLocalInput, toLocalInput } from '../lib/format'
import { useSession } from '../lib/session'
import { useApi } from '../lib/useApi'

type Settings = { departments: LookupItem[]; locations: LookupItem[]; jobTypes: LookupItem[]; customFields: CustomFieldDefinition[] }

type Draft = {
  title: string
  slug: string
  departmentId: string
  locationIds: string[]
  jobTypeId: string
  experienceLevel: string
  salary: { min: string; max: string; period: Salary['period']; display: Salary['display'] }
  summary: string
  descriptionHtml: string
  descriptionJson: unknown
  customFields: Record<string, CustomFieldValue>
  publishAt: string
  deadline: string
  isTalentPool: boolean
  form: FormSchema
}

const SITE = import.meta.env.VITE_SITE_URL || (import.meta.env.DEV ? 'http://localhost:5173' : window.location.origin)

function toDraft(job: Job): Draft {
  return {
    title: job.title,
    slug: job.slug,
    departmentId: job.departmentId,
    locationIds: job.locationIds,
    jobTypeId: job.jobTypeId,
    experienceLevel: job.experienceLevel ?? '',
    salary: { min: job.salary.min?.toString() ?? '', max: job.salary.max?.toString() ?? '', period: job.salary.period, display: job.salary.display },
    summary: job.summary,
    descriptionHtml: job.descriptionHtml,
    descriptionJson: job.descriptionJson,
    customFields: job.customFields ?? {},
    publishAt: toLocalInput(job.publishAt),
    deadline: toLocalInput(job.deadline),
    isTalentPool: job.isTalentPool,
    form: job.form,
  }
}

function emptyDraft(form: FormSchema, s: Settings): Draft {
  const first = (items: LookupItem[]) => items.find((x) => x.active)?.id ?? ''
  return {
    title: '',
    slug: '',
    departmentId: first(s.departments),
    locationIds: s.locations.filter((l) => l.active).slice(0, 1).map((l) => l.id),
    jobTypeId: first(s.jobTypes),
    experienceLevel: '',
    salary: { min: '', max: '', period: 'month', display: 'hidden' },
    summary: '',
    descriptionHtml: '',
    descriptionJson: undefined,
    customFields: {},
    publishAt: '',
    deadline: '',
    isTalentPool: false,
    form,
  }
}

function toInput(d: Draft, includeSlug: boolean): JobInput {
  const num = (v: string) => (v.trim() === '' ? null : Number(v.replace(/,/g, '')))
  return {
    title: d.title,
    ...(includeSlug && d.slug ? { slug: d.slug } : {}),
    departmentId: d.departmentId,
    locationIds: d.locationIds,
    jobTypeId: d.jobTypeId,
    experienceLevel: d.experienceLevel,
    salary: { min: num(d.salary.min), max: num(d.salary.max), currency: 'BDT', period: d.salary.period, display: d.salary.display },
    summary: d.summary,
    descriptionHtml: d.descriptionHtml,
    descriptionJson: d.descriptionJson,
    customFields: Object.fromEntries(Object.entries(d.customFields).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && !v.length))),
    publishAt: fromLocalInput(d.publishAt),
    deadline: fromLocalInput(d.deadline),
    isTalentPool: d.isTalentPool,
    form: d.form,
  }
}

type Tab = 'details' | 'description' | 'form'

export default function CircularEditorPage() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { can } = useSession()
  const { toast, confirm } = useUi()
  const readOnly = !can('edit')

  const settings = useApi<Settings>('/api/hr/settings')
  const jobRes = useApi<Job>(isNew ? null : `/api/hr/jobs/${id}`)
  const defaultForm = useApi<FormSchema>(isNew ? '/api/hr/jobs/default-form' : null)

  const [job, setJob] = useState<Job | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [openedAt] = useState(() => Date.now())
  const [saved, setSaved] = useState<string>('')
  const [tab, setTab] = useState<Tab>('details')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState<'' | 'save' | 'status' | 'delete'>('')

  const [lastJob, setLastJob] = useState<Job | null>(null)
  if (jobRes.data && jobRes.data !== lastJob) {
    setLastJob(jobRes.data)
    setJob(jobRes.data)
    const d = toDraft(jobRes.data)
    setDraft(d)
    setSaved(JSON.stringify(d))
  }
  if (isNew && !draft && settings.data && defaultForm.data) {
    const d = emptyDraft(defaultForm.data, settings.data)
    setDraft(d)
    setSaved(JSON.stringify(d))
  }

  const dirty = draft ? JSON.stringify(draft) !== saved : false
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && !busy && currentLocation.pathname !== nextLocation.pathname)

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    void confirm({ title: 'Leave without saving?', body: 'Your changes to this circular will be lost.', confirmLabel: 'Leave', danger: true }).then((ok) => (ok ? blocker.proceed() : blocker.reset()))
  }, [blocker, confirm])

  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const patch = (p: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...p } : d))

  const save = async (opts: { navigateOnCreate?: boolean } = {}): Promise<Job | null> => {
    if (!draft) return null
    setBusy('save')
    setErrors({})
    setFormError('')
    try {
      const body = toInput(draft, isNew ? Boolean(draft.slug) : draft.slug !== job?.slug)
      const result = isNew ? await api<Job>('/api/hr/jobs', { body }) : await api<Job>(`/api/hr/jobs/${id}`, { method: 'PUT', body })
      const d = toDraft(result)
      setJob(result)
      setDraft(d)
      setSaved(JSON.stringify(d))
      if (opts.navigateOnCreate !== false) {
        toast(isNew ? 'Draft created' : 'Changes saved')
        if (isNew) navigate(`/circulars/${result.id}`, { replace: true })
      }
      return result
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields)
        setFormError(err.message)
        const keys = Object.keys(err.fields)
        if (keys.some((k) => k.startsWith('form'))) setTab('form')
        else if (keys.length && keys.every((k) => k.startsWith('description'))) setTab('description')
        else if (keys.length) setTab('details')
      } else setFormError('Something went wrong. Please try again.')
      return null
    } finally {
      setBusy('')
    }
  }

  const changeStatus = async (action: 'publish' | 'unpublish' | 'close' | 'reopen' | 'archive' | 'unarchive') => {
    let current = job
    if (dirty || !current) current = await save({ navigateOnCreate: false })
    if (!current) return
    if (action === 'close' && !(await confirm({ title: 'Close this circular?', body: 'It will stop accepting applications and disappear from the careers page.', confirmLabel: 'Close circular' }))) return
    if (action === 'unpublish' && !(await confirm({ title: 'Move back to drafts?', body: 'The role will be taken off the careers page right away.', confirmLabel: 'Unpublish' }))) return
    setBusy('status')
    try {
      const result = await api<Job>(`/api/hr/jobs/${current.id}/status`, { body: { action } })
      setJob(result)
      const labels = { publish: result.status === 'scheduled' ? 'Scheduled to go live' : 'Live on the careers page', unpublish: 'Moved to drafts', close: 'Circular closed', reopen: 'Circular reopened', archive: 'Archived', unarchive: 'Restored to drafts' }
      toast(labels[action])
      if (isNew) navigate(`/circulars/${result.id}`, { replace: true })
    } catch (err) {
      toast((err as Error).message, 'error')
      if (isNew) navigate(`/circulars/${current.id}`, { replace: true })
    } finally {
      setBusy('')
    }
  }

  const remove = async () => {
    if (!job) return
    if (!(await confirm({ title: 'Delete this circular?', body: 'This can’t be undone.', confirmLabel: 'Delete', danger: true }))) return
    setBusy('delete')
    try {
      await api(`/api/hr/jobs/${job.id}`, { method: 'DELETE' })
      setSaved(JSON.stringify(draft))
      toast('Circular deleted')
      navigate('/circulars', { replace: true })
    } catch (err) {
      toast((err as Error).message, 'error')
      setBusy('')
    }
  }

  if (settings.error || jobRes.error) {
    return (
      <div className="page">
        <ErrorNote error={settings.error ?? jobRes.error} />
      </div>
    )
  }
  if (!draft || !settings.data) {
    return (
      <div className="page">
        <SkeletonRows rows={8} />
      </div>
    )
  }

  const s = settings.data
  const status = job?.status ?? 'draft'
  const tabErrors = (prefix: string[]) => Object.keys(errors).some((k) => prefix.some((p) => k === p || k.startsWith(`${p}.`)))

  return (
    <div className="page">
      <Link to="/circulars" className="back">
        <ArrowLeft size={16} /> All circulars
      </Link>
      <div className="page-head">
        <div style={{ minWidth: 0 }}>
          <div className="row">
            <h1 className="truncate">{isNew ? 'New circular' : draft.title || 'Untitled circular'}</h1>
            {!isNew ? <JobStatusBadge status={status} /> : null}
            {draft.isTalentPool ? <span className="badge badge-navy plain">Future roles</span> : null}
          </div>
          <p>
            {isNew
              ? 'Fill in the details, write the description and choose the questions candidates answer.'
              : status === 'scheduled' && job?.publishAt
                ? `Goes live ${formatDateTime(job.publishAt)}`
                : status === 'published'
                  ? `Live since ${formatDateTime(job?.publishedAt)} · ${job?.applicationsCount ?? 0} applicants`
                  : `Last updated ${formatDateTime(job?.updatedAt)}`}
          </p>
        </div>
        {!readOnly ? (
          <div className="page-actions">
            {job && (status === 'published' || status === 'closed') ? (
              <a className="btn" href={`${SITE}/career/jobs/${job.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink size={15} /> View
              </a>
            ) : null}
            {status === 'draft' || isNew ? (
              <>
                <Button onClick={() => void save()} loading={busy === 'save'} disabled={!dirty && !isNew}>
                  <Save size={15} /> Save draft
                </Button>
                <Button variant="primary" onClick={() => void changeStatus('publish')} loading={busy === 'status'}>
                  {draft.publishAt && Date.parse(fromLocalInput(draft.publishAt) ?? '') > openedAt ? 'Schedule' : 'Publish'}
                </Button>
              </>
            ) : (
              <>
                <Button variant={dirty ? 'primary' : 'default'} onClick={() => void save()} loading={busy === 'save'} disabled={!dirty}>
                  <Save size={15} /> Save changes
                </Button>
                {status === 'published' ? <Button onClick={() => void changeStatus('close')}>Close</Button> : null}
                {status === 'published' || status === 'scheduled' ? <Button variant="ghost" onClick={() => void changeStatus('unpublish')}>Unpublish</Button> : null}
                {status === 'closed' ? <Button onClick={() => void changeStatus('reopen')}>Reopen</Button> : null}
                {status === 'closed' ? <Button variant="ghost" onClick={() => void changeStatus('archive')}>Archive</Button> : null}
                {status === 'archived' ? <Button onClick={() => void changeStatus('unarchive')}>Restore</Button> : null}
              </>
            )}
          </div>
        ) : null}
      </div>

      {formError ? (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          {formError}
        </div>
      ) : null}

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'details'} className={`tab ${tab === 'details' ? 'active' : ''}`} onClick={() => setTab('details')}>
          Details {tabErrors(['title', 'slug', 'departmentId', 'locationIds', 'jobTypeId', 'summary', 'salary', 'deadline', 'publishAt']) ? <span className="req">•</span> : null}
        </button>
        <button role="tab" aria-selected={tab === 'description'} className={`tab ${tab === 'description' ? 'active' : ''}`} onClick={() => setTab('description')}>
          Description {tabErrors(['descriptionHtml']) ? <span className="req">•</span> : null}
        </button>
        <button role="tab" aria-selected={tab === 'form'} className={`tab ${tab === 'form' ? 'active' : ''}`} onClick={() => setTab('form')}>
          Application form <span className="count">{draft.form.fields.length}</span> {tabErrors(['form']) ? <span className="req">•</span> : null}
        </button>
      </div>

      <fieldset disabled={readOnly} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
        {tab === 'details' ? <DetailsTab draft={draft} patch={patch} errors={errors} settings={s} job={job} /> : null}
        {tab === 'description' ? (
          <section className="card card-pad stack">
            <div>
              <h2>Role description</h2>
              <p className="muted" style={{ marginTop: 4 }}>
                This is what candidates read on the role page. Use headings and bullet points to make it easy to scan.
              </p>
            </div>
            <RichTextEditor
              key={job?.id ?? 'new'}
              initialHtml={draft.descriptionHtml}
              initialJson={draft.descriptionJson}
              jobId={job?.id}
              readOnly={readOnly}
              onChange={(html, json) => patch({ descriptionHtml: html, descriptionJson: json })}
            />
          </section>
        ) : null}
        {tab === 'form' ? <FormTab draft={draft} patch={patch} job={job} readOnly={readOnly} errors={errors} /> : null}
      </fieldset>

      {!readOnly && job && can('admin') && job.applicationsCount === 0 ? (
        <div style={{ marginTop: 28 }}>
          <Button variant="ghost" style={{ color: 'var(--red)' }} onClick={() => void remove()} loading={busy === 'delete'}>
            <Trash2 size={15} /> Delete circular
          </Button>
        </div>
      ) : null}
    </div>
  )
}

function DetailsTab({ draft, patch, errors, settings: s, job }: { draft: Draft; patch: (p: Partial<Draft>) => void; errors: Record<string, string>; settings: Settings; job: Job | null }) {
  const activeOr = (items: LookupItem[], selected: string[]) => items.filter((x) => x.active || selected.includes(x.id))
  const salaryPreview = useMemo(() => {
    const num = (v: string) => (v.trim() === '' ? null : Number(v.replace(/,/g, '')))
    return formatSalary({ min: num(draft.salary.min), max: num(draft.salary.max), currency: 'BDT', period: draft.salary.period, display: draft.salary.display })
  }, [draft.salary])

  return (
    <div className="split">
      <div className="stack">
        <section className="card card-pad stack">
          <h2>Basics</h2>
          <Field label="Job title" required error={errors.title}>
            {(id) => <Input id={id} value={draft.title} invalid={Boolean(errors.title)} onChange={(e) => patch({ title: e.target.value })} placeholder="e.g. Senior Merchandiser" />}
          </Field>
          <div className="grid-2">
            <Field label="Department" required error={errors.departmentId}>
              {(id) => (
                <Select id={id} value={draft.departmentId} onChange={(e) => patch({ departmentId: e.target.value })}>
                  {activeOr(s.departments, [draft.departmentId]).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Job type" required error={errors.jobTypeId}>
              {(id) => (
                <Select id={id} value={draft.jobTypeId} onChange={(e) => patch({ jobTypeId: e.target.value })}>
                  {activeOr(s.jobTypes, [draft.jobTypeId]).map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <div className="field">
            <span className="label">
              Locations<span className="req">*</span>
            </span>
            <div className="chips">
              {activeOr(s.locations, draft.locationIds).map((l) => {
                const on = draft.locationIds.includes(l.id)
                return (
                  <button
                    key={l.id}
                    type="button"
                    className={`chip ${on ? 'on' : ''}`}
                    aria-pressed={on}
                    onClick={() => patch({ locationIds: on ? draft.locationIds.filter((x) => x !== l.id) : [...draft.locationIds, l.id] })}
                  >
                    {l.name}
                  </button>
                )
              })}
            </div>
            {errors.locationIds ? <span className="error">{errors.locationIds}</span> : null}
          </div>
          <Field label="Experience level" hint="e.g. Entry level, 3–5 years, Senior">
            {(id) => <Input id={id} value={draft.experienceLevel} onChange={(e) => patch({ experienceLevel: e.target.value })} />}
          </Field>
          <Field label="Card summary" required hint={`${draft.summary.length}/320 · Shown on the role card and in search results.`} error={errors.summary}>
            {(id) => <Textarea id={id} rows={3} maxLength={320} value={draft.summary} invalid={Boolean(errors.summary)} onChange={(e) => patch({ summary: e.target.value })} />}
          </Field>
        </section>

        <section className="card card-pad stack">
          <div className="spread">
            <h2>Salary</h2>
            <span className="small muted">{salaryPreview ? `Shown as: ${salaryPreview}` : 'Hidden from candidates'}</span>
          </div>
          <div className="row" role="radiogroup" aria-label="How to show salary">
            {(
              [
                ['hidden', 'Don’t show'],
                ['range', 'Show a range'],
                ['negotiable', 'Negotiable'],
              ] as const
            ).map(([v, label]) => (
              <button key={v} type="button" role="radio" aria-checked={draft.salary.display === v} className={`chip ${draft.salary.display === v ? 'on' : ''}`} onClick={() => patch({ salary: { ...draft.salary, display: v } })}>
                {label}
              </button>
            ))}
          </div>
          {draft.salary.display === 'range' ? (
            <div className="grid-3">
              <Field label="From (BDT)" error={errors['salary.min']}>
                {(id) => <Input id={id} inputMode="numeric" value={draft.salary.min} onChange={(e) => patch({ salary: { ...draft.salary, min: e.target.value } })} />}
              </Field>
              <Field label="To (BDT)" error={errors['salary.max'] ?? errors.salary}>
                {(id) => <Input id={id} inputMode="numeric" value={draft.salary.max} onChange={(e) => patch({ salary: { ...draft.salary, max: e.target.value } })} />}
              </Field>
              <Field label="Per">
                {(id) => (
                  <Select id={id} value={draft.salary.period} onChange={(e) => patch({ salary: { ...draft.salary, period: e.target.value as Salary['period'] } })}>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </Select>
                )}
              </Field>
            </div>
          ) : null}
        </section>

        {s.customFields.length ? (
          <section className="card card-pad stack">
            <h2>More details</h2>
            <div className="grid-2">
              {s.customFields.map((f) => (
                <CustomFieldInput key={f.id} def={f} value={draft.customFields[f.key]} onChange={(v) => patch({ customFields: { ...draft.customFields, [f.key]: v } })} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="stack">
        <section className="card card-pad stack">
          <h2>Timing</h2>
          <Field label="Application deadline" hint="Closes automatically at this time (Dhaka time). Leave empty to keep it open." error={errors.deadline}>
            {(id) => <Input id={id} type="datetime-local" value={draft.deadline} onChange={(e) => patch({ deadline: e.target.value })} />}
          </Field>
          <Field label="Go live on" hint="Optional. Publish now, or schedule it for later." error={errors.publishAt}>
            {(id) => <Input id={id} type="datetime-local" value={draft.publishAt} onChange={(e) => patch({ publishAt: e.target.value })} />}
          </Field>
        </section>
        <section className="card card-pad stack">
          <h2>Web address</h2>
          <Field label="Link" hint="Created from the title. Change it only if you need a specific link." error={errors.slug}>
            {(id) => (
              <Input
                id={id}
                value={draft.slug}
                placeholder="created-from-title"
                onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') })}
              />
            )}
          </Field>
          {job ? <p className="small muted" style={{ overflowWrap: 'anywhere' }}>{`${SITE}/career/jobs/${job.slug}`}</p> : null}
        </section>
      </div>
    </div>
  )
}

function CustomFieldInput({ def, value, onChange }: { def: CustomFieldDefinition; value: CustomFieldValue | undefined; onChange: (v: CustomFieldValue) => void }) {
  if (def.type === 'boolean') return <Checkbox checked={value === true} onChange={onChange} label={def.label} />
  if (def.type === 'select')
    return (
      <Field label={def.label}>
        {(id) => (
          <Select id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>
            <option value="">—</option>
            {def.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        )}
      </Field>
    )
  if (def.type === 'multiselect') {
    const list = Array.isArray(value) ? value : []
    return (
      <div className="field">
        <span className="label">{def.label}</span>
        <div className="chips">
          {def.options.map((o) => {
            const on = list.includes(o)
            return (
              <button key={o} type="button" className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => onChange(on ? list.filter((x) => x !== o) : [...list, o])}>
                {o}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
  return (
    <Field label={def.label}>
      {(id) => (
        <Input
          id={id}
          type={def.type === 'number' ? 'number' : 'text'}
          value={value == null ? '' : String(value)}
          onChange={(e) => onChange(def.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
        />
      )}
    </Field>
  )
}

function FormTab({ draft, patch, job, readOnly, errors }: { draft: Draft; patch: (p: Partial<Draft>) => void; job: Job | null; readOnly: boolean; errors: Record<string, string> }) {
  const { toast, confirm } = useUi()
  const templates = useApi<{ templates: FormTemplate[] }>('/api/hr/form-templates')
  const [saveOpen, setSaveOpen] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const formErrors = Object.entries(errors).filter(([k]) => k.startsWith('form'))

  const applyTemplate = async (tid: string) => {
    if (tid === '__default') {
      if (!(await confirm({ title: 'Use the standard form?', body: 'This replaces the current questions.', confirmLabel: 'Replace' }))) return
      try {
        patch({ form: await api<FormSchema>('/api/hr/jobs/default-form') })
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Could not load the standard form', 'error')
      }
      return
    }
    const t = templates.data?.templates.find((x) => x.id === tid)
    if (!t) return
    if (!(await confirm({ title: `Use “${t.name}”?`, body: 'This replaces the current questions.', confirmLabel: 'Replace' }))) return
    patch({ form: t.schema })
  }

  const saveTemplate = async () => {
    setBusy(true)
    try {
      await api('/api/hr/form-templates', { body: { name, schema: draft.form } })
      toast('Template saved')
      setSaveOpen(false)
      setName('')
      void templates.reload()
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="split">
      <section className="card card-pad stack">
        <div className="spread">
          <div>
            <h2>Questions</h2>
            <p className="muted small" style={{ marginTop: 4 }}>
              Candidates upload their CV first. Questions marked “From CV” are filled in for them to check.
            </p>
          </div>
        </div>
        {job && job.applicationsCount > 0 ? (
          <div className="alert alert-info">
            {job.applicationsCount} people have already applied. Changes apply to new applicants only. Existing applications keep the answers they gave.
          </div>
        ) : null}
        {formErrors.length ? <div className="alert alert-error">{formErrors[0][1]}</div> : null}
        <FormBuilder value={draft.form} onChange={(form) => patch({ form })} readOnly={readOnly} />
      </section>
      {!readOnly ? (
        <div className="stack">
          <section className="card card-pad stack">
            <h3>Templates</h3>
            <p className="small muted">Start from a saved set of questions, or save this one to reuse later.</p>
            <Select value="" onChange={(e) => void applyTemplate(e.target.value)} aria-label="Load a template">
              <option value="">Load a template…</option>
              <option value="__default">Standard application form</option>
              {templates.data?.templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Select>
            <Button onClick={() => setSaveOpen(true)}>
              <FileText size={15} /> Save as template
            </Button>
          </section>
        </div>
      ) : null}
      <Modal
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        title="Save as template"
        footer={
          <>
            <Button onClick={() => setSaveOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => void saveTemplate()} disabled={!name.trim()} loading={busy}>
              Save template
            </Button>
          </>
        }
      >
        <Field label="Template name" hint="e.g. Factory floor roles, Graduate programme">
          {(id) => <Input id={id} value={name} autoFocus onChange={(e) => setName(e.target.value)} />}
        </Field>
      </Modal>
    </div>
  )
}
