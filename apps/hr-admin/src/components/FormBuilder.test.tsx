import { describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { defaultApplicationForm, formSchema, type FormSchema } from '@dekko-isho/shared'
import { FormBuilder } from './FormBuilder'

function Harness({ readOnly, onForm }: { readOnly?: boolean; onForm?: (f: FormSchema) => void }) {
  const [form, setForm] = useState(defaultApplicationForm())
  return (
    <FormBuilder
      value={form}
      readOnly={readOnly}
      onChange={(f) => {
        setForm(f)
        onForm?.(f)
      }}
    />
  )
}

function setup(readOnly = false) {
  const onForm = vi.fn()
  const user = userEvent.setup()
  render(<Harness readOnly={readOnly} onForm={onForm} />)
  const latest = () => onForm.mock.calls.at(-1)![0] as FormSchema
  const keys = () => latest().fields.map((f) => f.key)
  return { user, onForm, latest, keys }
}

describe('FormBuilder', () => {
  it('adds a question before the consent box and names its key from the label', async () => {
    const { user, latest, keys } = setup()
    await user.click(screen.getByRole('button', { name: /Dropdown|Single choice/ }))
    expect(keys().at(-1)).toBe('consent')
    const added = latest().fields.at(-2)!
    expect(added).toMatchObject({ key: 'newQuestion', type: 'select', options: ['Option 1', 'Option 2'] })

    const question = screen.getByLabelText(/^Question/)
    await user.clear(question)
    await user.type(question, 'Preferred shift')
    expect(latest().fields.at(-2)!.key).toBe('preferredShift')

    const options = screen.getByLabelText(/^Options/)
    await user.clear(options)
    await user.type(options, 'Day{Enter}Night{Enter}Day')
    fireEvent.blur(options)
    expect(latest().fields.at(-2)!.options).toEqual(['Day', 'Night'])

    await user.click(screen.getByLabelText('Required'))
    expect(latest().fields.at(-2)!.required).toBe(true)
    expect(formSchema.safeParse(latest()).success).toBe(true)
  })

  it('keeps unique keys for repeated questions', async () => {
    const { user, keys } = setup()
    await user.click(screen.getByRole('button', { name: /Short answer|Short text/ }))
    await user.click(screen.getByRole('button', { name: /Short answer|Short text/ }))
    expect(keys().filter((k) => k.startsWith('newQuestion'))).toEqual(['newQuestion', 'newQuestion2'])
  })

  it('reorders and removes questions but never the locked ones', async () => {
    const { user, keys } = setup()
    const before = defaultApplicationForm().fields.map((f) => f.key)
    await user.click(screen.getAllByRole('button', { name: 'Move down' })[0]!)
    expect(keys().slice(0, 2)).toEqual([before[1], before[0]])
    await user.click(screen.getAllByRole('button', { name: 'Move up' })[1]!)
    expect(keys().slice(0, 2)).toEqual([before[0], before[1]])

    await user.click(screen.getAllByRole('button', { name: /^Email/ }).find((b) => b.hasAttribute('aria-expanded'))!)
    expect(screen.getByText('Every application form includes this question.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Remove question/ })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^Current city/ }))
    await user.click(screen.getByRole('button', { name: /Remove question/ }))
    expect(keys()).not.toContain('city')
  })

  it('edits help text, placeholders, CV pre-fill and limits', async () => {
    const { user, latest } = setup()
    await user.click(screen.getByRole('button', { name: /^Current city/ }))
    const editor = screen.getByText('Help text').closest('.fb-edit') as HTMLElement
    await user.type(within(editor).getByLabelText(/Help text/), 'Where you live now')
    await user.type(within(editor).getByLabelText(/Placeholder/), 'Dhaka')
    await user.selectOptions(within(editor).getByLabelText(/Fill in from the CV/), '')
    await user.clear(within(editor).getByLabelText(/Character limit/))
    await user.type(within(editor).getByLabelText(/Character limit/), '50')
    expect(latest().fields.find((f) => f.key === 'city')).toMatchObject({ helpText: 'Where you live now', placeholder: 'Dhaka', autofill: null, maxLength: 50 })
    await user.click(within(editor).getByRole('button', { name: /Remove question/ }))
  })

  it('reorders by dragging', () => {
    const { keys } = setup()
    const before = defaultApplicationForm().fields.map((f) => f.key)
    const items = document.querySelectorAll('.fb-item')
    const handle = items[0]!.querySelector('.fb-handle')!
    fireEvent.dragStart(handle, { dataTransfer: { effectAllowed: '' } })
    fireEvent.dragOver(items[2]!)
    fireEvent.drop(items[2]!)
    fireEvent.dragEnd(handle)
    expect(keys()[2]).toBe(before[0])
  })

  it('is view-only when editing is not allowed', () => {
    setup(true)
    expect(screen.queryByText('Add a question')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Move up' })).not.toBeInTheDocument()
  })
})
