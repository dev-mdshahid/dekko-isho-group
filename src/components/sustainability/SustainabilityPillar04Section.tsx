import { pillar04 } from '../../data/sustainability/content'
import { ButtonArrow } from '../ui/ButtonArrow'
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

export function SustainabilityPillar04Section() {
  return (
    <section id="esg-reports" className="sustain-pillar-section sustain-pillar-section--light">
      <div className="container-medium sustain-pillar04-container">
        <FadeIn id="sustain-pillar04-header" className="sustain-pillar-header">
          <span className="sustain-pillar-number" aria-hidden="true">
            {pillar04.number}
          </span>
          <div className="sustain-pillar-header-content">
            <SustainabilityBadge title={pillar04.badge} />
            <h2 className="sustain-section-title">{pillar04.title}</h2>
            <p className="sustain-section-description">{pillar04.description}</p>
          </div>
        </FadeIn>

        <FadeIn id="sustain-pillar04-hero" className="sustain-pillar04-hero-wrap">
          <img
            src={pillar04.heroImage}
            loading="lazy"
            alt={pillar04.heroImageAlt}
            className="sustain-pillar04-hero-image"
          />
        </FadeIn>

        <div className="sustain-reports-grid">
          {pillar04.reports.map((report, index) => (
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
                  <ReportDownloadButton
                    href={report.comingSoon ? undefined : report.pdfHref}
                    variant={report.variant}
                    disabled={report.comingSoon}
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn id="sustain-pillar04-cta" className="sustain-esg-cta-bar">
          <p className="sustain-esg-cta-text">{pillar04.ctaText}</p>
          <ButtonArrow
            to={pillar04.ctaHref}
            label={pillar04.ctaButtonLabel}
            className="primary-button sustain-esg-cta-button w-inline-block"
          />
        </FadeIn>
      </div>
    </section>
  )
}
