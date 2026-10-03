import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { makeJobDetail } from '../../test/fixtures'

const uploadCv = vi.fn()
const submitApplication = vi.fn()
vi.mock('../../lib/careersApi', async (original) => ({
  ...(await original<typeof import('../../lib/careersApi')>()),
  uploadCv: (...args: unknown[]) => uploadCv(...args),
  submitApplication: (...args: unknown[]) => submitApplication(...args),
}))
vi.mock('../../lib/smoothScroll', () => ({ scrollToElement: vi.fn() }))

const { ApplicationForm } = await import('./ApplicationForm')

const cvFile = () => new File(['%PDF-1.4'], 'Rahim CV.pdf', { type: 'application/pdf' })

function uploadResolves(body: object) {
  uploadCv.mockImplementation((_file: File, _job: string, onProgress?: (n: number) => void) => {
    onProgress?.(0.4)
    onProgress?.(1)
    return { promise: Promise.resolve(body), abort: vi.fn() }
  })
}

function renderForm(talentPool = false) {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <ApplicationForm job={makeJobDetail()} talentPool={talentPool} />
    </MemoryRouter>,
  )
  return user
}

const cvInput = () => document.getElementById('apply-field-cv') as HTMLInputElement

beforeEach(() => {
  uploadCv.mockReset()
  submitApplication.mockReset()
})

