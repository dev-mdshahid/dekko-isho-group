import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, ExternalLink, Mail, Paperclip, Pencil, Phone } from 'lucide-react'
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  EDUCATION_LEVELS,
  type ApplicationStatus,
  type CvBankRow,
  type CvProfile,
  type FormField,
  type FormSchema,
} from '@dekko-isho/shared'
import { AppStatusBadge, Button, ErrorNote, Field, Input, Modal, Select, SkeletonRows, TagInput, Textarea, useUi } from '../components/ui'
import { api } from '../lib/api'
import { formatDate, formatDateTime, timeAgo } from '../lib/format'
import { useSession } from '../lib/session'
import { useApi } from '../lib/useApi'

type FileInfo = { key: string; contentType: string; size: number; originalName: string }
type Note = { id: string; kind: 'note' | 'status'; body: string; authorName: string; createdAt: string }

type ApplicationDetail = {
  id: string
  referenceId: string
  jobId: string
  jobTitle: string
  candidateId: string
  source: 'circular' | 'talent_pool'
  status: ApplicationStatus
  tags: string[]
  submittedAt: string
  fullName: string
  email: string
  phoneE164: string | null
  phoneRaw: string
  city: string | null
  expYears: number | null
  eduLevel: string | null
  currentTitle: string | null
  currentCompany: string | null
  answers: Record<string, unknown>
  cvFile: FileInfo
  attachments: Record<string, FileInfo>
  profile: CvProfile
  profileEdited: boolean
  form: FormSchema
  extraction: { status: string; method: string; model: string | null; rawText: string } | null
  notes: Note[]
  otherApplications: CvBankRow[]
}

export default function ApplicationPage() {
  const { id = '' } = useParams()
  // Keyed so drafts (note, tab, edit dialog) never carry over to another applicant.
  return <ApplicationView key={id} id={id} />
}

