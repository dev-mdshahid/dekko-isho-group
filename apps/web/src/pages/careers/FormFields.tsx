import type { EducationEntry, ExperienceEntry, FileRef, FormField } from '@dekko-isho/shared'
import { ATTACHMENT_MAX_BYTES } from '@dekko-isho/shared'
import { Check, Paperclip, Plus, Trash2, X } from 'lucide-react'
import { type ReactNode, useRef, useState } from 'react'
import { ApiError } from '../../lib/api'
import { uploadAttachment } from '../../lib/careersApi'
import { fieldDomId } from './formConfig'

export type FieldProps = {
  field: FormField
  value: unknown
  error?: string
  autofilled?: boolean
  jobId: string
  onChange: (value: unknown) => void
}

const AUTOCOMPLETE: Record<string, string> = {
  fullName: 'name',
  email: 'email',
  phone: 'tel',
  city: 'address-level2',
  currentTitle: 'organization-title',
  currentCompany: 'organization',
  linkedin: 'url',
  portfolio: 'url',
}

export function FieldShell({
  field,
  error,
  autofilled,
  children,
  asFieldset = false,
}: {
  field: FormField
  error?: string
  autofilled?: boolean
  children: ReactNode
  asFieldset?: boolean
}) {
  const id = fieldDomId(field.key)
  const labelContent = (
    <>
      {field.label}
      {field.required && (
        <span className="apply-required" aria-hidden="true">
          {' '}*
        </span>
      )}
      {autofilled && (
        <span className="apply-autofill-tag">
          <Check size={12} aria-hidden="true" /> From your CV
        </span>
      )}
    </>
  )
  const help = field.helpText ? (
    <p className="apply-help" id={`${id}-help`}>
      {field.helpText}
    </p>
  ) : null
  const err = error ? (
    <p className="apply-error" id={`${id}-error`} role="alert">
      {error}
    </p>
  ) : null
  const className = `apply-field${error ? ' has-error' : ''}${autofilled ? ' is-autofilled' : ''}`

  if (asFieldset) {
    return (
      <fieldset className={className} id={`${id}-group`} aria-describedby={describedBy(field, error)}>
        <legend className="apply-label">{labelContent}</legend>
        {help}
        {children}
        {err}
      </fieldset>
    )
  }
  return (
    <div className={className}>
      <label className="apply-label" htmlFor={id}>
        {labelContent}
      </label>
      {help}
      {children}
      {err}
    </div>
  )
}

function describedBy(field: FormField, error?: string): string | undefined {
  const id = fieldDomId(field.key)
  const ids = [field.helpText ? `${id}-help` : '', error ? `${id}-error` : ''].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
}

function inputProps(field: FormField, error?: string) {
  return {
    id: fieldDomId(field.key),
    name: field.key,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(field, error),
    'aria-required': field.required || undefined,
    placeholder: field.placeholder || undefined,
  }
}

const str = (v: unknown) => (v == null ? '' : String(v))

function TextInput({ field, value, error, autofilled, onChange }: FieldProps) {
  const type =
    field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : field.type === 'url' ? 'url' : field.type === 'date' ? 'date' : 'text'
  const inputMode =
    field.type === 'number' ? 'decimal' : field.type === 'phone' ? 'tel' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : undefined
  return (
    <FieldShell field={field} error={error} autofilled={autofilled}>
      <input
        {...inputProps(field, error)}
        className="apply-input"
        type={type}
        inputMode={inputMode}
        autoComplete={AUTOCOMPLETE[field.key] ?? (field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'off')}
        maxLength={field.maxLength}
        value={str(value)}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldShell>
  )
}

function LongText({ field, value, error, autofilled, onChange }: FieldProps) {
  const max = field.maxLength ?? 5000
  const text = str(value)
  return (
    <FieldShell field={field} error={error} autofilled={autofilled}>
      <textarea
        {...inputProps(field, error)}
        className="apply-input apply-textarea"
        rows={5}
        maxLength={max}
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
      {text.length > max * 0.8 && (
        <p className="apply-counter" aria-live="polite">
          {text.length.toLocaleString()} / {max.toLocaleString()}
        </p>
      )}
    </FieldShell>
  )
}

