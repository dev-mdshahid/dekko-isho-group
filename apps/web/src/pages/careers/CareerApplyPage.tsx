import { Bell, FileSearch, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../../components/common/PageMeta'
import { PreSectionTitle } from '../../components/ui/PreSectionTitle'
import { useWebflowClasses } from '../../hooks/useWebflowClasses'
import { SiteLayout } from '../../layouts/SiteLayout'
import { ApiError } from '../../lib/api'
import { fetchTalentPool, type PublicJobDetail } from '../../lib/careersApi'
import { ApplicationForm } from './ApplicationForm'
import { Breadcrumbs } from './Breadcrumbs'
import { ApplyFormSkeleton } from './CareerSkeletons'
import './careers.css'

type State = { status: 'loading' } | { status: 'closed' } | { status: 'error' } | { status: 'ready'; job: PublicJobDetail }

const STEPS = [
  { icon: Sparkles, title: 'Upload your CV', text: 'We’ll read it and fill in the form for you.' },
  { icon: FileSearch, title: 'We keep it on file', text: 'Our recruiters search it whenever a new role opens.' },
  { icon: Bell, title: 'We reach out', text: 'If a role fits your experience, we’ll contact you directly.' },
]

export default function CareerApplyPage() {
  useWebflowClasses()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchTalentPool(controller.signal)
      .then((job) => setState({ status: 'ready', job }))
      .catch((error) => {
        if ((error as Error).name === 'AbortError') return
        setState({ status: error instanceof ApiError && error.status === 404 ? 'closed' : 'error' })
      })
    return () => controller.abort()
  }, [attempt])

  return (
    <SiteLayout>
      <PageMeta title="Apply for a Future Position | Careers at Dekko ISHO Group" />
      <main className="careers-page">
        <section className="careers-hero careers-hero--centered">
          <div className="career-content-container careers-narrow">
            <div className="careers-hero-meta">
              <Breadcrumbs items={[{ label: 'Careers', to: '/career' }, { label: 'Apply' }]} />
              <PreSectionTitle title="Future roles" />
            </div>
            <h1 className="careers-hero-title">Apply for a future position</h1>
            <p className="careers-hero-lead">
              Don’t see the right role today? Share your CV and be first in line when one opens up across Dekko ISHO Group.
            </p>
            <ol className="careers-steps">
              {STEPS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="careers-step">
                  <Icon size={20} aria-hidden="true" />
                  <div>
                    <span className="careers-step-title">{title}</span>
                    <span className="careers-step-text">{text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="careers-apply careers-apply--flush" aria-labelledby="apply-title">
          <div className="career-content-container careers-narrow">
            <div className="careers-apply-inner">
              <h2 id="apply-title" className="careers-apply-title">
                Share your CV
              </h2>

              {state.status === 'loading' && <ApplyFormSkeleton />}

              {state.status === 'closed' && (
                <div className="careers-empty careers-empty--inline">
                  <p>We’re not collecting CVs for future roles right now. Please check our open roles instead.</p>
                  <Link to="/career/jobs" className="apply-button">
                    See open roles
                  </Link>
                </div>
              )}

              {state.status === 'error' && (
                <div className="careers-empty careers-empty--inline">
                  <p>We couldn’t load the form. Please check your connection and try again.</p>
                  <button
                    type="button"
                    className="apply-button"
                    onClick={() => {
                      setState({ status: 'loading' })
                      setAttempt((n) => n + 1)
                    }}
                  >
                    Try again
                  </button>
                </div>
              )}

              {state.status === 'ready' && (
                <div className="careers-loaded">
                  <ApplicationForm job={state.job} talentPool />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  )
}
