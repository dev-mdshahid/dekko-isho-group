import type { Certification } from '../../data/awards/certifications'
import { FadeIn } from '../ui/FadeIn'

type CertificationCardProps = {
  certification: Certification
  index: number
}

function PdfIcon() {
  return (
    <svg
      className="awards-card-preview-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 1H3.5C2.67 1 2 1.67 2 2.5v11c0 .83.67 1.5 1.5 1.5h9c.83 0 1.5-.67 1.5-1.5V5.5L9.5 1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M9.5 1v4.5H14" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path
        d="M5.25 9.25h1.1c.55 0 .95.4.95.9 0 .55-.4.95-.95.95h-.55v.8H5.25v-2.65Zm1.05 1.35c.2 0 .35-.15.35-.35 0-.2-.15-.35-.35-.35h-.55v.7h.55Z"
        fill="currentColor"
      />
      <path
        d="M8.1 9.25h1.05c.75 0 1.25.5 1.25 1.3 0 .8-.5 1.35-1.25 1.35H8.1V9.25Zm1 2.05c.35 0 .55-.25.55-.75 0-.5-.2-.75-.55-.75h-.4v1.5h.4Z"
        fill="currentColor"
      />
      <path d="M10.85 9.25h.55v2.65h-.55V9.25Z" fill="currentColor" />
    </svg>
  )
}

function PreviewButton({ previewUrl }: { previewUrl?: string }) {
  const content = (
    <>
      <PdfIcon />
      <span>Preview</span>
    </>
  )

  if (previewUrl) {
    return (
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="awards-card-preview"
      >
        {content}
      </a>
    )
  }

  return (
    <button type="button" className="awards-card-preview awards-card-preview--disabled" disabled aria-disabled="true">
      {content}
    </button>
  )
}

export function CertificationCard({ certification, index }: CertificationCardProps) {
  return (
    <FadeIn
      id={certification.id}
      className="awards-card"
      delay={index * 50}
    >
      <div className="awards-card-logos">
        {certification.logos.map((logo, logoIndex) => (
          <img
            key={`${certification.id}-logo-${logoIndex}`}
            src={logo.src}
            loading="lazy"
            alt={logo.alt}
            className="awards-card-logo"
          />
        ))}
      </div>
      <h2 className="awards-card-title">{certification.title}</h2>
      <p className="awards-card-subtitle">{certification.subtitle}</p>
      <PreviewButton previewUrl={certification.previewUrl} />
    </FadeIn>
  )
}
