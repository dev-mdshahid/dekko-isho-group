import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FormField } from '@dekko-isho/shared'
import { ApiError } from '../../lib/api'

const uploadAttachment = vi.fn()
vi.mock('../../lib/careersApi', () => ({ uploadAttachment: (...a: unknown[]) => uploadAttachment(...a) }))
const { FormFieldInput } = await import('./FormFields')

const field = (type: FormField['type'], extra: Partial<FormField> = {}): FormField => ({
  id: 'q',
  key: 'q',
  label: 'Question',
  type,
  helpText: '',
  placeholder: '',
  required: false,
  options: [],
  locked: false,
  autofill: null,
  ...extra,
})

function Harness({ f, initial, onValue }: { f: FormField; initial?: unknown; onValue?: (v: unknown) => void }) {
  const [value, setValue] = useState<unknown>(initial)
  return (
    <FormFieldInput
      field={f}
      value={value}
      jobId="job-1"
      onChange={(v) => {
        setValue(v)
        onValue?.(v)
      }}
    />
  )
}

function setup(f: FormField, initial?: unknown) {
  const onValue = vi.fn()
  const user = userEvent.setup()
  render(<Harness f={f} initial={initial} onValue={onValue} />)
  return { user, onValue }
}

beforeEach(() => {
  uploadAttachment.mockReset()
})

describe('FormFieldInput', () => {
  it('renders text inputs with the right keyboard and autocomplete hints', async () => {
    const { user, onValue } = setup(field('phone', { key: 'phone', label: 'Phone', required: true, helpText: 'Mobile is best' }))
    const input = screen.getByLabelText(/Phone/)
    expect(input).toHaveAttribute('type', 'tel')
    expect(input).toHaveAttribute('autocomplete', 'tel')
    expect(input).toHaveAttribute('aria-describedby', 'apply-field-phone-help')
    await user.type(input, '017')
    expect(onValue).toHaveBeenLastCalledWith('017')
  })

  it('shows errors on the field', () => {
    render(<FormFieldInput field={field('email', { label: 'Email' })} value="" error="Please enter a valid email address" jobId="j" onChange={() => {}} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Please enter a valid email address')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('counts characters near the limit on long answers', async () => {
    const { user } = setup(field('long_text', { maxLength: 10 }), '1234567')
    expect(screen.queryByText(/\/ 10/)).not.toBeInTheDocument()
    await user.type(screen.getByLabelText('Question'), '89')
    expect(screen.getByText('9 / 10')).toBeInTheDocument()
  })

  it('handles dropdowns, checkboxes and yes/no answers', async () => {
    const select = setup(field('select', { options: ['Immediately', '1 month'] }))
    await select.user.selectOptions(screen.getByLabelText('Question'), '1 month')
    expect(select.onValue).toHaveBeenLastCalledWith('1 month')
  })

  it('toggles checkbox options', async () => {
    const { user, onValue } = setup(field('checkboxes', { options: ['Bangla', 'English'] }))
    await user.click(screen.getByLabelText('Bangla'))
    await user.click(screen.getByLabelText('English'))
    expect(onValue).toHaveBeenLastCalledWith(['Bangla', 'English'])
    await user.click(screen.getByLabelText('Bangla'))
    expect(onValue).toHaveBeenLastCalledWith(['English'])
  })

  it('records yes and no', async () => {
    const { user, onValue } = setup(field('boolean'))
    await user.click(screen.getByLabelText('No'))
    expect(onValue).toHaveBeenLastCalledWith(false)
    await user.click(screen.getByLabelText('Yes'))
    expect(onValue).toHaveBeenLastCalledWith(true)
  })

  it('records consent', async () => {
    const { user, onValue } = setup(field('consent', { label: 'I agree', required: true }))
    await user.click(screen.getByLabelText(/I agree/))
    expect(onValue).toHaveBeenLastCalledWith(true)
  })

  it('uploads attachments and lets the applicant remove them', async () => {
    uploadAttachment.mockImplementation((_f: File, _j: string, onProgress: (n: number) => void) => {
      onProgress(0.5)
      return { promise: Promise.resolve({ uploadId: 'a1', name: 'portfolio.pdf' }), abort: vi.fn() }
    })
    const { user, onValue } = setup(field('file', { label: 'Portfolio' }))
    await user.upload(screen.getByLabelText('Portfolio'), new File(['x'], 'portfolio.pdf'))
    expect(await screen.findByText('portfolio.pdf')).toBeInTheDocument()
    expect(onValue).toHaveBeenLastCalledWith({ uploadId: 'a1', name: 'portfolio.pdf' })
    await user.click(screen.getByRole('button', { name: 'Remove portfolio.pdf' }))
    expect(onValue).toHaveBeenLastCalledWith(null)
  })

  it('explains attachment problems', async () => {
    const { user } = setup(field('file', { label: 'Portfolio' }))
    const big = new File(['x'], 'big.pdf')
    Object.defineProperty(big, 'size', { value: 11 * 1024 * 1024 })
    await user.upload(screen.getByLabelText('Portfolio'), big)
    expect(screen.getByRole('alert')).toHaveTextContent(/larger than 10 MB/)

    uploadAttachment.mockImplementation(() => ({ promise: Promise.reject(new ApiError(400, 'Files must be PDF')), abort: vi.fn() }))
    await user.upload(screen.getByLabelText('Portfolio'), new File(['x'], 'a.pdf'))
    expect(await screen.findByText('Files must be PDF')).toBeInTheDocument()

    uploadAttachment.mockImplementation(() => ({ promise: Promise.reject(new Error('x')), abort: vi.fn() }))
    await user.upload(screen.getByLabelText('Portfolio'), new File(['x'], 'a.pdf'))
    expect(await screen.findByText(/could not upload this file/)).toBeInTheDocument()
  })

  it('adds, edits and removes education rows', async () => {
    const { user, onValue } = setup(field('education', { label: 'Education' }))
    await user.type(screen.getByLabelText('Degree or certificate'), 'BSc')
    expect(onValue).toHaveBeenLastCalledWith([expect.objectContaining({ degree: 'BSc' })])
    await user.click(screen.getByRole('button', { name: /Add education/ }))
    expect(screen.getByText('Education 2')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remove education 1' }))
    expect(screen.queryByText('Education 2')).not.toBeInTheDocument()
  })

  it('lists work experience with a description box', async () => {
    const { user, onValue } = setup(field('experience', { label: 'Experience' }), [{ title: 'Merchandiser', company: 'Isho', startDate: '', endDate: '', description: '' }])
    expect(screen.getByDisplayValue('Merchandiser')).toBeInTheDocument()
    await user.type(screen.getByLabelText('What you did'), 'Led buyers')
    expect(onValue).toHaveBeenLastCalledWith([expect.objectContaining({ description: 'Led buyers' })])
    await user.click(screen.getByRole('button', { name: 'Remove role 1' }))
    expect(onValue).toHaveBeenLastCalledWith([])
  })

  it('renders nothing for the CV slot', () => {
    const { container } = render(<FormFieldInput field={field('cv')} value={null} jobId="j" onChange={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })
})
