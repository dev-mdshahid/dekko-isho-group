import { Bone, BoneLines } from '../../components/ui/Skeleton'

const BUTTON_RADIUS = 'var(--border-radius--md)'

function MetaSkeleton({ widths, className = '' }: { widths: string[]; className?: string }) {
  return (
    <ul className={`careers-meta ${className}`} aria-hidden="true">
      {widths.map((width, i) => (
        <li key={i}>
          <Bone width="1rem" height="1rem" radius="50%" />
          <span>
            <Bone width={width} />
          </span>
        </li>
      ))}
    </ul>
  )
}

export function JobCardSkeleton({ titleWidth = '62%' }: { titleWidth?: string }) {
  return (
    <div className="careers-card careers-card--skeleton" aria-hidden="true">
      <div className="careers-card-top">
        <span className="careers-card-dept">
          <Bone width="6.5rem" />
        </span>
      </div>
      <div className="careers-card-title">
        <Bone width={titleWidth} />
      </div>
      <MetaSkeleton widths={['4.5rem', '4rem', '5.5rem']} />
      <BoneLines className="careers-card-summary careers-skeleton-summary" widths={['82%']} />
      <div className="careers-card-footer">
        <span className="careers-card-dates">
          <span>
            <Bone width="5rem" />
          </span>
        </span>
        <span className="careers-card-cta">
          <span>
            <Bone width="5rem" />
          </span>
        </span>
      </div>
    </div>
  )
}

export function JobListSkeleton({ count = 3 }: { count?: number }) {
  const widths = ['62%', '48%', '56%', '44%']
  return (
    <div className="careers-list" role="status" aria-busy="true" aria-label="Loading roles">
      {Array.from({ length: count }, (_, i) => (
        <JobCardSkeleton key={i} titleWidth={widths[i % widths.length]} />
      ))}
    </div>
  )
}

export function FiltersSkeleton() {
  const groups = [
    ['70%', '55%', '62%'],
    ['48%', '60%'],
    ['66%', '52%', '58%'],
  ]
  return (
    <div className="careers-skeleton-filters" aria-hidden="true">
      {groups.map((options, g) => (
        <div key={g} className="careers-filter-group">
          <div className="careers-filter-legend">
            <Bone width="5.5rem" />
          </div>
          <div className="careers-filter-options">
            {options.map((width, i) => (
              <div key={i} className="careers-filter-option is-skeleton">
                <Bone width="1rem" height="1rem" radius="0.25rem" />
                <span className="careers-filter-name">
                  <Bone width={width} />
                </span>
                <span className="careers-filter-count">
                  <Bone width="1rem" />
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function JobHeroSkeleton() {
  return (
    <div className="careers-hero-stack" role="status" aria-busy="true" aria-label="Loading role">
      <div className="careers-card-top" aria-hidden="true">
        <span className="careers-card-dept">
          <Bone width="7rem" />
        </span>
      </div>
      <div className="careers-hero-title careers-job-title" aria-hidden="true">
        <span className="careers-skeleton-line">
          <Bone width="min(26rem, 85%)" />
        </span>
        <span className="careers-skeleton-line careers-skeleton-line--mobile">
          <Bone width="55%" />
        </span>
      </div>
      <MetaSkeleton widths={['4rem', '4.5rem']} className="careers-meta--hero" />
      <div className="careers-job-dates" aria-hidden="true">
        <span>
          <Bone width="5.5rem" />
        </span>
      </div>
      <div className="careers-job-actions" aria-hidden="true">
        <Bone block width="8.5rem" height="3rem" radius={BUTTON_RADIUS} />
      </div>
    </div>
  )
}

export function ApplyFormSkeleton({ label = 'Loading form' }: { label?: string }) {
  const fields = ['6rem', '7.5rem', '5rem', '8rem']
  return (
    <div className="apply-form" role="status" aria-busy="true" aria-label={label}>
      <div className="apply-field" aria-hidden="true">
        <span className="apply-label">
          <Bone width="4.5rem" />
        </span>
        <Bone block height="10.375rem" radius="var(--border-radius--lg)" />
      </div>
      {fields.map((width, i) => (
        <div key={i} className="apply-field" aria-hidden="true">
          <span className="apply-label">
            <Bone width={width} />
          </span>
          <Bone block height="3rem" radius={BUTTON_RADIUS} />
        </div>
      ))}
      <Bone block width="14rem" height="3rem" radius={BUTTON_RADIUS} />
    </div>
  )
}

export function JobBodySkeleton() {
  return (
    <section className="careers-body" aria-hidden="true">
      <div className="career-content-container careers-job-layout">
        <div className="careers-job-main">
          <article className="careers-prose careers-skeleton-prose">
            <div className="careers-skeleton-heading">
              <Bone width="9rem" />
            </div>
            <BoneLines className="careers-skeleton-paragraph" widths={['100%', '94%', '58%']} />
            <div className="careers-skeleton-heading">
              <Bone width="11rem" />
            </div>
            <BulletsSkeleton widths={['72%', '64%', '52%']} />
            <div className="careers-skeleton-heading">
              <Bone width="13rem" />
            </div>
            <BulletsSkeleton widths={['68%', '58%', '74%']} />
          </article>

          <div className="careers-apply careers-apply--inline">
            <div className="careers-apply-inner">
              <div className="careers-apply-title">
                <Bone width="min(16rem, 70%)" />
              </div>
              <BoneLines className="careers-apply-lead" widths={['90%']} />
              <ApplyFormSkeleton label="Loading application form" />
            </div>
          </div>
        </div>

        <aside className="careers-job-aside">
          <div className="careers-glance">
            <div className="careers-glance-title">
              <Bone width="8.5rem" />
            </div>
            <div className="careers-glance-list">
              {['6rem', '4rem', '5rem'].map((width, i) => (
                <div key={i}>
                  <span className="careers-skeleton-dt">
                    <Bone width="4.5rem" />
                  </span>
                  <span className="careers-skeleton-dd">
                    <Bone width={width} />
                  </span>
                </div>
              ))}
            </div>
            <Bone block height="3rem" radius={BUTTON_RADIUS} />
            <div className="careers-share">
              <span className="careers-share-label">
                <Bone width="6rem" />
              </span>
              <div className="careers-share-buttons">
                {[0, 1, 2, 3].map((i) => (
                  <Bone key={i} block width="2.5rem" height="2.5rem" radius="50%" />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

function BulletsSkeleton({ widths }: { widths: string[] }) {
  return (
    <div className="careers-skeleton-bullets">
      {widths.map((width, i) => (
        <span key={i} className="careers-skeleton-bullet">
          <Bone width="0.375rem" height="0.375rem" radius="50%" />
          <Bone width={width} />
        </span>
      ))}
    </div>
  )
}
