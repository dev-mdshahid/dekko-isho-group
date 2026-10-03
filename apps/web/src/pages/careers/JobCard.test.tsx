import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { makeJob } from '../../test/fixtures'
import { JobCard } from './JobCard'

const day = 86_400_000

function renderCard(job = makeJob(), headingLevel: 2 | 3 = 2) {
  render(
    <MemoryRouter>
      <JobCard job={job} headingLevel={headingLevel} />
    </MemoryRouter>,
  )
}

describe('JobCard', () => {
  it('shows the role essentials and links to the role page', () => {
    renderCard()
    const link = screen.getByRole('link', { name: 'Senior Merchandiser' })
    expect(link).toHaveAttribute('href', '/career/jobs/senior-merchandiser')
    expect(screen.getByRole('heading', { level: 2 })).toContainElement(link)
    expect(screen.getByText('Merchandising')).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.getByText('৳80,000 – ৳120k/month')).toBeInTheDocument()
    expect(screen.getByText('Posted today')).toBeInTheDocument()
  })

  it('shows deadlines, closing-soon and card details', () => {
    renderCard(
      makeJob({
        publishedAt: new Date(Date.now() - 20 * day).toISOString(),
        deadline: new Date(Date.now() + 2 * day).toISOString(),
        salary: { min: null, max: null, currency: 'BDT', period: 'month', display: 'hidden' },
        customFields: [
          { key: 'shift', label: 'Shift', value: ['Day', 'Night'], showOnCard: true },
          { key: 'internal', label: 'Internal code', value: 'X1', showOnCard: false },
        ],
        locations: [],
        jobType: null,
        experienceLevel: '',
      }),
      3,
    )
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    expect(screen.getByText(/Closing soon · Apply by/)).toBeInTheDocument()
    expect(screen.getByText('Day, Night')).toBeInTheDocument()
    expect(screen.queryByText('Internal code:')).not.toBeInTheDocument()
    expect(screen.queryByText('New')).not.toBeInTheDocument()
    expect(screen.queryByText(/Salary/)).not.toBeInTheDocument()
  })
})
