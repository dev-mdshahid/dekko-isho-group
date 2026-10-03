import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Download, FileSearch, Search, SlidersHorizontal, X } from 'lucide-react'
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  EDUCATION_LEVELS,
  type CustomFieldDefinition,
  type CvBankResponse,
  type Job,
  type LookupItem,
} from '@dekko-isho/shared'
import { AppStatusBadge, Button, Empty, ErrorNote, Field, Input, Select, SkeletonRows, useUi } from '../components/ui'
import { apiDownload } from '../lib/api'
import { formatDate, plural } from '../lib/format'
import { useSession } from '../lib/session'
import { useApi } from '../lib/useApi'

type Settings = { departments: LookupItem[]; locations: LookupItem[]; jobTypes: LookupItem[]; customFields: CustomFieldDefinition[] }
type JobRow = Pick<Job, 'id' | 'title' | 'status' | 'isTalentPool'>

const FILTER_KEYS = ['q', 'text', 'jobId', 'departmentId', 'locationId', 'jobTypeId', 'status', 'source', 'minExp', 'maxExp', 'education', 'skills', 'city', 'tag', 'from', 'to', 'custom', 'sort', 'page'] as const

function useDebounced(value: string, ms = 350) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function CvBankPage() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const { can } = useSession()
  const { toast } = useUi()
  const get = (k: (typeof FILTER_KEYS)[number]) => params.get(k) ?? ''

  const query = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) ?? undefined]))
  const { data, error, loading } = useApi<CvBankResponse>('/api/hr/cv-bank', query)
  const settings = useApi<Settings>('/api/hr/settings')
  const jobs = useApi<{ jobs: JobRow[] }>('/api/hr/jobs')
  const tags = useApi<{ tags: string[] }>('/api/hr/cv-bank/tags')

  const setParam = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(updates)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    if (!('page' in updates)) next.delete('page')
    setParams(next, { replace: true })
  }

  const [showFilters, setShowFilters] = useState(false)
  const [qDraft, setQDraft] = useState(get('q'))
  const [textDraft, setTextDraft] = useState(get('text'))
  // Follow outside URL changes (e.g. the sidebar link clearing filters) without fighting the user's typing.
  const [urlQ, setUrlQ] = useState(get('q'))
  const [urlText, setUrlText] = useState(get('text'))
  if (get('q') !== urlQ) {
    setUrlQ(get('q'))
    setQDraft(get('q'))
  }
  if (get('text') !== urlText) {
    setUrlText(get('text'))
    setTextDraft(get('text'))
  }
  const qDebounced = useDebounced(qDraft)
  const textDebounced = useDebounced(textDraft)
  useEffect(() => {
    if (qDebounced !== (params.get('q') ?? '')) setParam({ q: qDebounced || null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced])
  useEffect(() => {
    if (textDebounced !== (params.get('text') ?? '')) setParam({ text: textDebounced || null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textDebounced])

  const listParam = (k: 'status' | 'skills' | 'education' | 'custom') => (get(k) ? get(k).split(',').filter(Boolean) : [])
  const toggleList = (k: 'status' | 'skills' | 'education' | 'custom', value: string) => {
    const list = listParam(k)
    const next = list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
    setParam({ [k]: next.join(',') || null })
  }

  const activeCount = FILTER_KEYS.filter((k) => !['sort', 'page', 'q', 'text'].includes(k) && params.get(k)).length
  const clearAll = () => {
    setQDraft('')
    setTextDraft('')
    setParams(new URLSearchParams(), { replace: true })
  }

  const exportCsv = async () => {
    try {
      await apiDownload('/api/hr/cv-bank/export', query, 'cv-bank.csv')
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  const s = settings.data
  const page = Number(get('page') || 1)
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1
  const filterableCustom = s?.customFields.filter((f) => f.filterCvBank && (f.type === 'select' || f.type === 'multiselect' || f.type === 'boolean')) ?? []

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>CV Bank</h1>
          <p>Every application in one place. Search by name, phone or anything written in the CV.</p>
        </div>
        {can('edit') ? (
          <Button onClick={() => void exportCsv()} disabled={!data?.total}>
            <Download size={15} /> Export {data?.total ? plural(data.total, 'row') : ''}
          </Button>
        ) : null}
      </div>

      <div className="cvbank">
        <aside id="cvbank-filters" className={`card card-pad filters ${showFilters ? 'open' : ''}`} aria-label="Filters">
          <div className="spread">
            <h3>Filters</h3>
            {activeCount ? (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                Clear all
              </Button>
            ) : null}
          </div>

          <Field label="Circular">
            {(id) => (
              <Select id={id} value={get('jobId')} onChange={(e) => setParam({ jobId: e.target.value || null })}>
                <option value="">All circulars</option>
                {jobs.data?.jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.isTalentPool ? 'Future roles (CV drop)' : j.title}
                    {j.status !== 'published' ? ` (${j.status})` : ''}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <div className="field">
            <span className="filter-label">
              Stage
            </span>
            <div className="chips">
              {APPLICATION_STATUSES.map((st) => (
                <button key={st} type="button" className={`chip ${listParam('status').includes(st) ? 'on' : ''}`} aria-pressed={listParam('status').includes(st)} onClick={() => toggleList('status', st)}>
                  {APPLICATION_STATUS_LABELS[st]}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="filter-label">
              Experience (years)
            </span>
            <div className="row" style={{ flexWrap: 'nowrap' }}>
              <Input type="number" min={0} placeholder="Min" aria-label="Minimum years" value={get('minExp')} onChange={(e) => setParam({ minExp: e.target.value || null })} />
              <span className="muted">–</span>
              <Input type="number" min={0} placeholder="Max" aria-label="Maximum years" value={get('maxExp')} onChange={(e) => setParam({ maxExp: e.target.value || null })} />
            </div>
          </div>

          <Field label="Education (at least)">
            {(id) => (
              <Select id={id} value={get('education')} onChange={(e) => setParam({ education: e.target.value || null })}>
                <option value="">Any</option>
                {EDUCATION_LEVELS.filter((l) => l !== 'Other').map((l) => (
                  <option key={l} value={l}>
                    {l === 'Master' ? "Master's" : l === 'Bachelor' ? "Bachelor's" : l}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {data?.facets.skills.length || listParam('skills').length ? (
            <div className="field">
              <span className="filter-label">
                Skills
              </span>
              <div className="chips">
                {[...new Set([...listParam('skills'), ...(data?.facets.skills.map((f) => f.value) ?? [])])].slice(0, 18).map((sk) => {
                  const on = listParam('skills').includes(sk)
                  const count = data?.facets.skills.find((f) => f.value === sk)?.count
                  return (
                    <button key={sk} type="button" className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleList('skills', sk)}>
                      {sk}
                      {count && !on ? <span className="muted num">{count}</span> : null}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          <Field label="Department">
            {(id) => (
              <Select id={id} value={get('departmentId')} onChange={(e) => setParam({ departmentId: e.target.value || null })}>
                <option value="">All departments</option>
                {s?.departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field label="Location">
            {(id) => (
              <Select id={id} value={get('locationId')} onChange={(e) => setParam({ locationId: e.target.value || null })}>
                <option value="">All locations</option>
                {s?.locations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          {data?.facets.cities.length ? (
            <Field label="Lives in">
              {(id) => (
                <Select id={id} value={get('city')} onChange={(e) => setParam({ city: e.target.value || null })}>
                  <option value="">Anywhere</option>
                  {data.facets.cities.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value} ({c.count})
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          ) : null}

          <Field label="Source">
            {(id) => (
              <Select id={id} value={get('source')} onChange={(e) => setParam({ source: e.target.value || null })}>
                <option value="">All</option>
                <option value="circular">Applied to a circular</option>
                <option value="talent_pool">Future roles (CV drop)</option>
              </Select>
            )}
          </Field>

          {tags.data?.tags.length ? (
            <Field label="Tag">
              {(id) => (
                <Select id={id} value={get('tag')} onChange={(e) => setParam({ tag: e.target.value || null })}>
                  <option value="">Any</option>
                  {tags.data!.tags.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              )}
            </Field>
          ) : null}

          {filterableCustom.map((f) => (
            <div key={f.id} className="field">
              <span className="filter-label">
                {f.label}
              </span>
              <div className="chips">
                {(f.type === 'boolean' ? ['true', 'false'] : f.options).map((o) => {
                  const v = `${f.key}:${o}`
                  const on = listParam('custom').includes(v)
                  return (
                    <button key={o} type="button" className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => toggleList('custom', v)}>
                      {f.type === 'boolean' ? (o === 'true' ? 'Yes' : 'No') : o}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="field">
            <span className="filter-label">
              Applied between
            </span>
            <Input type="date" aria-label="From date" value={get('from')} onChange={(e) => setParam({ from: e.target.value || null })} />
            <Input type="date" aria-label="To date" value={get('to')} onChange={(e) => setParam({ to: e.target.value || null })} />
          </div>
        </aside>

        <section className="card" style={{ minWidth: 0 }}>
          <div className="filter-bar">
            <div className="input-group">
              <Search size={16} />
              <Input placeholder="Name, email or phone" value={qDraft} onChange={(e) => setQDraft(e.target.value)} aria-label="Search by name, email or phone" />
            </div>
            <div className="input-group">
              <FileSearch size={16} />
              <Input placeholder="Search inside CVs, e.g. merchandising, SAP" value={textDraft} onChange={(e) => setTextDraft(e.target.value)} aria-label="Search inside CVs" />
            </div>
            <Button className="filters-toggle" aria-expanded={showFilters} aria-controls="cvbank-filters" onClick={() => setShowFilters((v) => !v)}>
              <SlidersHorizontal size={15} /> Filters{activeCount ? ` (${activeCount})` : ''}
            </Button>
            <Select value={get('sort') || 'newest'} onChange={(e) => setParam({ sort: e.target.value === 'newest' ? null : e.target.value })} aria-label="Sort" style={{ width: 'auto' }}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="experience">Most experience</option>
              <option value="name">Name A–Z</option>
            </Select>
          </div>

          {activeCount ? (
            <div className="row" style={{ padding: '10px 16px 0' }}>
              {FILTER_KEYS.filter((k) => !['sort', 'page', 'q', 'text'].includes(k) && params.get(k)).map((k) => (
                <span key={k} className="chip on">
                  {labelFor(k, get(k), s, jobs.data?.jobs)}
                  <button type="button" aria-label="Remove filter" onClick={() => setParam({ [k]: null })}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : null}

          <ErrorNote error={error} />
          {loading && !data ? (
            <SkeletonRows rows={8} />
          ) : data?.rows.length ? (
            <>
              <div className="table-wrap" style={{ opacity: loading ? 0.6 : 1 }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Applied for</th>
                      <th>Experience</th>
                      <th>Education</th>
                      <th>Stage</th>
                      <th>Applied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map((r) => (
                      <tr key={r.applicationId} className="clickable" onClick={() => navigate(`/applications/${r.applicationId}`)}>
                        <td style={{ maxWidth: 280 }}>
                          <div className="t-title truncate">{r.fullName}</div>
                          <div className="t-sub truncate">{[r.currentTitle, r.currentCompany].filter(Boolean).join(' at ') || r.email}</div>
                          {r.skills.length ? <div className="t-sub truncate">{r.skills.slice(0, 4).join(' · ')}</div> : null}
                        </td>
                        <td style={{ maxWidth: 220 }}>
                          <div className="truncate">{r.source === 'talent_pool' ? 'Future roles' : r.jobTitle}</div>
                          <div className="t-sub truncate">{r.departmentName}</div>
                        </td>
                        <td className="num">{r.expYears != null ? `${r.expYears} yrs` : <span className="muted">—</span>}</td>
                        <td>{r.eduLevel ?? <span className="muted">—</span>}</td>
                        <td>
                          <AppStatusBadge status={r.status} />
                          {r.tags.length ? <div className="t-sub truncate" style={{ marginTop: 4 }}>{r.tags.join(', ')}</div> : null}
                        </td>
                        <td className="small muted num">{formatDate(r.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="pagination">
                <span className="small muted num">
                  {(page - 1) * data.pageSize + 1}–{Math.min(page * data.pageSize, data.total)} of {data.total.toLocaleString()}
                </span>
                <div className="row">
                  <Button size="sm" disabled={page <= 1} onClick={() => setParam({ page: String(page - 1) })}>
                    Previous
                  </Button>
                  <Button size="sm" disabled={page >= totalPages} onClick={() => setParam({ page: String(page + 1) })}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Empty title={activeCount || get('q') || get('text') ? 'No candidates match' : 'No applications yet'} action={activeCount || get('q') || get('text') ? <Button onClick={clearAll}>Clear search and filters</Button> : undefined}>
              {activeCount || get('q') || get('text') ? 'Try removing a filter or searching for something broader.' : 'Applications appear here as soon as candidates apply.'}
            </Empty>
          )}
        </section>
      </div>
    </div>
  )
}

function labelFor(key: string, value: string, s: Settings | null, jobs?: JobRow[]) {
  const find = (items: LookupItem[] | undefined) => items?.find((x) => x.id === value)?.name ?? value
  switch (key) {
    case 'jobId':
      return jobs?.find((j) => j.id === value)?.title ?? 'Circular'
    case 'departmentId':
      return find(s?.departments)
    case 'locationId':
      return find(s?.locations)
    case 'jobTypeId':
      return find(s?.jobTypes)
    case 'status':
      return value
        .split(',')
        .map((v) => APPLICATION_STATUS_LABELS[v as keyof typeof APPLICATION_STATUS_LABELS] ?? v)
        .join(', ')
    case 'source':
      return value === 'talent_pool' ? 'Future roles' : 'Circulars'
    case 'minExp':
      return `${value}+ yrs`
    case 'maxExp':
      return `≤ ${value} yrs`
    case 'education':
      return `${value}+`
    case 'skills':
      return value.split(',').join(', ')
    case 'from':
      return `From ${value}`
    case 'to':
      return `Until ${value}`
    case 'custom':
      return value.split(',').map((v) => v.split(':')[1]).join(', ')
    default:
      return value
  }
}
