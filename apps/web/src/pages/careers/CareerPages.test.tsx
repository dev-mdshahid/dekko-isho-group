import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { makeJob, makeJobDetail, meta } from '../../test/fixtures'

const fetchJobs = vi.fn()
const fetchMeta = vi.fn()
const fetchJob = vi.fn()
const fetchTalentPool = vi.fn()
vi.mock('../../lib/careersApi', async (original) => ({
  ...(await original<typeof import('../../lib/careersApi')>()),
  fetchJobs: () => fetchJobs(),
  fetchMeta: () => fetchMeta(),
  fetchJob: (...a: unknown[]) => fetchJob(...a),
  fetchTalentPool: (...a: unknown[]) => fetchTalentPool(...a),
}))
vi.mock('../../layouts/SiteLayout', () => ({ SiteLayout: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('../../hooks/useWebflowClasses', () => ({ useWebflowClasses: () => undefined }))
vi.mock('../../lib/smoothScroll', () => ({ scrollToElement: vi.fn() }))
vi.mock('../NotFoundPage', () => ({ NotFoundPage: () => <h1>Page not found</h1> }))

const { default: CareerJobsPage } = await import('./CareerJobsPage')
const { default: CareerJobPage } = await import('./CareerJobPage')
const { default: CareerApplyPage } = await import('./CareerApplyPage')

function LocationProbe() {
  const loc = useLocation()
  return <output data-testid="location">{loc.pathname + loc.search}</output>
}

function renderAt(path: string) {
  const user = userEvent.setup()
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/career/jobs" element={<CareerJobsPage />} />
          <Route path="/career/jobs/:slug" element={<CareerJobPage />} />
          <Route path="/career/apply" element={<CareerApplyPage />} />
        </Routes>
        <LocationProbe />
      </MemoryRouter>
    </HelmetProvider>,
  )
  return user
}

const tech = { id: 'technology', name: 'Technology', slug: 'technology' }
const roles = [
  makeJob({ id: 'a', slug: 'senior-merchandiser', title: 'Senior Merchandiser' }),
  makeJob({ id: 'b', slug: 'data-engineer', title: 'Data Engineer', department: tech, publishedAt: '2026-09-01T00:00:00Z' }),
  makeJob({ id: 'c', slug: 'it-support', title: 'IT Support', department: tech, publishedAt: '2026-08-01T00:00:00Z' }),
]

beforeEach(() => {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
  fetchJobs.mockResolvedValue(roles)
  fetchMeta.mockResolvedValue(meta)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('roles list', () => {
  it('lists roles and filters by department through the URL', async () => {
    const user = renderAt('/career/jobs?utm_source=linkedin')
    expect(await screen.findByRole('link', { name: 'Data Engineer' })).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)

    const sidebar = screen.getByRole('complementary', { name: 'Filter roles' })
    await user.click(within(sidebar).getByLabelText(/Technology/))
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByTestId('location')).toHaveTextContent('utm_source=linkedin&dept=technology')

    const chips = screen.getByRole('list', { name: 'Active filters' })
    await user.click(within(chips).getByRole('button', { name: /Technology/ }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('searches as you type and explains when nothing matches', async () => {
    const user = renderAt('/career/jobs')
    await screen.findByRole('link', { name: 'Data Engineer' })
    await user.type(screen.getByPlaceholderText(/Search by job title/), 'zzz')
    expect(await screen.findByText('No roles match your search')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('reads filters from a shared link', async () => {
    renderAt('/career/jobs?dept=technology&sort=closing')
    await screen.findByRole('link', { name: 'Data Engineer' })
    expect(screen.queryByRole('link', { name: 'Senior Merchandiser' })).not.toBeInTheDocument()
  })

  it('offers a retry when roles fail to load, and the talent pool when there are none', async () => {
    fetchJobs.mockRejectedValueOnce(new Error('offline'))
    const user = renderAt('/career/jobs')
    expect(await screen.findByText('We couldn’t load roles right now')).toBeInTheDocument()
    fetchJobs.mockResolvedValueOnce([])
    await user.click(screen.getByRole('button', { name: /Try again/ }))
    expect(await screen.findByText('There are no open roles right now')).toBeInTheDocument()
  })

  it('opens the filter drawer on small screens', async () => {
    const user = renderAt('/career/jobs')
    await screen.findByRole('link', { name: 'Data Engineer' })
    await user.click(screen.getByRole('button', { name: /^Filters/ }))
    const dialog = screen.getByRole('dialog', { hidden: true })
    expect(dialog).toHaveAttribute('open')
    await user.click(within(dialog).getByRole('button', { name: 'Close filters', hidden: true }))
  })
})

describe('role page', () => {
  it('shows the role, the form and similar roles', async () => {
    fetchJob.mockResolvedValue(makeJobDetail({ id: 'a', descriptionHtml: '<p>Lead buyers</p><script>alert(1)</script>' }))
    renderAt('/career/jobs/senior-merchandiser')
    expect(await screen.findByRole('heading', { level: 1, name: 'Senior Merchandiser' })).toBeInTheDocument()
    expect(screen.getByText('Lead buyers')).toBeInTheDocument()
    expect(document.querySelector('script:not([type])')).toBeNull()
    expect(screen.getByRole('button', { name: 'Submit application' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Data Engineer' })).toBeInTheDocument()
    expect(fetchJob).toHaveBeenCalledWith('senior-merchandiser', expect.any(AbortSignal))
  })

  it('explains when a role has closed', async () => {
    fetchJob.mockResolvedValue(makeJobDetail({ isOpen: false }))
    renderAt('/career/jobs/senior-merchandiser')
    expect(await screen.findByText('Closed')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit application' })).not.toBeInTheDocument()
  })

  it('shows the not-found page for unknown roles and a retry for errors', async () => {
    fetchJob.mockRejectedValueOnce(new ApiError(404, 'Not found'))
    renderAt('/career/jobs/nope')
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
  })

  it('retries after a network error', async () => {
    fetchJob.mockRejectedValueOnce(new ApiError(0, 'offline')).mockResolvedValueOnce(makeJobDetail())
    const user = renderAt('/career/jobs/senior-merchandiser')
    await user.click(await screen.findByRole('button', { name: 'Try again' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Senior Merchandiser' })).toBeInTheDocument()
  })

  it('copies the share link', async () => {
    fetchJob.mockResolvedValue(makeJobDetail())
    const writeText = vi.fn(async () => {})
    const user = renderAt('/career/jobs/senior-merchandiser')
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    await user.click(await screen.findByRole('button', { name: 'Copy link' }))
    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/\/share\/jobs\/senior-merchandiser$/))
    expect(await screen.findByRole('button', { name: 'Link copied' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Share on LinkedIn' })).toHaveAttribute('href', expect.stringContaining('linkedin.com'))
  })
})

describe('loading skeletons', () => {
  function deferred<T>() {
    let resolve!: (value: T) => void
    const promise = new Promise<T>((r) => (resolve = r))
    return { promise, resolve }
  }

  it('shows role cards and filters in the shape of the real list until roles arrive', async () => {
    const pending = deferred<typeof roles>()
    fetchJobs.mockReturnValueOnce(pending.promise)
    renderAt('/career/jobs')
    const loading = screen.getByRole('status', { name: 'Loading roles' })
    expect(loading.querySelectorAll('.careers-card--skeleton')).toHaveLength(4)
    expect(document.querySelector('.careers-sidebar .careers-skeleton-filters')).not.toBeNull()

    pending.resolve(roles)
    expect(await screen.findByRole('link', { name: 'Data Engineer' })).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading roles' })).not.toBeInTheDocument()
    expect(document.querySelector('.careers-skeleton')).toBeNull()
  })

  it('shows the role header, description and sidebar placeholders until the role arrives', async () => {
    const pending = deferred<ReturnType<typeof makeJobDetail>>()
    fetchJob.mockReturnValueOnce(pending.promise)
    renderAt('/career/jobs/senior-merchandiser')
    expect(screen.getByRole('status', { name: 'Loading role' })).toBeInTheDocument()
    expect(document.querySelector('.careers-glance .careers-skeleton')).not.toBeNull()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()

    pending.resolve(makeJobDetail({ id: 'a' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Senior Merchandiser' })).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading role' })).not.toBeInTheDocument()
  })

  it('shows placeholder cards for similar roles while they load', async () => {
    const pending = deferred<typeof roles>()
    fetchJobs.mockReturnValueOnce(pending.promise)
    fetchJob.mockResolvedValue(makeJobDetail({ id: 'a' }))
    renderAt('/career/jobs/senior-merchandiser')
    expect(await screen.findByRole('status', { name: 'Loading more roles' })).toBeInTheDocument()

    pending.resolve(roles)
    expect(await screen.findByRole('link', { name: 'Data Engineer' })).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading more roles' })).not.toBeInTheDocument()
  })

  it('shows the application form outline until the form is ready', async () => {
    const pending = deferred<ReturnType<typeof makeJobDetail>>()
    fetchTalentPool.mockReturnValueOnce(pending.promise)
    renderAt('/career/apply')
    expect(screen.getByRole('status', { name: 'Loading form' })).toBeInTheDocument()

    pending.resolve(makeJobDetail({ isTalentPool: true }))
    expect(await screen.findByRole('button', { name: 'Send my CV' })).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading form' })).not.toBeInTheDocument()
  })
})

describe('talent pool page', () => {
  it('shows the form when the talent pool is open', async () => {
    fetchTalentPool.mockResolvedValue(makeJobDetail({ isTalentPool: true }))
    renderAt('/career/apply')
    expect(await screen.findByRole('button', { name: 'Send my CV' })).toBeInTheDocument()
  })

  it('explains when the talent pool is not open', async () => {
    fetchTalentPool.mockRejectedValue(new ApiError(404, 'Not found'))
    renderAt('/career/apply')
    await waitFor(() => expect(screen.queryByLabelText('Loading form')).not.toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Send my CV' })).not.toBeInTheDocument()
  })
})
