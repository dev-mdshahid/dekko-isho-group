import { pillar05 } from '../../data/sustainability/content'
import { FadeIn } from '../ui/FadeIn'
import { SustainabilityBadge } from './SustainabilityBadge'

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M8 2.5V10M8 10L5.5 7.5M8 10L10.5 7.5M3 11.5V12.5C3 13.0523 3.44772 13.5 4 13.5H12C12.5523 13.5 13 13.0523 13 12.5V11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ReportDownloadButtonProps = {
  href?: string
  variant: 'light' | 'dark'
  disabled?: boolean
}

function ReportDownloadButton({ href, variant, disabled }: ReportDownloadButtonProps) {
  const classes = `primary-button sustain-download-icon-button sustain-download-icon-button--${variant} w-inline-block`
  const inner = (
    <div className="button-primary-inner sustain-download-icon-button-inner">
      <div className="button-icon-bg sustain-download-icon-button-bg">
        <DownloadIcon />
      </div>
    </div>
  )

  if (disabled || !href) {
    return (
      <button type="button" disabled className={classes} aria-label="Download PDF — coming soon">
        {inner}
      </button>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label="Download PDF">
      {inner}
    </a>
  )
}

export function SustainabilityPillar05Section() {
  return (
    <section id="esg-reports" className="sustain-pillar-section sustain-pillar-section--disclosure">
      <div className="container-medium sustain-pillar05-container">
        <FadeIn id="sustain-pillar05-header" className="sustain-pillar-header">
          <span className="sustain-pillar-number" aria-hidden="true">
            {pillar05.number}
          </span>
          <div className="sustain-pillar-header-content">
            <SustainabilityBadge title={pillar05.badge} />
            <h2 className="sustain-section-title">{pillar05.title}</h2>
            <p className="sustain-section-description">{pillar05.description}</p>
          </div>
        </FadeIn>

        <div className="sustain-reports-grid">
          {pillar05.reports.map((report, index) => (
            <FadeIn
              key={report.id}
              id={`sustain-report-${report.id}`}
              className={`sustain-report-card sustain-report-card--${report.variant}`}
              delay={index * 80}
            >
              <div className="sustain-report-banner">
                <img
                  src={report.coverImage}
                  loading="lazy"
                  alt={`${report.title} cover`}
                  className="sustain-report-banner-image"
                />
              </div>

              <div className="sustain-report-body">
                <h3 className="sustain-report-title">{report.title}</h3>
                <p className="sustain-report-description">{report.description}</p>
                <div className={`sustain-report-download sustain-report-download--${report.variant}`}>
                  <span className="sustain-report-download-label">Download PDF</span>
                  <ReportDownloadButton href={report.pdfHref} variant={report.variant} />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
