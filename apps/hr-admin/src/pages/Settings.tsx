import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import {
  CUSTOM_FIELD_TYPES,
  type CustomFieldDefinition,
  type CustomFieldInput,
  type CustomFieldType,
  type LookupItem,
  type LookupItemInput,
  type LookupKind,
} from '@dekko-isho/shared'
import { Button, Checkbox, Empty, ErrorNote, Field, Input, Modal, Select, SkeletonRows, Switch, TagInput, useUi } from '../components/ui'
import { api, ApiError } from '../lib/api'
import { customFieldKey } from '../lib/keys'
import { useApi } from '../lib/useApi'

type Settings = { departments: LookupItem[]; locations: LookupItem[]; jobTypes: LookupItem[]; customFields: CustomFieldDefinition[] }

const LOOKUP_LABELS: Record<LookupKind, { title: string; singular: string; hint: string }> = {
  departments: { title: 'Departments', singular: 'department', hint: 'Teams candidates can filter by on the careers site.' },
  locations: { title: 'Locations', singular: 'location', hint: 'Where roles are based.' },
  jobTypes: { title: 'Job types', singular: 'job type', hint: 'Full-time, contract, internship and so on.' },
}

const TYPE_LABELS: Record<CustomFieldType, string> = {
  text: 'Text',
  number: 'Number',
  select: 'Single choice',
  multiselect: 'Multiple choice',
  boolean: 'Yes / No',
}

type Tab = LookupKind | 'customFields'

export default function SettingsPage() {
  const { data, error, loading, reload } = useApi<Settings>('/api/hr/settings')
  const [tab, setTab] = useState<Tab>('departments')

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Settings</h1>
          <p>Lists and extra fields used across circulars, the careers site and the CV Bank.</p>
        </div>
      </div>
      <div className="tabs" role="tablist">
        {(['departments', 'locations', 'jobTypes', 'customFields'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'customFields' ? 'Custom fields' : LOOKUP_LABELS[t].title}
            {data ? <span className="count num">{data[t].length}</span> : null}
          </button>
        ))}
      </div>
      <ErrorNote error={error} />
      {loading || !data ? (
        <div className="card">
          <SkeletonRows rows={5} />
        </div>
      ) : tab === 'customFields' ? (
        <CustomFields items={data.customFields} reload={reload} />
      ) : (
        <LookupList kind={tab} items={data[tab]} reload={reload} />
      )}
    </div>
  )
}

function LookupList({ kind, items, reload }: { kind: LookupKind; items: LookupItem[]; reload: () => void }) {
  const { confirm, toast } = useUi()
  const [editing, setEditing] = useState<LookupItem | 'new' | null>(null)
  const meta = LOOKUP_LABELS[kind]

  const remove = async (item: LookupItem) => {
    const ok = await confirm({ title: `Delete ${item.name}?`, body: `This removes the ${meta.singular} from every list. If a circular still uses it, turn off “Shown” instead.`, confirmLabel: 'Delete', danger: true })
    if (!ok) return
    try {
      await api(`/api/hr/settings/${kind}/${item.id}`, { method: 'DELETE' })
      toast(`${item.name} deleted`)
      reload()
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  const toggle = async (item: LookupItem) => {
    try {
      await api(`/api/hr/settings/${kind}/${item.id}`, { method: 'PUT', body: { name: item.name, sortOrder: item.sortOrder, active: !item.active } })
      reload()
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  return (
    <section className="card">
      <div className="card-head">
        <p className="small muted">{meta.hint}</p>
        <Button variant="primary" size="sm" onClick={() => setEditing('new')}>
          <Plus size={14} /> Add {meta.singular}
        </Button>
      </div>
      {items.length ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Order</th>
                <th>Shown</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="t-title">{item.name}</td>
                  <td className="num muted">{item.sortOrder}</td>
                  <td>
                    <Switch checked={item.active} onChange={() => void toggle(item)} label={<span className="sr-only">Show {item.name}</span>} />
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Button variant="ghost" size="sm" icon aria-label={`Edit ${item.name}`} onClick={() => setEditing(item)}>
                      <Pencil size={15} />
                    </Button>
                    <Button variant="ghost" size="sm" icon aria-label={`Delete ${item.name}`} onClick={() => void remove(item)}>
                      <Trash2 size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title={`No ${meta.title.toLowerCase()} yet`} />
      )}
      {editing ? (
        <LookupEditor
          kind={kind}
          item={editing === 'new' ? null : editing}
          nextOrder={Math.max(0, ...items.map((i) => i.sortOrder)) + 10}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      ) : null}
    </section>
  )
}

function LookupEditor({ kind, item, nextOrder, onClose, onSaved }: { kind: LookupKind; item: LookupItem | null; nextOrder: number; onClose: () => void; onSaved: () => void }) {
  const { toast } = useUi()
  const [form, setForm] = useState<LookupItemInput>({ name: item?.name ?? '', sortOrder: item?.sortOrder ?? nextOrder, active: item?.active ?? true })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const meta = LOOKUP_LABELS[kind]

  const save = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!form.name.trim()) return setErr('Name is required')
    setBusy(true)
    try {
      await api(item ? `/api/hr/settings/${kind}/${item.id}` : `/api/hr/settings/${kind}`, { method: item ? 'PUT' : 'POST', body: form })
      toast(item ? 'Saved' : `${form.name} added`)
      onSaved()
    } catch (error) {
      setErr((error as Error).message)
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={item ? `Edit ${meta.singular}` : `Add ${meta.singular}`}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={busy} onClick={() => void save()}>
            {item ? 'Save' : 'Add'}
          </Button>
        </>
      }
    >
      <form className="stack" onSubmit={(e) => void save(e)}>
        <Field label="Name" required error={err ?? undefined}>
          {(id) => <Input id={id} autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} invalid={!!err} />}
        </Field>
        <Field label="Order" hint="Lower numbers appear first.">
          {(id) => <Input id={id} type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })} />}
        </Field>
        <Switch checked={form.active} onChange={(active) => setForm({ ...form, active })} label="Show in lists" />
        <button type="submit" hidden />
      </form>
    </Modal>
  )
}

