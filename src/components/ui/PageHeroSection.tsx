import { useRef, type ReactNode } from 'react'

import { useAboutHeroAnimation } from '../../hooks/useAboutHeroAnimation'
import { NoiseOverlay, SectionLines } from './SectionDecor'

export type PageHeroTitleWord = {
  text: string
  accent?: 'primary' | 'green' | 'red'
}

export type PageHeroSectionProps = {
  titleLines: PageHeroTitleWord[][]
  subtitle?: string
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export function PageHeroSection({
  titleLines,
  subtitle,
  actions,
  children,
  className,
}: PageHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  useAboutHeroAnimation(sectionRef)

  const sectionClassName = ['about-hero-section', className].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName} ref={sectionRef}>
      <div className="about-hero-inner">
        <div className="container-full">
          <div className="about-hero-title-wrap">
            <h1 className="about-hero-title">
              {titleLines.map((line) => (
                <span key={line.map((word) => word.text).join(' ')} className="hero-title-line">
                  {line.map((word, index) => (
                    <span key={`${word.text}-${index}`}>
                      {index > 0 ? ' ' : null}
                      <span
                        className={[
                          'hero-title-word',
                          word.accent ? `hero-title-accent hero-title-accent--${word.accent}` : null,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        data-about-animate="hero-word"
                      >
                        {word.text}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            {subtitle ? (
              <p className="about-hero-subtitle" data-about-animate="hero-subtitle">
                {subtitle}
              </p>
            ) : null}
            {actions}
          </div>
        </div>
      </div>
      <div className="hero-section-overlay" aria-hidden="true" />
      <SectionLines />
      <NoiseOverlay />
      {children}
    </section>
  )
}
