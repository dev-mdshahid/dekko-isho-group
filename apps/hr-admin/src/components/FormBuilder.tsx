import { useState } from 'react'
import {
  AlignLeft,
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckSquare,
  ChevronDown,
  CircleDot,
  GraduationCap,
  GripVertical,
  Hash,
  Link2,
  ListChecks,
  Lock,
  Mail,
  Paperclip,
  Phone,
  Briefcase,
  ToggleLeft,
  Trash2,
  Type,
} from 'lucide-react'
import {
  AUTOFILL_KEYS,
  AUTOFILL_LABELS,
  FORM_FIELD_TYPE_LABELS,
  type AutofillKey,
  type FormField,
  type FormFieldType,
  type FormSchema,
} from '@dekko-isho/shared'
import { camelKey } from '../lib/keys'
import { Button, Checkbox, Field, Input, Select, Textarea } from './ui'

const ICONS: Record<FormFieldType, typeof Type> = {
  cv: Paperclip,
  short_text: Type,
  long_text: AlignLeft,
  email: Mail,
  phone: Phone,
  number: Hash,
  date: Calendar,
  url: Link2,
  select: CircleDot,
  multiselect: ListChecks,
  checkboxes: CheckSquare,
  boolean: ToggleLeft,
  file: Paperclip,
  education: GraduationCap,
  experience: Briefcase,
  consent: CheckSquare,
}

const ADDABLE: FormFieldType[] = ['short_text', 'long_text', 'select', 'multiselect', 'checkboxes', 'boolean', 'number', 'date', 'url', 'email', 'phone', 'file', 'education', 'experience']

const HAS_OPTIONS: FormFieldType[] = ['select', 'multiselect', 'checkboxes']

/** Which CV values make sense for each field type. */
const AUTOFILL_FOR: Partial<Record<FormFieldType, AutofillKey[]>> = {
  short_text: ['fullName', 'city', 'currentTitle', 'currentCompany', 'highestDegree', 'skills', 'languages'],
  long_text: ['summary', 'skills'],
  email: ['email'],
  phone: ['phone'],
  url: ['linkedin', 'portfolio'],
  number: ['totalExperienceYears'],
  select: ['highestEducationLevel', 'city'],
  multiselect: ['skills', 'languages'],
  education: ['education'],
  experience: ['experience'],
}

let seq = 0
const newId = () => `f_${Date.now().toString(36)}_${(seq++).toString(36)}`

