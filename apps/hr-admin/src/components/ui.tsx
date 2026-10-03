/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { X } from 'lucide-react'
import { APPLICATION_STATUS_LABELS, type ApplicationStatus, type JobStatus } from '@dekko-isho/shared'

// ── Buttons ──────────────────────────────────────────────────────────────────

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  size?: 'md' | 'sm'
  icon?: boolean
  loading?: boolean
}

export function Button({ variant = 'default', size = 'md', icon, loading, className = '', children, disabled, type = 'button', ...rest }: ButtonProps) {
  const cls = ['btn', variant !== 'default' && `btn-${variant}`, size === 'sm' && 'btn-sm', icon && 'btn-icon', className].filter(Boolean).join(' ')
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <span className="spinner" aria-hidden /> : null}
      {children}
    </button>
  )
}

// ── Fields ───────────────────────────────────────────────────────────────────

type FieldProps = { label?: ReactNode; hint?: ReactNode; error?: string; required?: boolean; children: (id: string) => ReactNode; className?: string }

export function Field({ label, hint, error, required, children, className = '' }: FieldProps) {
  const id = useId()
  return (
    <div className={`field ${className}`}>
      {label ? (
        <label htmlFor={id}>
          {label}
          {required ? <span className="req">*</span> : null}
        </label>
      ) : null}
      {children(id)}
      {error ? <span className="error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const { invalid, className = '', ...rest } = props
  return <input className={`input ${className}`} aria-invalid={invalid || undefined} {...rest} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  const { invalid, className = '', ...rest } = props
  return <textarea className={`textarea ${className}`} aria-invalid={invalid || undefined} {...rest} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  const { invalid, className = '', ...rest } = props
  return <select className={`select ${className}`} aria-invalid={invalid || undefined} {...rest} />
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className="switch">
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

/** Free-text tags: type and press Enter or comma. */
export function TagInput({ value, onChange, placeholder, suggestions = [] }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; suggestions?: string[] }) {
  const [draft, setDraft] = useState('')
  const listId = useId()
  const add = (raw: string) => {
    const next = [...value]
    for (const part of raw.split(/[,\n]/)) {
      const tag = part.trim()
      if (tag && !next.some((v) => v.toLowerCase() === tag.toLowerCase())) next.push(tag)
    }
    if (next.length !== value.length) onChange(next)
    setDraft('')
  }
  return (
    <div className="stack-sm">
      <Input
        value={draft}
        placeholder={placeholder}
        list={suggestions.length ? listId : undefined}
        onChange={(e) => {
          const v = e.target.value
          if (v.includes(',')) {
            const cut = v.lastIndexOf(',')
            add(v.slice(0, cut))
            setDraft(v.slice(cut + 1))
          } else setDraft(v)
        }}
        onKeyDown={(e) => {
          if (e.nativeEvent.isComposing) return
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add(draft)
          } else if (e.key === 'Backspace' && !draft && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        onBlur={() => draft && add(draft)}
      />
      {suggestions.length ? (
        <datalist id={listId}>
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      ) : null}
      {value.length ? (
        <div className="chips">
          {value.map((tag) => (
            <span key={tag} className="chip">
              {tag}
              <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter((t) => t !== tag))}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

// ── Display ──────────────────────────────────────────────────────────────────

const APP_STATUS_TONE: Record<ApplicationStatus, string> = {
  new: 'badge-blue',
  reviewed: 'badge-navy',
  shortlisted: 'badge-amber',
  interview: 'badge-amber',
  offer: 'badge-green',
  hired: 'badge-green',
  rejected: 'badge-red',
}

export function AppStatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`badge ${APP_STATUS_TONE[status]}`}>{APPLICATION_STATUS_LABELS[status]}</span>
}

const JOB_STATUS: Record<JobStatus, [string, string]> = {
  draft: ['Draft', ''],
  scheduled: ['Scheduled', 'badge-navy'],
  published: ['Live', 'badge-green'],
  closed: ['Closed', 'badge-red'],
  archived: ['Archived', ''],
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  const [label, tone] = JOB_STATUS[status]
  return <span className={`badge ${tone}`}>{label}</span>
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {children ? <p>{children}</p> : null}
      {action}
    </div>
  )
}

export function Skeleton({ height = 14, width = '100%' }: { height?: number; width?: number | string }) {
  return <div className="skeleton" style={{ height, width }} />
}

export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card-body stack">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} height={18} width={`${90 - (i % 3) * 15}%`} />
      ))}
    </div>
  )
}

export function ErrorNote({ error }: { error: unknown }) {
  if (!error) return null
  return <div className="alert alert-error">{error instanceof Error ? error.message : String(error)}</div>
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?'
  )
}

// ── Dialogs ──────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      el.querySelector<HTMLElement>('.modal-body :is(input, textarea, select):not([type=hidden]):not([disabled])')?.focus()
    }
    if (!open && el.open) el.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? 'wide' : ''}`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
    >
      {open ? (
        <>
          <div className="modal-head">
            <h2>{title}</h2>
            <Button variant="ghost" size="sm" icon aria-label="Close" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
          <div className="modal-body">{children}</div>
          {footer ? <div className="modal-foot">{footer}</div> : null}
        </>
      ) : null}
    </dialog>
  )
}

type ConfirmOptions = { title: string; body: ReactNode; confirmLabel?: string; danger?: boolean }
type ConfirmState = ConfirmOptions & { resolve: (ok: boolean) => void }
type Toast = { id: number; message: string; tone: 'default' | 'error' }

const UiContext = createContext<{ confirm: (o: ConfirmOptions) => Promise<boolean>; toast: (message: string, tone?: Toast['tone']) => void } | null>(null)

export function UiProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const confirm = useCallback((o: ConfirmOptions) => new Promise<boolean>((resolve) => setConfirmState({ ...o, resolve })), [])
  const toast = useCallback((message: string, tone: Toast['tone'] = 'default') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, tone }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  const close = (ok: boolean) => {
    confirmState?.resolve(ok)
    setConfirmState(null)
  }

  return (
    <UiContext.Provider value={{ confirm, toast }}>
      {children}
      <Modal
        open={Boolean(confirmState)}
        onClose={() => close(false)}
        title={confirmState?.title ?? ''}
        footer={
          <>
            <Button onClick={() => close(false)}>Cancel</Button>
            <Button variant={confirmState?.danger ? 'danger' : 'primary'} onClick={() => close(true)} autoFocus>
              {confirmState?.confirmLabel ?? 'Confirm'}
            </Button>
          </>
        }
      >
        <p>{confirmState?.body}</p>
      </Modal>
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tone === 'error' ? 'error' : ''}`}>
            {t.message}
          </div>
        ))}
      </div>
    </UiContext.Provider>
  )
}

export function useUi() {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used inside UiProvider')
  return ctx
}