describe('ApplicationForm', () => {
  it('opens the file picker when the drop area is clicked', async () => {
    const user = renderForm()
    const click = vi.fn()
    cvInput().addEventListener('click', click)
    await user.click(screen.getByText('Choose a file'))
    expect(click).toHaveBeenCalled()
  })

  it('fills in details from the CV and lets the applicant submit', async () => {
    uploadResolves({ uploadId: 'u1', fileName: 'Rahim CV.pdf', status: 'succeeded', autofill: { fullName: 'Rahim Uddin Ahmed', email: 'rahim@example.com', phone: '+8801711223344', experienceYears: 6 } })
    submitApplication.mockResolvedValue({ referenceId: 'DIG-2026-00001' })
    const user = renderForm()

    await user.upload(cvInput(), cvFile())
    expect(await screen.findByText(/We filled in 4 details from your CV/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Full name/)).toHaveValue('Rahim Uddin Ahmed')
    expect(screen.getByLabelText(/Total years of experience/)).toHaveValue('6')
    expect(screen.getAllByText('From your CV').length).toBe(4)

    await user.clear(screen.getByLabelText(/Full name/))
    await user.type(screen.getByLabelText(/Full name/), 'Rahim Ahmed')
    expect(screen.getAllByText('From your CV').length).toBe(3)

    await user.click(screen.getByRole('checkbox', { name: /I agree/ }))
    await user.click(screen.getByRole('button', { name: 'Submit application' }))

    const status = await screen.findByRole('status')
    expect(within(status).getByText('DIG-2026-00001')).toBeInTheDocument()
    expect(within(status).getByText(/Application sent, Rahim/)).toBeInTheDocument()
    expect(within(status).getByText(/confirmation to rahim@example.com/)).toBeInTheDocument()
    expect(submitApplication).toHaveBeenCalledWith(
      expect.objectContaining({ jobId: 'job-1', formVersionId: 'form-v1', uploadId: 'u1', answers: expect.objectContaining({ fullName: 'Rahim Ahmed', experienceYears: 6, consent: true }) }),
    )
  })

  it('highlights missing fields and asks for the CV first', async () => {
    const user = renderForm()
    await user.click(screen.getByRole('button', { name: 'Submit application' }))
    expect(await screen.findByText(/Please check the \d+ highlighted fields/)).toBeInTheDocument()
    expect(screen.getByText('Please upload your CV')).toBeInTheDocument()
    expect(screen.getByText('Please tick this box to continue')).toBeInTheDocument()
    expect(submitApplication).not.toHaveBeenCalled()
  })

  it('rejects unsupported and oversized files before uploading', async () => {
    const user = userEvent.setup({ applyAccept: false })
    render(
      <MemoryRouter>
        <ApplicationForm job={makeJobDetail()} />
      </MemoryRouter>,
    )
    await user.upload(cvInput(), new File(['x'], 'notes.txt'))
    expect(await screen.findByText(/PDF, Word document or image/)).toBeInTheDocument()
    const big = new File(['x'], 'cv.pdf')
    Object.defineProperty(big, 'size', { value: 11 * 1024 * 1024 })
    await user.upload(cvInput(), big)
    expect(await screen.findByText(/larger than 10 MB/)).toBeInTheDocument()
    expect(uploadCv).not.toHaveBeenCalled()
  })

  it('says so when the CV could not be read or uploaded', async () => {
    uploadResolves({ uploadId: 'u1', fileName: 'scan.pdf', status: 'failed', autofill: {} })
    const user = renderForm()
    await user.upload(cvInput(), cvFile())
    expect(await screen.findByText(/couldn’t read the details/)).toBeInTheDocument()

    uploadCv.mockImplementation(() => ({ promise: Promise.reject(new ApiError(400, 'This file looks damaged')), abort: vi.fn() }))
    await user.upload(cvInput(), cvFile())
    expect(await screen.findByText('This file looks damaged')).toBeInTheDocument()
  })

  it('shows progress while the CV uploads and blocks submitting', async () => {
    let finish!: (v: unknown) => void
    uploadCv.mockImplementation((_f: File, _j: string, onProgress: (n: number) => void) => {
      onProgress(0.25)
      return { promise: new Promise((r) => (finish = r)), abort: vi.fn() }
    })
    const user = renderForm()
    await user.upload(cvInput(), cvFile())
    expect(await screen.findByText(/Uploading Rahim CV.pdf… 25%/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit application' })).toBeDisabled()
    finish({ uploadId: 'u1', fileName: 'Rahim CV.pdf', status: 'succeeded', autofill: {} })
    expect(await screen.findByText(/Your CV is attached/)).toBeInTheDocument()
  })

  it('shows server-side field errors and asks for a new CV when needed', async () => {
    uploadResolves({ uploadId: 'u1', fileName: 'cv.pdf', status: 'succeeded', autofill: { fullName: 'Rahim', email: 'r@x.com', phone: '01711223344', experienceYears: 2 } })
    submitApplication.mockRejectedValue(new ApiError(400, 'Your application is already being sent', { cv: 'Please upload your CV again', 'answers.email': 'Use another email' }))
    const user = renderForm()
    await user.upload(cvInput(), cvFile())
    await screen.findByText(/We filled in/)
    await user.click(screen.getByRole('checkbox', { name: /I agree/ }))
    await user.click(screen.getByRole('button', { name: 'Submit application' }))
    expect(await screen.findByText('Your application is already being sent')).toBeInTheDocument()
    expect(screen.getByText('Use another email')).toBeInTheDocument()
    expect(screen.getByText('Choose a file')).toBeInTheDocument()

    submitApplication.mockRejectedValue(new Error('boom'))
    uploadResolves({ uploadId: 'u2', fileName: 'cv.pdf', status: 'succeeded', autofill: {} })
    await user.upload(cvInput(), cvFile())
    await screen.findByText(/Your CV is attached/)
    await user.clear(screen.getByLabelText(/^Email/))
    await user.type(screen.getByLabelText(/^Email/), 'other@x.com')
    await user.click(screen.getByRole('button', { name: 'Submit application' }))
    await waitFor(() => expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument())
  })

  it('uses talent pool wording', async () => {
    uploadResolves({ uploadId: 'u1', fileName: 'cv.pdf', status: 'succeeded', autofill: { fullName: 'Fatema', email: 'f@x.com', phone: '01711223344', experienceYears: 3 } })
    submitApplication.mockResolvedValue({ referenceId: 'DIG-TP-2026-00001' })
    const user = renderForm(true)
    await user.upload(cvInput(), cvFile())
    await screen.findByText(/We filled in/)
    await user.click(screen.getByRole('checkbox', { name: /I agree/ }))
    await user.click(screen.getByRole('button', { name: 'Send my CV' }))
    expect(await screen.findByText(/Your CV is in, Fatema/)).toBeInTheDocument()
  })
})