function ApplicationView({ id }: { id: string }) {
  const { can } = useSession()
  const { toast } = useUi()
  const { data, error, loading, setData } = useApi<ApplicationDetail>(`/api/hr/applications/${id}`)
  const tagSuggestions = useApi<{ tags: string[] }>('/api/hr/cv-bank/tags')
  const [tab, setTab] = useState<'cv' | 'answers' | 'profile' | 'text'>('cv')
  const [note, setNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  if (error) {
    return (
      <div className="page">
        <ErrorNote error={error} />
      </div>
    )
  }
  if (loading || !data) {
    return (
      <div className="page">
        <SkeletonRows rows={8} />
      </div>
    )
  }

  const update = async (patch: { status?: ApplicationStatus; tags?: string[] }) => {
    const before = data
    setData({ ...data, ...patch })
    try {
      await api(`/api/hr/applications/${id}`, { method: 'PATCH', body: patch })
      if (patch.status) {
        toast(`Moved to ${APPLICATION_STATUS_LABELS[patch.status]}`)
        const fresh = await api<ApplicationDetail>(`/api/hr/applications/${id}`)
        setData(fresh)
      }
    } catch (err) {
      setData(before)
      toast((err as Error).message, 'error')
    }
  }

  const addNote = async () => {
    if (!note.trim()) return
    setSavingNote(true)
    try {
      const created = await api<Note>(`/api/hr/applications/${id}/notes`, { body: { body: note.trim() } })
      setData({ ...data, notes: [created, ...data.notes] })
      setNote('')
    } catch (err) {
      toast((err as Error).message, 'error')
    } finally {
      setSavingNote(false)
    }
  }

  const openFile = async (attachment?: string) => {
    // Open the tab during the click so Safari doesn't block it, then point it at a fresh link.
    const win = window.open('', '_blank')
    if (win) win.opener = null
    try {
      const file = await api<{ url: string }>(`/api/hr/applications/${id}/file`, { query: { attachment } })
      if (win) win.location.href = file.url
      else window.location.assign(file.url)
    } catch (err) {
      win?.close()
      toast((err as Error).message, 'error')
    }
  }

  const phone = data.phoneE164 ?? data.phoneRaw

  return (
    <div className="page">
      <Link to="/cv-bank" className="back">
        <ArrowLeft size={16} /> CV Bank
      </Link>
      <div className="page-head">
        <div style={{ minWidth: 0 }}>
          <div className="row">
            <h1>{data.fullName}</h1>
            <AppStatusBadge status={data.status} />
          </div>
          <p>
            {data.source === 'talent_pool' ? 'Future roles (CV drop)' : data.jobTitle} · Applied {formatDateTime(data.submittedAt)} · Ref {data.referenceId}
          </p>
        </div>
        <div className="page-actions">
          <a className="btn" href={`mailto:${data.email}`}>
            <Mail size={15} /> Email
          </a>
          {phone ? (
            <a className="btn" href={`tel:${phone}`}>
              <Phone size={15} /> Call
            </a>
          ) : null}
          <Button onClick={() => void openFile()}>
            <Download size={15} /> CV
          </Button>
        </div>
      </div>

      <div className="split">
        <div className="card" style={{ minWidth: 0 }}>
          <div className="tabs" role="tablist" style={{ padding: '0 12px', marginBottom: 0 }}>
            {(
              [
                ['cv', 'CV'],
                ['answers', 'Answers'],
                ['profile', 'Profile'],
                ['text', 'CV text'],
              ] as const
            ).map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={`tab ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>
                {label}
              </button>
            ))}
          </div>
          <div className="card-body">
            {tab === 'cv' ? <CvViewer id={id} file={data.cvFile} onOpen={() => void openFile()} /> : null}
            {tab === 'answers' ? <Answers form={data.form} answers={data.answers} attachments={data.attachments} onOpen={(k) => void openFile(k)} /> : null}
            {tab === 'profile' ? <ProfileView profile={data.profile} edited={data.profileEdited} canEdit={can('edit')} onEdit={() => setEditOpen(true)} /> : null}
            {tab === 'text' ? (
              data.extraction?.rawText ? <div className="raw-text">{data.extraction.rawText}</div> : <p className="muted">We couldn’t read text from this CV. Open the file to view it.</p>
            ) : null}
          </div>
        </div>

        <div className="stack">
          <section className="card card-pad stack">
            <Field label="Stage">
              {(fid) => (
                <Select id={fid} value={data.status} disabled={!can('edit')} onChange={(e) => void update({ status: e.target.value as ApplicationStatus })}>
                  {APPLICATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {APPLICATION_STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            {can('edit') ? (
              <Field label="Tags" hint="Press Enter to add.">
                {() => <TagInput value={data.tags} suggestions={tagSuggestions.data?.tags} onChange={(tags) => void update({ tags })} placeholder="e.g. strong, follow up" />}
              </Field>
            ) : data.tags.length ? (
              <div className="chips">
                {data.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          <section className="card card-pad">
            <dl className="kv">
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${data.email}`}>{data.email}</a>
              </dd>
              <dt>Phone</dt>
              <dd className="num">{phone || '—'}</dd>
              <dt>Lives in</dt>
              <dd>{data.city ?? '—'}</dd>
              <dt>Experience</dt>
              <dd className="num">{data.expYears != null ? `${data.expYears} years` : '—'}</dd>
              <dt>Education</dt>
              <dd>{data.eduLevel ?? '—'}</dd>
              <dt>Current role</dt>
              <dd>{[data.currentTitle, data.currentCompany].filter(Boolean).join(' at ') || '—'}</dd>
            </dl>
            <div style={{ marginTop: 12 }}>
              <Link to={`/candidates/${data.candidateId}`} className="small">
                View candidate history
              </Link>
            </div>
          </section>

          <section className="card card-pad stack">
            <h3>Notes</h3>
            {can('edit') ? (
              <div className="stack-sm">
                <Textarea rows={3} placeholder="Add a note for your team…" value={note} onChange={(e) => setNote(e.target.value)} aria-label="New note" />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="sm" variant="primary" onClick={() => void addNote()} disabled={!note.trim()} loading={savingNote}>
                    Add note
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="timeline">
              {data.notes.length ? (
                data.notes.map((n) => (
                  <div key={n.id} className={`timeline-item ${n.kind}`}>
                    <span className="dot" />
                    <div style={{ minWidth: 0 }}>
                      <div className={n.kind === 'status' ? 'small muted' : ''} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                        {n.body}
                      </div>
                      <div className="small muted">
                        {n.authorName} · {timeAgo(n.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="small muted">No notes yet.</p>
              )}
            </div>
          </section>

          {data.otherApplications.length ? (
            <section className="card card-pad stack-sm">
              <h3>Also applied for</h3>
              {data.otherApplications.map((o) => (
                <Link key={o.applicationId} to={`/applications/${o.applicationId}`} className="spread" style={{ color: 'inherit', textDecoration: 'none', padding: '4px 0' }}>
                  <span className="truncate">{o.source === 'talent_pool' ? 'Future roles' : o.jobTitle}</span>
                  <span className="row small muted" style={{ flex: 'none' }}>
                    {formatDate(o.submittedAt)} <AppStatusBadge status={o.status} />
                  </span>
                </Link>
              ))}
            </section>
          ) : null}
        </div>
      </div>

      {editOpen ? (
        <ProfileEditor
          profile={data.profile}
          onClose={() => setEditOpen(false)}
          onSaved={(profile) => {
            setData({
              ...data,
              profile,
              profileEdited: true,
              expYears: profile.totalExperienceYears ?? data.expYears,
              eduLevel: profile.highestEducationLevel,
              city: profile.location.city ?? data.city,
              currentTitle: profile.currentTitle ?? data.currentTitle,
              currentCompany: profile.currentCompany ?? data.currentCompany,
            })
            setEditOpen(false)
            toast('Profile updated')
          }}
          applicationId={id}
        />
      ) : null}
    </div>
  )
}

function CvViewer({ id, file, onOpen }: { id: string; file: FileInfo; onOpen: () => void }) {
  const { data, error, loading } = useApi<{ url: string; contentType: string; name: string }>(`/api/hr/applications/${id}/file`)
  if (loading) return <SkeletonRows rows={6} />
  if (error || !data) return <ErrorNote error={error ?? 'We couldn’t open this CV.'} />
  if (file.contentType === 'application/pdf') {
    return (
      <object className="cv-frame" data={`${data.url}#view=FitH`} type="application/pdf" aria-label="CV preview">
        <div className="empty">
          <h3>This browser can’t show PDFs here</h3>
          <p>Open the CV in a new tab to read it.</p>
          <button type="button" className="btn btn-primary" onClick={onOpen}>
            <ExternalLink size={15} /> Open CV
          </button>
        </div>
      </object>
    )
  }
  if (file.contentType.startsWith('image/')) return <img src={data.url} alt="CV" style={{ maxWidth: '100%', borderRadius: 6 }} />
  return (
    <div className="empty">
      <h3>Preview isn’t available for Word files</h3>
      <p>Download the file to read it, or check the CV text and profile tabs.</p>
      <button type="button" className="btn btn-primary" onClick={onOpen}>
        <ExternalLink size={15} /> Open {file.originalName}
      </button>
    </div>
  )
}

function renderAnswer(field: FormField, value: unknown, attachments: Record<string, FileInfo>, onOpen: (k: string) => void) {
  if (value == null || value === '' || (Array.isArray(value) && !value.length)) return <span className="muted">—</span>
  switch (field.type) {
    case 'boolean':
    case 'consent':
      return value ? 'Yes' : 'No'
    case 'url':
      return (
        <a href={String(value)} target="_blank" rel="noreferrer noopener">
          {String(value)}
        </a>
      )
    case 'file':
      return attachments[field.key] ? (
        <Button size="sm" onClick={() => onOpen(field.key)}>
          <Paperclip size={14} /> {attachments[field.key].originalName}
        </Button>
      ) : (
        '—'
      )
    case 'education':
      return (
        <div>
          {(value as Array<Record<string, string>>).map((e, i) => (
            <div key={i} className="entry">
              <div style={{ fontWeight: 500 }}>{[e.degree, e.field].filter(Boolean).join(', ')}</div>
              <div className="small muted">{[e.institution, e.endYear, e.result].filter(Boolean).join(' · ')}</div>
            </div>
          ))}
        </div>
      )
    case 'experience':
      return (
        <div>
          {(value as Array<Record<string, string>>).map((e, i) => (
            <div key={i} className="entry">
              <div style={{ fontWeight: 500 }}>
                {e.title}
                {e.company ? ` · ${e.company}` : ''}
              </div>
              <div className="small muted">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</div>
              {e.description ? <p className="small" style={{ marginTop: 4, whiteSpace: 'pre-wrap' }}>{e.description}</p> : null}
            </div>
          ))}
        </div>
      )
    default:
      return Array.isArray(value) ? value.join(', ') : <span style={{ whiteSpace: 'pre-wrap' }}>{String(value)}</span>
  }
}

function Answers({ form, answers, attachments, onOpen }: { form: FormSchema; answers: Record<string, unknown>; attachments: Record<string, FileInfo>; onOpen: (k: string) => void }) {
  const fields = form.fields.filter((f) => f.type !== 'cv' && f.type !== 'consent')
  return (
    <dl className="kv" style={{ gridTemplateColumns: 'minmax(140px, 220px) minmax(0, 1fr)' }}>
      {fields.map((f) => (
        <div key={f.id} style={{ display: 'contents' }}>
          <dt>{f.label}</dt>
          <dd>{renderAnswer(f, answers[f.key], attachments, onOpen)}</dd>
        </div>
      ))}
    </dl>
  )
}

function ProfileView({ profile: p, edited, canEdit, onEdit }: { profile: CvProfile; edited: boolean; canEdit: boolean; onEdit: () => void }) {
  return (
    <div className="stack">
      <div className="spread">
        <p className="small muted">{edited ? 'Edited by your team.' : 'Read from the CV. Check the important details before relying on them.'}</p>
        {canEdit ? (
          <Button size="sm" onClick={onEdit}>
            <Pencil size={14} /> Edit
          </Button>
        ) : null}
      </div>
      {p.summary ? <p>{p.summary}</p> : null}
      {p.skills.length ? (
        <div className="chips">
          {p.skills.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
      ) : null}
      {p.experience.length ? (
        <div>
          <h3 style={{ marginBottom: 8 }}>Experience</h3>
          {p.experience.map((e, i) => (
            <div key={i} className="entry">
              <div style={{ fontWeight: 500 }}>
                {e.title}
                {e.company ? ` · ${e.company}` : ''}
              </div>
              <div className="small muted">{[e.startDate, e.endDate, e.location].filter(Boolean).join(' · ')}</div>
              {e.description ? <p className="small" style={{ marginTop: 4 }}>{e.description}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
      {p.education.length ? (
        <div>
          <h3 style={{ marginBottom: 8 }}>Education</h3>
          {p.education.map((e, i) => (
            <div key={i} className="entry">
              <div style={{ fontWeight: 500 }}>{[e.degree, e.field].filter(Boolean).join(', ')}</div>
              <div className="small muted">{[e.institution, e.endYear, e.result].filter(Boolean).join(' · ')}</div>
            </div>
          ))}
        </div>
      ) : null}
      {p.languages.length || p.certifications.length ? (
        <dl className="kv">
          {p.languages.length ? (
            <>
              <dt>Languages</dt>
              <dd>{p.languages.join(', ')}</dd>
            </>
          ) : null}
          {p.certifications.length ? (
            <>
              <dt>Certifications</dt>
              <dd>{p.certifications.map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(', ')).join(' · ')}</dd>
            </>
          ) : null}
        </dl>
      ) : null}
    </div>
  )
}

function ProfileEditor({ profile, applicationId, onClose, onSaved }: { profile: CvProfile; applicationId: string; onClose: () => void; onSaved: (p: CvProfile) => void }) {
  const { toast } = useUi()
  const [p, setP] = useState<CvProfile>(profile)
  const [busy, setBusy] = useState(false)
  const set = (patch: Partial<CvProfile>) => setP((x) => ({ ...x, ...patch }))
  const text = (v: string) => (v.trim() ? v : null)

  const save = async () => {
    setBusy(true)
    try {
      const res = await api<{ profile: CvProfile }>(`/api/hr/applications/${applicationId}/profile`, { method: 'PUT', body: p })
      onSaved(res.profile)
    } catch (err) {
      toast((err as Error).message, 'error')
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      wide
      onClose={onClose}
      title="Edit profile"
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => void save()} loading={busy}>
            Save profile
          </Button>
        </>
      }
    >
      <div className="stack">
        <div className="grid-2">
          <Field label="Full name">{(id) => <Input id={id} value={p.fullName ?? ''} onChange={(e) => set({ fullName: text(e.target.value) })} />}</Field>
          <Field label="City">{(id) => <Input id={id} value={p.location.city ?? ''} onChange={(e) => set({ location: { ...p.location, city: text(e.target.value) } })} />}</Field>
          <Field label="Current title">{(id) => <Input id={id} value={p.currentTitle ?? ''} onChange={(e) => set({ currentTitle: text(e.target.value) })} />}</Field>
          <Field label="Current company">{(id) => <Input id={id} value={p.currentCompany ?? ''} onChange={(e) => set({ currentCompany: text(e.target.value) })} />}</Field>
          <Field label="Total experience (years)">
            {(id) => (
              <Input id={id} type="number" min={0} max={70} step={0.5} value={p.totalExperienceYears ?? ''} onChange={(e) => set({ totalExperienceYears: e.target.value === '' ? null : Number(e.target.value) })} />
            )}
          </Field>
          <Field label="Highest education">
            {(id) => (
              <Select id={id} value={p.highestEducationLevel ?? ''} onChange={(e) => set({ highestEducationLevel: (e.target.value || null) as CvProfile['highestEducationLevel'] })}>
                <option value="">Not stated</option>
                {EDUCATION_LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            )}
          </Field>
        </div>
        <Field label="Skills" hint="Press Enter to add.">
          {() => <TagInput value={p.skills} onChange={(skills) => set({ skills })} />}
        </Field>
        <Field label="Languages">{() => <TagInput value={p.languages} onChange={(languages) => set({ languages })} />}</Field>
        <Field label="Summary">{(id) => <Textarea id={id} rows={4} value={p.summary ?? ''} onChange={(e) => set({ summary: text(e.target.value) })} />}</Field>
      </div>
    </Modal>
  )
}
