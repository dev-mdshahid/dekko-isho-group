import { CV_ACCEPT_EXT, CV_MAX_BYTES, validateAnswers, type FormField } from '@dekko-isho/shared'
import { CheckCircle2, FileText, Info, LoaderCircle, RefreshCw, UploadCloud } from 'lucide-react'
import { type DragEvent, type FormEvent, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../lib/api'
import { submitApplication, uploadCv, type PublicJobDetail } from '../../lib/careersApi'
import { scrollToElement } from '../../lib/smoothScroll'
import { TURNSTILE_SITE_KEY } from '../../lib/turnstile'
import { fieldDomId } from './formConfig'
import { FormFieldInput } from './FormFields'
import { Turnstile } from '../../components/common/Turnstile'

type CvState =
  | { status: 'idle' }
  | { status: 'uploading'; fileName: string; progress: number }
  | { status: 'reading'; fileName: string }
  | { status: 'done'; fileName: string; uploadId: string; filled: number; readOk: boolean }
  | { status: 'error'; message: string }

type Props = {
  job: PublicJobDetail
  /** Talent pool submissions get different thank-you copy. */
  talentPool?: boolean
}

const ACCEPTED = CV_ACCEPT_EXT.split(',')

function isEmpty(v: unknown): boolean {
  if (v == null) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  return false
}

function omit(obj: Record<string, string>, key: string): Record<string, string> {
  const next = { ...obj }
  delete next[key]
  return next
}

function firstName(full: unknown): string {
  return typeof full === 'string' ? full.trim().split(/\s+/)[0] ?? '' : ''
}

export function ApplicationForm({ job, talentPool = false }: Props) {
  const fields = job.form.fields
  const [answers, setAnswers] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [autofilled, setAutofilled] = useState<Set<string>>(new Set())
  const [cv, setCv] = useState<CvState>({ status: 'idle' })
  const [dragging, setDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [token, setToken] = useState('')
  const [turnstileKey, setTurnstileKey] = useState(0)
  const [result, setResult] = useState<{ referenceId: string; name: string; email: string } | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAbort = useRef<(() => void) | null>(null)
  const answersRef = useRef(answers)

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => () => uploadAbort.current?.(), [])

  useEffect(() => {
    if (result && rootRef.current) scrollToElement(rootRef.current, { offset: -160, immediate: true })
  }, [result])

  const cvField = fields.find((f) => f.type === 'cv')

  function setAnswer(key: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => omit(prev, key))
    if (autofilled.has(key)) {
      setAutofilled((prev) => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  async function handleCv(file: File | undefined) {
    if (!file) return
    const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
    if (!ACCEPTED.includes(ext)) {
      setCv({ status: 'error', message: 'Please upload your CV as a PDF, Word document or image (JPG or PNG).' })
      return
    }
    if (file.size > CV_MAX_BYTES) {
      setCv({ status: 'error', message: 'This file is larger than 10 MB. Please upload a smaller copy of your CV.' })
      return
    }
    uploadAbort.current?.()
    setErrors((prev) => omit(prev, 'cv'))
    setCv({ status: 'uploading', fileName: file.name, progress: 0 })

    const upload = uploadCv(file, job.id, (progress) => {
      setCv((prev) =>
        prev.status === 'uploading'
          ? progress >= 1
            ? { status: 'reading', fileName: prev.fileName }
            : { ...prev, progress }
          : prev,
      )
    })
    uploadAbort.current = upload.abort

    try {
      const res = await upload.promise
      const current = answersRef.current
      const filled: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(res.autofill ?? {})) {
        if (isEmpty(current[key]) && !isEmpty(value)) {
          filled[key] = typeof value === 'number' ? String(value) : value
        }
      }
      const filledKeys = Object.keys(filled)
      setAnswers((prev) => ({ ...prev, ...filled }))
      setAutofilled(new Set(filledKeys))
      setErrors((prev) => {
        const next = { ...prev }
        for (const key of filledKeys) delete next[key]
        return next
      })
      setCv({
        status: 'done',
        fileName: res.fileName || file.name,
        uploadId: res.uploadId,
        filled: filledKeys.length,
        readOk: res.status === 'succeeded',
      })
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      setCv({
        status: 'error',
        message: error instanceof ApiError ? error.message : 'We could not upload your CV. Please try again.',
      })
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    if (cv.status === 'uploading' || cv.status === 'reading') return
    void handleCv(event.dataTransfer.files?.[0])
  }

  function focusField(key: string) {
    const el =
      document.getElementById(fieldDomId(key)) ??
      document.getElementById(`${fieldDomId(key)}-group`)
    if (!el) return
    scrollToElement(el, { offset: -140, duration: 0.6 })
    window.setTimeout(() => el.focus({ preventScroll: true }), 350)
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setFormError('')
    if (cv.status === 'uploading' || cv.status === 'reading') {
      setFormError('Please wait for your CV to finish uploading.')
      return
    }

    const nextErrors: Record<string, string> = {}
    if (cvField && cv.status !== 'done') nextErrors.cv = 'Please upload your CV'
    const validation = validateAnswers(job.form, answers)
    Object.assign(nextErrors, validation.errors)

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      const firstKey = fields.find((f) => nextErrors[f.key])?.key
      if (firstKey) focusField(firstKey)
      return
    }
    if (TURNSTILE_SITE_KEY && !token) {
      setFormError('Please complete the security check below.')
      return
    }
    if (cv.status !== 'done') return

    setSubmitting(true)
    try {
      const res = await submitApplication({
        jobId: job.id,
        formVersionId: job.formVersionId,
        uploadId: cv.uploadId,
        answers: validation.clean,
        turnstileToken: token || undefined,
      })
      setResult({
        referenceId: res.referenceId,
        name: firstName(validation.clean.fullName),
        email: String(validation.clean.email ?? ''),
      })
    } catch (error) {
      if (error instanceof ApiError) {
        const serverFields = Object.fromEntries(
          Object.entries(error.fields).map(([k, v]) => [k.replace(/^answers\./, ''), v]),
        )
        if (serverFields.cv) setCv({ status: 'idle' })
        if (Object.keys(serverFields).length) {
          setErrors(serverFields)
          const firstKey = fields.find((f) => serverFields[f.key])?.key
          if (firstKey) focusField(firstKey)
        }
        setFormError(error.message)
      } else {
        setFormError('Something went wrong. Please try again.')
      }
      if (TURNSTILE_SITE_KEY) {
        setToken('')
        setTurnstileKey((k) => k + 1)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="apply-success" ref={rootRef} role="status">
        <CheckCircle2 className="apply-success-icon" size={48} aria-hidden="true" />
        <h3 className="apply-success-title">
          {talentPool ? 'Your CV is in' : 'Application sent'}
          {result.name ? `, ${result.name}` : ''}
        </h3>
        <p className="apply-success-text">
          {talentPool
            ? 'Thank you for your interest in Dekko ISHO Group. We’ll be in touch when a role that matches your experience opens up.'
            : `Thank you for applying for ${job.title}. Our team will review your application and contact you if you’re shortlisted.`}
        </p>
        <dl className="apply-success-ref">
          <dt>Your reference</dt>
          <dd>{result.referenceId}</dd>
        </dl>
        {result.email && <p className="apply-success-note">We’ve sent a confirmation to {result.email}.</p>}
        <Link to="/career/jobs" className="apply-button apply-button--secondary">
          Browse open roles
        </Link>
      </div>
    )
  }

  const busy = cv.status === 'uploading' || cv.status === 'reading'

  function renderCv(field: FormField) {
    return (
      <div key={field.key} className={`apply-field apply-cv${errors.cv ? ' has-error' : ''}`}>
        <span className="apply-label" id={`${fieldDomId('cv')}-label`}>
          {field.label}
          <span className="apply-required" aria-hidden="true">
            {' '}*
          </span>
        </span>

        {cv.status === 'done' ? (
          <div className="apply-cv-done">
            <FileText size={22} aria-hidden="true" />
            <div className="apply-cv-done-text">
              <span className="apply-cv-file">{cv.fileName}</span>
              <span className="apply-cv-status">
                {cv.filled > 0
                  ? `We filled in ${cv.filled} ${cv.filled === 1 ? 'detail' : 'details'} from your CV. Please check them before you submit.`
                  : cv.readOk
                    ? 'Your CV is attached. Please complete the form below.'
                    : 'Your CV is attached. We couldn’t read the details from it, so please fill in the form below.'}
              </span>
            </div>
            <button
              type="button"
              className="apply-link-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <RefreshCw size={14} aria-hidden="true" /> Replace
            </button>
          </div>
        ) : (
          <label
            htmlFor={fieldDomId('cv')}
            className={`apply-dropzone${dragging ? ' is-dragging' : ''}${busy ? ' is-busy' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              if (!busy) setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {busy ? (
              <>
                <LoaderCircle className="apply-spin" size={28} aria-hidden="true" />
                <span className="apply-dropzone-title" aria-live="polite">
                  {cv.status === 'uploading'
                    ? `Uploading ${cv.fileName}… ${Math.round(cv.progress * 100)}%`
                    : 'Reading your CV…'}
                </span>
                <span className="apply-dropzone-hint">
                  {cv.status === 'reading' ? 'This takes a few seconds. We’ll fill in what we can for you.' : ' '}
                </span>
              </>
            ) : (
              <>
                <UploadCloud size={28} aria-hidden="true" />
                <span className="apply-dropzone-title">
                  <span className="apply-dropzone-cta">Choose a file</span> or drag it here
                </span>
                <span className="apply-dropzone-hint">{field.helpText || 'PDF, Word or image, up to 10 MB.'}</span>
              </>
            )}
          </label>
        )}

        <input
          ref={fileInputRef}
          id={fieldDomId('cv')}
          type="file"
          accept={CV_ACCEPT_EXT}
          className="apply-visually-hidden"
          aria-labelledby={`${fieldDomId('cv')}-label`}
          aria-invalid={errors.cv ? true : undefined}
          aria-describedby={errors.cv ? `${fieldDomId('cv')}-error` : undefined}
          disabled={busy}
          onChange={(e) => void handleCv(e.target.files?.[0])}
        />
        {cv.status === 'error' && (
          <p className="apply-error" role="alert">
            {cv.message}
          </p>
        )}
        {errors.cv && cv.status !== 'error' && (
          <p className="apply-error" id={`${fieldDomId('cv')}-error`} role="alert">
            {errors.cv}
          </p>
        )}
      </div>
    )
  }

  const errorCount = Object.keys(errors).length

  return (
    <div ref={rootRef}>
      <form className="apply-form" noValidate onSubmit={onSubmit}>
        {errorCount > 0 && (
          <div className="apply-alert" role="alert">
            <Info size={18} aria-hidden="true" />
            <span>
              Please check {errorCount === 1 ? 'the highlighted field' : `the ${errorCount} highlighted fields`} below.
            </span>
          </div>
        )}

        {fields.map((field) => {
          if (field.type === 'cv') return renderCv(field)
          return (
            <FormFieldInput
              key={field.key}
              field={field}
              value={answers[field.key]}
              error={errors[field.key]}
              autofilled={autofilled.has(field.key)}
              jobId={job.id}
              onChange={(value) => setAnswer(field.key, value)}
            />
          )
        })}

        <Turnstile onToken={setToken} resetKey={turnstileKey} />

        {formError && (
          <p className="apply-form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" className="apply-button apply-submit" disabled={submitting || busy}>
          {submitting ? (
            <>
              <LoaderCircle className="apply-spin" size={18} aria-hidden="true" /> Sending…
            </>
          ) : talentPool ? (
            'Send my CV'
          ) : (
            'Submit application'
          )}
        </button>
      </form>
    </div>
  )
}
