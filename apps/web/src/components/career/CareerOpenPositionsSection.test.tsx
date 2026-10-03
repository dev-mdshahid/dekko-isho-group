import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { makeJob } from '../../test/fixtures'

const fetchJobs = vi.fn()
vi.mock('../../lib/careersApi', async (original) => ({
  ...(await original<typeof import('../../lib/careersApi')>()),
  fetchJobs: () => fetchJobs(),
}))

const { CareerOpenPositionsSection } = await import('./CareerOpenPositionsSection')

function renderSection() {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <CareerOpenPositionsSection />
    </MemoryRouter>,
  )
  return user
}

describe('CareerOpenPositionsSection', () => {
  beforeEach(() => {
    fetchJobs.mockReset()
  })

  it('lists the latest open roles with links to each role', async () => {
    fetchJobs.mockResolvedValue([makeJob({ id: 'a', slug: 'role-a', title: 'Role A' }), makeJob({ id: 'b', slug: 'role-b', title: 'Role B' })])
    renderSection()
    expect(await screen.findByRole('link', { name: /Role A/ })).toHaveAttribute('href', '/career/jobs/role-a')
    expect(screen.getByRole('link', { name: /Role B/ })).toHaveAttribute('href', '/career/jobs/role-b')
    expect(screen.getByText('Don’t see a role you’re interested in?')).toBeInTheDocument()
  })

  it('shows placeholder rows shaped like the real list while roles load', async () => {
    let resolve!: (jobs: ReturnType<typeof makeJob>[]) => void
    fetchJobs.mockReturnValue(new Promise((r) => (resolve = r)))
    renderSection()
    const loading = screen.getByRole('status', { name: 'Loading open roles' })
    const rows = loading.querySelectorAll('.career-position-link.is-skeleton')
    expect(rows).toHaveLength(3)
    for (const part of ['badge', 'title', 'location', 'type', 'apply']) {
      expect(rows[0].querySelector(`.career-position-${part} .careers-skeleton`)).not.toBeNull()
    }

    resolve([makeJob({ id: 'a', slug: 'role-a', title: 'Role A' })])
    expect(await screen.findByRole('link', { name: /Role A/ })).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Loading open roles' })).not.toBeInTheDocument()
  })

  it('shows at most six roles', async () => {
    fetchJobs.mockResolvedValue(Array.from({ length: 9 }, (_, i) => makeJob({ id: `j${i}`, slug: `role-${i}`, title: `Role ${i}` })))
    renderSection()
    await screen.findByText('Role 0')
    expect(screen.getAllByRole('heading', { level: 3, name: /^Role \d$/ })).toHaveLength(6)
  })

  it('shows a friendly empty state with a way to share a CV when nothing is open', async () => {
    fetchJobs.mockResolvedValue([])
    renderSection()
    expect(await screen.findByRole('heading', { name: 'No open roles right now' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Share your CV/ })).toHaveAttribute('href', '/career/apply')
    expect(screen.queryByText('Don’t see a role you’re interested in?')).not.toBeInTheDocument()
  })

  it('offers a retry when roles cannot be loaded', async () => {
    fetchJobs.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([makeJob({ title: 'Back Online' })])
    const user = renderSection()
    expect(await screen.findByRole('heading', { name: 'We couldn’t load our open roles' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Back Online')).toBeInTheDocument()
    expect(fetchJobs).toHaveBeenCalledTimes(2)
  })
})
