import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Breadcrumbs } from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('links each parent page and marks the current page', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs
          items={[
            { label: 'Careers', to: '/career' },
            { label: 'Jobs', to: '/career/jobs' },
            { label: 'Sustainability Analyst' },
          ]}
        />
      </MemoryRouter>,
    )

    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Careers' })).toHaveAttribute('href', '/career')
    expect(screen.getByRole('link', { name: 'Jobs' })).toHaveAttribute('href', '/career/jobs')
    expect(screen.getByText('Sustainability Analyst')).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByRole('link', { name: 'Sustainability Analyst' })).not.toBeInTheDocument()
  })
})
