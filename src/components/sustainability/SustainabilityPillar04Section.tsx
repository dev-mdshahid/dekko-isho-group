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

export function SustainabilityPillar04Section() {
  return (
    <section id="esg-reports" className="sustain-pillar-section sustain-pillar-section--light">
      <div className="container-medium">
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

        <div className="sustain-reports-grid">
          {pillar04.reports.map((report, index) => (
            <FadeIn
              key={report.id}
              id={`sustain-report-${report.id}`}
              className={`sustain-report-card sustain-report-card--${report.variant}`}
              delay={index * 80}
            >
              <div className={`sustain-report-cover sustain-report-cover--${report.variant}`}>
                <div className="sustain-report-cover-content">
                  <span className="sustain-report-cover-brand">DEKKO ISHO GROUP</span>
                  <span className="sustain-report-cover-subtitle">Inaugural Sustainability Report</span>
                  <span className="sustain-report-cover-tag">SUSTAINABILITY DISCLOSURE</span>
                  <span className="sustain-report-year">{report.year}</span>
                </div>
              </div>
              <div className="sustain-report-body">
                <h3 className="sustain-report-title">{report.title}</h3>
                <p className="sustain-report-description">{report.description}</p>
                {report.comingSoon ? (
                  <div
                    className={`sustain-report-download sustain-report-download--${report.variant} sustain-report-download--coming-soon`}
                  >
                    <span className="sustain-report-download-label">Download PDF</span>
                    <button
                      type="button"
                      disabled
                      className="sustain-report-download-icon sustain-report-download-icon--text"
                    >
                      Coming Soon
                    </button>
                  </div>
                ) : (
                  <a
                    href={report.pdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`sustain-report-download sustain-report-download--${report.variant}`}
                  >
                    <span className="sustain-report-download-label">Download PDF</span>
                    <span className="sustain-report-download-icon" aria-hidden="true">
                      <DownloadIcon />
                    </span>
                  </a>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn id="sustain-pillar04-cta" className="sustain-esg-cta-bar">
          <p className="sustain-esg-cta-text">{pillar04.ctaText}</p>
          <ButtonArrow to={pillar04.ctaHref} label={pillar04.ctaButtonLabel} />
        </FadeIn>
      </div>
    </section>
  )
}