function SelectField({ field, value, error, autofilled, onChange }: FieldProps) {
  return (
    <FieldShell field={field} error={error} autofilled={autofilled}>
      <select
        {...inputProps(field, error)}
        className="apply-input apply-select"
        value={str(value)}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose an option</option>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

function CheckboxList({ field, value, error, autofilled, onChange }: FieldProps) {
  const selected = Array.isArray(value) ? value.map(String) : []
  const toggle = (option: string) =>
    onChange(selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option])
  return (
    <FieldShell field={field} error={error} autofilled={autofilled} asFieldset>
      <div className="apply-options" id={fieldDomId(field.key)} tabIndex={-1}>
        {field.options.map((o) => (
          <label key={o} className="apply-option">
            <input type="checkbox" checked={selected.includes(o)} onChange={() => toggle(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
    </FieldShell>
  )
}

function BooleanField({ field, value, error, autofilled, onChange }: FieldProps) {
  return (
    <FieldShell field={field} error={error} autofilled={autofilled} asFieldset>
      <div className="apply-options apply-options--inline" id={fieldDomId(field.key)} tabIndex={-1}>
        {[
          { label: 'Yes', v: true },
          { label: 'No', v: false },
        ].map((o) => (
          <label key={o.label} className="apply-option apply-option--pill">
            <input type="radio" name={field.key} checked={value === o.v} onChange={() => onChange(o.v)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </FieldShell>
  )
}

function ConsentField({ field, value, error, onChange }: FieldProps) {
  const id = fieldDomId(field.key)
  return (
    <div className={`apply-field apply-consent${error ? ' has-error' : ''}`}>
      <label className="apply-option apply-option--consent">
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          {field.label}
          {field.required && (
            <span className="apply-required" aria-hidden="true">
              {' '}*
            </span>
          )}
        </span>
      </label>
      {error && (
        <p className="apply-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const ATTACHMENT_ACCEPT = '.pdf,.doc,.docx,.jpg,.jpeg,.png'

function FileField({ field, value, error, jobId, onChange }: FieldProps) {
  const ref = value && typeof value === 'object' ? (value as FileRef) : null
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function pick(file: File | undefined) {
    if (!file) return
    setUploadError('')
    if (file.size > ATTACHMENT_MAX_BYTES) {
      setUploadError('This file is larger than 10 MB. Please choose a smaller file.')
      return
    }
    setBusy(true)
    setProgress(0)
    try {
      const res = await uploadAttachment(file, jobId, setProgress).promise
      onChange({ uploadId: res.uploadId, name: res.name || file.name } satisfies FileRef)
    } catch (e) {
      setUploadError(e instanceof ApiError ? e.message : 'We could not upload this file. Please try again.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <FieldShell field={field} error={error || uploadError}>
      <div className="apply-file">
        {ref ? (
          <div className="apply-file-chip">
            <Paperclip size={16} aria-hidden="true" />
            <span className="apply-file-name">{ref.name}</span>
            <button type="button" className="apply-icon-button" aria-label={`Remove ${ref.name}`} onClick={() => onChange(null)}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label className={`apply-file-button${busy ? ' is-busy' : ''}`}>
            <input
              ref={inputRef}
              {...inputProps(field, error || uploadError)}
              className="apply-visually-hidden"
              type="file"
              accept={ATTACHMENT_ACCEPT}
              disabled={busy}
              onChange={(e) => pick(e.target.files?.[0])}
            />
            <Paperclip size={16} aria-hidden="true" />
            {busy ? `Uploading… ${Math.round(progress * 100)}%` : 'Choose a file'}
          </label>
        )}
      </div>
    </FieldShell>
  )
}

type Column<T> = { key: keyof T & string; label: string; wide?: boolean; multiline?: boolean; placeholder?: string }

const EDUCATION_COLUMNS: Column<EducationEntry>[] = [
  { key: 'degree', label: 'Degree or certificate', placeholder: 'e.g. BSc, HSC' },
  { key: 'institution', label: 'Institution' },
  { key: 'field', label: 'Subject' },
  { key: 'endYear', label: 'Year completed', placeholder: 'e.g. 2022' },
  { key: 'result', label: 'Result', placeholder: 'e.g. CGPA 3.6' },
]

const EXPERIENCE_COLUMNS: Column<ExperienceEntry>[] = [
  { key: 'title', label: 'Job title' },
  { key: 'company', label: 'Company' },
  { key: 'startDate', label: 'From', placeholder: 'e.g. Jan 2021' },
  { key: 'endDate', label: 'To', placeholder: 'e.g. Present' },
  { key: 'description', label: 'What you did', wide: true, multiline: true },
]

function emptyRow<T>(columns: Column<T>[]): T {
  return Object.fromEntries(columns.map((c) => [c.key, ''])) as T
}

function Repeater<T extends Record<string, string>>({
  field,
  value,
  error,
  autofilled,
  onChange,
  columns,
  noun,
}: FieldProps & { columns: Column<T>[]; noun: string }) {
  const rows: T[] = Array.isArray(value) && value.length ? (value as T[]) : [emptyRow(columns)]
  const id = fieldDomId(field.key)
  const update = (index: number, key: string, v: string) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [key]: v } : row)))
  const remove = (index: number) => {
    const next = rows.filter((_, i) => i !== index)
    onChange(next.length ? next : [])
  }

  return (
    <FieldShell field={field} error={error} autofilled={autofilled} asFieldset>
      <div className="apply-repeater" id={id} tabIndex={-1}>
        {rows.map((row, index) => (
          <div className="apply-repeater-row" key={index}>
            <div className="apply-repeater-head">
              <span className="apply-repeater-index">
                {noun} {index + 1}
              </span>
              {(rows.length > 1 || Object.values(row).some((v) => String(v).trim())) && (
                <button
                  type="button"
                  className="apply-icon-button"
                  aria-label={`Remove ${noun.toLowerCase()} ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="apply-repeater-grid">
              {columns.map((c) => {
                const inputId = `${id}-${index}-${c.key}`
                return (
                  <div key={c.key} className={`apply-subfield${c.wide ? ' is-wide' : ''}`}>
                    <label htmlFor={inputId} className="apply-sublabel">
                      {c.label}
                    </label>
                    {c.multiline ? (
                      <textarea
                        id={inputId}
                        className="apply-input apply-textarea"
                        rows={3}
                        maxLength={1500}
                        value={row[c.key] ?? ''}
                        placeholder={c.placeholder}
                        onChange={(e) => update(index, c.key, e.target.value)}
                      />
                    ) : (
                      <input
                        id={inputId}
                        className="apply-input"
                        value={row[c.key] ?? ''}
                        placeholder={c.placeholder}
                        onChange={(e) => update(index, c.key, e.target.value)}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        {rows.length < 15 && (
          <button type="button" className="apply-add-button" onClick={() => onChange([...rows, emptyRow(columns)])}>
            <Plus size={16} aria-hidden="true" /> Add {noun.toLowerCase()}
          </button>
        )}
      </div>
    </FieldShell>
  )
}

export function FormFieldInput(props: FieldProps) {
  switch (props.field.type) {
    case 'short_text':
    case 'email':
    case 'phone':
    case 'number':
    case 'date':
    case 'url':
      return <TextInput {...props} />
    case 'long_text':
      return <LongText {...props} />
    case 'select':
      return <SelectField {...props} />
    case 'multiselect':
    case 'checkboxes':
      return <CheckboxList {...props} />
    case 'boolean':
      return <BooleanField {...props} />
    case 'consent':
      return <ConsentField {...props} />
    case 'file':
      return <FileField {...props} />
    case 'education':
      return <Repeater<EducationEntry> {...props} columns={EDUCATION_COLUMNS} noun="Education" />
    case 'experience':
      return <Repeater<ExperienceEntry> {...props} columns={EXPERIENCE_COLUMNS} noun="Role" />
    default:
      return null
  }
}