function CustomFields({ items, reload }: { items: CustomFieldDefinition[]; reload: () => void }) {
  const { confirm, toast } = useUi()
  const [editing, setEditing] = useState<CustomFieldDefinition | 'new' | null>(null)

  const remove = async (f: CustomFieldDefinition) => {
    const ok = await confirm({ title: `Delete “${f.label}”?`, body: 'The field disappears from circulars and filters. Values already saved on circulars are kept but hidden.', confirmLabel: 'Delete', danger: true })
    if (!ok) return
    try {
      await api(`/api/hr/settings/custom-fields/${f.id}`, { method: 'DELETE' })
      toast('Field deleted')
      reload()
    } catch (err) {
      toast((err as Error).message, 'error')
    }
  }

  return (
    <section className="card">
      <div className="card-head">
        <p className="small muted">Extra details on each circular, such as shift or experience band. Choose where each one appears.</p>
        <Button variant="primary" size="sm" onClick={() => setEditing('new')}>
          <Plus size={14} /> Add field
        </Button>
      </div>
      {items.length ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Appears on</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f.id}>
                  <td>
                    <div className="t-title">{f.label}</div>
                    {f.options.length ? <div className="t-sub truncate" style={{ maxWidth: 320 }}>{f.options.join(', ')}</div> : null}
                  </td>
                  <td>{TYPE_LABELS[f.type]}</td>
                  <td className="small muted">
                    {[f.showOnCard && 'Job cards', f.filterPublic && 'Careers filters', f.filterCvBank && 'CV Bank filters'].filter(Boolean).join(', ') || 'Circular page only'}
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Button variant="ghost" size="sm" icon aria-label={`Edit ${f.label}`} onClick={() => setEditing(f)}>
                      <Pencil size={15} />
                    </Button>
                    <Button variant="ghost" size="sm" icon aria-label={`Delete ${f.label}`} onClick={() => void remove(f)}>
                      <Trash2 size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty title="No custom fields yet">Add fields like shift, experience band or work mode to describe circulars consistently.</Empty>
      )}
      {editing ? (
        <CustomFieldEditor
          field={editing === 'new' ? null : editing}
          nextOrder={Math.max(0, ...items.map((i) => i.sortOrder)) + 10}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      ) : null}
    </section>
  )
}


function CustomFieldEditor({ field, nextOrder, onClose, onSaved }: { field: CustomFieldDefinition | null; nextOrder: number; onClose: () => void; onSaved: () => void }) {
  const { toast } = useUi()
  const [form, setForm] = useState<CustomFieldInput>(
    field ?? { key: '', label: '', type: 'select', options: [], showOnCard: false, filterPublic: false, filterCvBank: true, sortOrder: nextOrder },
  )
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const hasOptions = form.type === 'select' || form.type === 'multiselect'
  const set = (patch: Partial<CustomFieldInput>) => setForm((f) => ({ ...f, ...patch }))

  const save = async () => {
    const next: Record<string, string> = {}
    if (!form.label.trim()) next.label = 'Label is required'
    if (hasOptions && form.options.length < 2) next.options = 'Add at least two choices'
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      const body = { ...form, key: form.key || customFieldKey(form.label), options: hasOptions ? form.options : [] }
      await api(field ? `/api/hr/settings/custom-fields/${field.id}` : '/api/hr/settings/custom-fields', { method: field ? 'PUT' : 'POST', body })
      toast(field ? 'Field saved' : 'Field added')
      onSaved()
    } catch (err) {
      if (err instanceof ApiError && Object.keys(err.fields).length) {
        setErrors(err.fields)
        if (!err.fields.label && !err.fields.options) toast(Object.values(err.fields)[0], 'error')
      } else toast((err as Error).message, 'error')
      setBusy(false)
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={field ? 'Edit field' : 'Add field'}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={busy} onClick={() => void save()}>
            {field ? 'Save' : 'Add field'}
          </Button>
        </>
      }
    >
      <div className="stack">
        <Field label="Label" required error={errors.label}>
          {(id) => <Input id={id} autoFocus value={form.label} onChange={(e) => set({ label: e.target.value, ...(field ? {} : { key: customFieldKey(e.target.value) }) })} placeholder="e.g. Shift" invalid={!!errors.label} />}
        </Field>
        <Field label="Type">
          {(id) => (
            <Select id={id} value={form.type} onChange={(e) => set({ type: e.target.value as CustomFieldType })} disabled={!!field}>
              {CUSTOM_FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {TYPE_LABELS[t]}
                </option>
              ))}
            </Select>
          )}
        </Field>
        {hasOptions ? (
          <Field label="Choices" hint="Press Enter after each choice." error={errors.options}>
            {() => <TagInput value={form.options} onChange={(options) => set({ options })} placeholder="e.g. Day, Night, Rotating" />}
          </Field>
        ) : null}
        <div className="stack-sm">
          <Checkbox checked={form.showOnCard} onChange={(showOnCard) => set({ showOnCard })} label="Show on job cards" />
          <Checkbox checked={form.filterPublic} onChange={(filterPublic) => set({ filterPublic })} label="Let candidates filter by it on the careers site" />
          <Checkbox checked={form.filterCvBank} onChange={(filterCvBank) => set({ filterCvBank })} label="Filter by it in the CV Bank" />
        </div>
      </div>
    </Modal>
  )
}