export function FormBuilder({ value, onChange, readOnly }: { value: FormSchema; onChange: (v: FormSchema) => void; readOnly?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [fresh, setFresh] = useState<Set<string>>(new Set())
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const fields = value.fields

  const set = (next: FormField[]) => onChange({ fields: next })
  const update = (id: string, patch: Partial<FormField>) => {
    set(
      fields.map((f) => {
        if (f.id !== id) return f
        const next = { ...f, ...patch }
        if (patch.label !== undefined && fresh.has(id) && !f.locked) {
          next.key = camelKey(patch.label, new Set(fields.filter((x) => x.id !== id).map((x) => x.key)))
        }
        return next
      }),
    )
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= fields.length || from === to) return
    const next = [...fields]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    set(next)
  }

  const add = (type: FormFieldType) => {
    const label = type === 'education' ? 'Education' : type === 'experience' ? 'Work experience' : type === 'file' ? 'Supporting document' : 'New question'
    const id = newId()
    const field: FormField = {
      id,
      key: camelKey(label, new Set(fields.map((f) => f.key))),
      type,
      label,
      helpText: '',
      placeholder: '',
      required: false,
      options: HAS_OPTIONS.includes(type) ? ['Option 1', 'Option 2'] : [],
      locked: false,
      autofill: type === 'education' ? 'education' : type === 'experience' ? 'experience' : null,
    }
    const consentIdx = fields.findIndex((f) => f.type === 'consent')
    const next = [...fields]
    next.splice(consentIdx >= 0 ? consentIdx : next.length, 0, field)
    set(next)
    setFresh((s) => new Set(s).add(id))
    setOpenId(id)
  }

  return (
    <div className="stack">
      <div className="fb-list">
        {fields.map((f, i) => {
          const Icon = ICONS[f.type]
          const open = openId === f.id
          return (
            <div
              key={f.id}
              className={`fb-item ${open ? 'open' : ''} ${dragId === f.id ? 'dragging' : ''} ${overId === f.id && dragId !== f.id ? 'drop-target' : ''}`}
              onDragOver={(e) => {
                if (!dragId) return
                e.preventDefault()
                setOverId(f.id)
              }}
              onDrop={(e) => {
                e.preventDefault()
                const from = fields.findIndex((x) => x.id === dragId)
                move(from, i)
                setDragId(null)
                setOverId(null)
              }}
            >
              <div className="fb-row">
                {!readOnly ? (
                  <span
                    className="fb-handle"
                    draggable
                    onDragStart={(e) => {
                      setDragId(f.id)
                      e.dataTransfer.effectAllowed = 'move'
                    }}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverId(null)
                    }}
                    aria-hidden
                  >
                    <GripVertical size={16} />
                  </span>
                ) : null}
                <Icon size={16} className="muted" aria-hidden />
                <button
                  type="button"
                  className="fb-label truncate"
                  style={{ border: 0, background: 'none', textAlign: 'left', cursor: 'pointer', padding: 0 }}
                  onClick={() => setOpenId(open ? null : f.id)}
                  aria-expanded={open}
                >
                  {f.label}
                  {f.required ? <span className="req">*</span> : null}
                </button>
                <span className="fb-type">{FORM_FIELD_TYPE_LABELS[f.type]}</span>
                {f.autofill ? <span className="badge badge-blue plain" title="Filled in from the CV">From CV</span> : null}
                {f.locked ? <Lock size={14} className="muted" aria-label="Always included" /> : null}
                {!readOnly ? (
                  <span className="row" style={{ gap: 0 }}>
                    <Button variant="ghost" size="sm" icon aria-label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}>
                      <ArrowUp size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" icon aria-label="Move down" disabled={i === fields.length - 1} onClick={() => move(i, i + 1)}>
                      <ArrowDown size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" icon aria-label={open ? 'Collapse' : 'Edit'} onClick={() => setOpenId(open ? null : f.id)}>
                      <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : undefined }} />
                    </Button>
                  </span>
                ) : null}
              </div>
              {open && !readOnly ? <FieldEditor field={f} onChange={(p) => update(f.id, p)} onRemove={() => set(fields.filter((x) => x.id !== f.id))} /> : null}
            </div>
          )
        })}
      </div>

      {!readOnly ? (
        <div>
          <div className="label" style={{ marginBottom: 8 }}>
            Add a question
          </div>
          <div className="fb-add">
            {ADDABLE.map((t) => {
              const Icon = ICONS[t]
              return (
                <button key={t} type="button" onClick={() => add(t)}>
                  <Icon size={16} /> {FORM_FIELD_TYPE_LABELS[t]}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FieldEditor({ field, onChange, onRemove }: { field: FormField; onChange: (p: Partial<FormField>) => void; onRemove: () => void }) {
  const autofillChoices = AUTOFILL_FOR[field.type] ?? []
  const isText = field.type === 'short_text' || field.type === 'long_text'
  return (
    <div className="fb-edit stack">
      <div className="grid-2">
        <Field label="Question" required>
          {(id) => <Input id={id} value={field.label} onChange={(e) => onChange({ label: e.target.value })} disabled={field.type === 'cv'} />}
        </Field>
        {field.type !== 'consent' && field.type !== 'cv' && field.type !== 'boolean' && field.type !== 'education' && field.type !== 'experience' && !HAS_OPTIONS.includes(field.type) ? (
          <Field label="Placeholder">{(id) => <Input id={id} value={field.placeholder} onChange={(e) => onChange({ placeholder: e.target.value })} />}</Field>
        ) : (
          <div />
        )}
      </div>
      <Field label="Help text" hint="Shown under the question.">
        {(id) => <Input id={id} value={field.helpText} onChange={(e) => onChange({ helpText: e.target.value })} />}
      </Field>
      {HAS_OPTIONS.includes(field.type) ? (
        <Field label="Options" hint="One per line.">
          {(id) => (
            <Textarea
              id={id}
              rows={Math.min(8, Math.max(3, field.options.length + 1))}
              value={field.options.join('\n')}
              onChange={(e) => onChange({ options: e.target.value.split('\n').map((s) => s.trimStart()).filter((s, i, arr) => s || i === arr.length - 1) })}
              onBlur={(e) => onChange({ options: [...new Set(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))] })}
            />
          )}
        </Field>
      ) : null}
      <div className="grid-2">
        {autofillChoices.length ? (
          <Field label="Fill in from the CV" hint="Pre-fills this answer when a candidate uploads their CV.">
            {(id) => (
              <Select id={id} value={field.autofill ?? ''} onChange={(e) => onChange({ autofill: (e.target.value || null) as AutofillKey | null })} disabled={field.locked}>
                <option value="">Don’t pre-fill</option>
                {AUTOFILL_KEYS.filter((k) => autofillChoices.includes(k)).map((k) => (
                  <option key={k} value={k}>
                    {AUTOFILL_LABELS[k]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        ) : (
          <div />
        )}
        {isText ? (
          <Field label="Character limit">
            {(id) => (
              <Input
                id={id}
                type="number"
                min={1}
                max={10000}
                value={field.maxLength ?? ''}
                placeholder={field.type === 'long_text' ? '5000' : '300'}
                onChange={(e) => onChange({ maxLength: e.target.value ? Number(e.target.value) : undefined })}
              />
            )}
          </Field>
        ) : null}
      </div>
      <div className="spread">
        {field.locked ? <span className="small">Required</span> : <Checkbox checked={field.required} onChange={(v) => onChange({ required: v })} label="Required" />}
        {!field.locked ? (
          <Button variant="ghost" size="sm" onClick={onRemove} style={{ color: 'var(--red)' }}>
            <Trash2 size={14} /> Remove question
          </Button>
        ) : (
          <span className="small muted row">
            <Lock size={12} /> Every application form includes this question.
          </span>
        )}
      </div>
    </div>
  )
}
