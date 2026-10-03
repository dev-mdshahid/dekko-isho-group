import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { PreSectionTitle } from '../../components/ui/PreSectionTitle'
import { careerOpenPositions } from '../../data/career/content'
import { useWebflowClasses } from '../../hooks/useWebflowClasses'
import { SiteLayout } from '../../layouts/SiteLayout'
import { fetchJobs, fetchMeta, type PublicJob, type PublicMeta } from '../../lib/careersApi'
import { Bone } from '../../components/ui/Skeleton'
import { FiltersSkeleton, JobListSkeleton } from './CareerSkeletons'
import { JobCard } from './JobCard'
import { applyFilters, buildGroups, readFilters, sortJobs, writeFilters, type FilterGroup, type Filters } from './jobFilters'
import './careers.css'

type State = { status: 'loading' } | { status: 'error' } | { status: 'ready'; jobs: PublicJob[]; meta: PublicMeta | null }

function FilterGroups({
  groups,
  filters,
  onToggle,
  idPrefix,
}: {
  groups: FilterGroup[]
  filters: Filters
  onToggle: (param: string, value: string) => void
  idPrefix: string
}) {
  return (
    <>
      {groups.map((group) => (
        <fieldset key={group.param} className="careers-filter-group">
          <legend className="careers-filter-legend">{group.label}</legend>
          <div className="careers-filter-options">
            {group.options.map((o) => {
              const id = `${idPrefix}-${group.param}-${o.value}`
              const checked = filters.selected[group.param]?.includes(o.value) ?? false
              return (
                <label key={o.value} htmlFor={id} className={`careers-filter-option${o.count === 0 && !checked ? ' is-empty' : ''}`}>
                  <input id={id} type="checkbox" checked={checked} onChange={() => onToggle(group.param, o.value)} />
                  <span className="careers-filter-name">{o.label}</span>
                  <span className="careers-filter-count">{o.count}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
    </>
  )
}

export default function CareerJobsPage() {
  useWebflowClasses()
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => readFilters(params), [params])
  const [query, setQuery] = useState(filters.q)
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const drawerRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    let live = true
    Promise.all([fetchJobs(), fetchMeta().catch(() => null)])
      .then(([jobs, meta]) => live && setState({ status: 'ready', jobs, meta }))
      .catch(() => live && setState({ status: 'error' }))
    return () => {
      live = false
    }
  }, [attempt])

  useEffect(() => {
    if (query.trim() === filters.q) return
    const t = window.setTimeout(() => setParams(writeFilters({ ...filters, q: query }, params), { replace: true }), 300)
    return () => window.clearTimeout(t)
  }, [query, filters, params, setParams])

  const live: Filters = { ...filters, q: query }
  const jobs = state.status === 'ready' ? state.jobs : []
  const meta = state.status === 'ready' ? state.meta : null
  const results = sortJobs(applyFilters(jobs, meta, live), live.sort)
  const groups = buildGroups(jobs, meta, live)
  const activeCount = Object.values(filters.selected).reduce((n, v) => n + v.length, 0)

  const update = (next: Filters) => setParams(writeFilters(next, params), { replace: true })

  function toggle(param: string, value: string) {
    const current = filters.selected[param] ?? []
    const nextValues = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    update({ ...live, selected: { ...filters.selected, [param]: nextValues } })
  }

  function clearAll() {
    setQuery('')
    update({ q: '', selected: {}, sort: filters.sort })
  }

  const chips = groups.flatMap((g) =>
    (filters.selected[g.param] ?? []).map((value) => ({
      param: g.param,
      value,
      label: g.options.find((o) => o.value === value)?.label ?? value,
    })),
  )

  const { futureRole } = careerOpenPositions
  const total = jobs.length

  return (
    <SiteLayout>
      <PageMeta title="Open Roles | Careers at Dekko ISHO Group" />
      <main className="careers-page">
        <section className="careers-hero">
          <div className="career-content-container">
            <PreSectionTitle title="Careers" />
            <h1 className="careers-hero-title">Find your role at Dekko ISHO</h1>
            <p className="careers-hero-lead">
              {state.status === 'ready' && total > 0
                ? `${total} open ${total === 1 ? 'role' : 'roles'} across our businesses. Find the one that fits you.`
                : 'Explore roles across manufacturing, design, technology, sustainability and more.'}
            </p>
            <form className="careers-search" role="search" onSubmit={(e) => e.preventDefault()}>
              <Search className="careers-search-icon" size={20} aria-hidden="true" />
              <label htmlFor="careers-search-input" className="careers-visually-hidden">
                Search roles
              </label>
              <input
                id="careers-search-input"
                type="search"
                className="careers-search-input"
                placeholder="Search by job title, skill or keyword"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button type="button" className="careers-search-clear" aria-label="Clear search" onClick={() => setQuery('')}>
                  <X size={18} aria-hidden="true" />
                </button>
              )}
            </form>
          </div>
        </section>

        <section className="careers-body">
          <div className="career-content-container careers-layout">
            <aside className="careers-sidebar" aria-label="Filter roles">
              <div className="careers-sidebar-head">
                <h2 className="careers-sidebar-title">Filters</h2>
                {(activeCount > 0 || query) && (
                  <button type="button" className="careers-text-button" onClick={clearAll}>
                    Clear all
                  </button>
                )}
              </div>
              {state.status === 'ready' ? (
                <div className="careers-filter-stack careers-loaded">
                  <FilterGroups groups={groups} filters={live} onToggle={toggle} idPrefix="side" />
                </div>
              ) : state.status === 'loading' ? (
                <FiltersSkeleton />
              ) : null}
            </aside>

            <div className="careers-results">
              <div className="careers-results-bar">
                <p className="careers-results-count" aria-live="polite">
                  {state.status === 'loading' && <Bone width="4.5rem" />}
                  {state.status === 'ready' &&
                    (results.length === total
                      ? `${total} ${total === 1 ? 'role' : 'roles'}`
                      : `${results.length} of ${total} roles`)}
                </p>
                <div className="careers-results-actions">
                  <button
                    type="button"
                    className="careers-filter-toggle"
                    onClick={() => drawerRef.current?.showModal()}
                    aria-haspopup="dialog"
                  >
                    <SlidersHorizontal size={16} aria-hidden="true" />
                    Filters{activeCount ? ` (${activeCount})` : ''}
                  </button>
                  <label className="careers-sort">
                    <span className="careers-visually-hidden">Sort roles</span>
                    <select
                      value={filters.sort}
                      onChange={(e) => update({ ...live, sort: e.target.value === 'closing' ? 'closing' : 'newest' })}
                    >
                      <option value="newest">Newest first</option>
                      <option value="closing">Closing soon</option>
                    </select>
                  </label>
                </div>
              </div>

              {chips.length > 0 && (
                <ul className="careers-chips" aria-label="Active filters">
                  {chips.map((c) => (
                    <li key={`${c.param}-${c.value}`}>
                      <button type="button" className="careers-chip" onClick={() => toggle(c.param, c.value)}>
                        {c.label}
                        <X size={14} aria-hidden="true" />
                        <span className="careers-visually-hidden">Remove filter</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button type="button" className="careers-text-button" onClick={clearAll}>
                      Clear all
                    </button>
                  </li>
                </ul>
              )}

              {state.status === 'loading' && <JobListSkeleton count={4} />}

              {state.status === 'error' && (
                <div className="careers-empty">
                  <h2 className="careers-empty-title">We couldn’t load roles right now</h2>
                  <p>Please check your connection and try again.</p>
                  <button
                    type="button"
                    className="apply-button"
                    onClick={() => {
                      setState({ status: 'loading' })
                      setAttempt((n) => n + 1)
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {state.status === 'ready' && total === 0 && (
                <div className="careers-empty">
                  <h2 className="careers-empty-title">There are no open roles right now</h2>
                  <p>New roles are posted here first. In the meantime, share your CV for future openings.</p>
                  <Link to={futureRole.href} className="apply-button">
                    {futureRole.linkLabel}
                  </Link>
                </div>
              )}

              {state.status === 'ready' && total > 0 && results.length === 0 && (
                <div className="careers-empty">
                  <h2 className="careers-empty-title">No roles match your search</h2>
                  <p>Try fewer filters or a different keyword.</p>
                  <button type="button" className="apply-button apply-button--secondary" onClick={clearAll}>
                    Clear filters
                  </button>
                </div>
              )}

              {results.length > 0 && (
                <div className="careers-list careers-loaded">
                  {results.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              )}

              {state.status !== 'loading' && (
                <div className="career-future-role careers-future">
                  <div className="career-future-role-text">
                    <h2 className="career-future-role-question">{futureRole.question}</h2>
                    <p className="career-future-role-description">{futureRole.description}</p>
                  </div>
                  <Link to={futureRole.href} className="career-future-role-link">
                    {futureRole.linkLabel} →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <dialog
          ref={drawerRef}
          className="careers-drawer"
          aria-labelledby="careers-drawer-title"
          onClick={(e) => {
            if (e.target === drawerRef.current) drawerRef.current?.close()
          }}
        >
          <div className="careers-drawer-inner">
            <div className="careers-drawer-head">
              <h2 id="careers-drawer-title" className="careers-sidebar-title">
                Filters
              </h2>
              <button
                type="button"
                className="apply-icon-button"
                aria-label="Close filters"
                onClick={() => drawerRef.current?.close()}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="careers-drawer-body" data-lenis-prevent>
              <FilterGroups groups={groups} filters={live} onToggle={toggle} idPrefix="drawer" />
            </div>
            <div className="careers-drawer-foot">
              <button type="button" className="careers-text-button" onClick={clearAll} disabled={!activeCount && !query}>
                Clear all
              </button>
              <button type="button" className="apply-button" onClick={() => drawerRef.current?.close()}>
                Show {results.length} {results.length === 1 ? 'role' : 'roles'}
              </button>
            </div>
          </div>
        </dialog>
      </main>
    </SiteLayout>
  )
}
