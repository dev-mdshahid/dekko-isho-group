import { useRef } from 'react'

import { useHorizontalScroll } from '../../hooks/useHorizontalScroll'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

export type SolutionWashingProcessItem = {
  id: string
  title: string
  image: string
  imageAlt: string
}

export type SolutionWashingProcessesContent = {
  id?: string
  badge: string
  title: string
  description: string
  processes: SolutionWashingProcessItem[]
}

type SolutionWashingProcessesSectionProps = {
  idPrefix: string
  content: SolutionWashingProcessesContent
}

export function SolutionWashingProcessesSection({
  idPrefix,
  content,
}: SolutionWashingProcessesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { id, badge, title, description, processes } = content
  useHorizontalScroll(scrollRef, { enableWheel: false })

  return (
    <section id={id ?? `${idPrefix}-washing-processes`} className="solution-washing-processes-section">
      <div className="solution-washing-processes-main">
        <FadeIn id={`${idPrefix}-washing-processes-header`} className="solution-washing-processes-header">
          <PreSectionTitle title={badge} />
          <h2 className="section-title solution-washing-processes-title">{title}</h2>
          <p className="solution-washing-processes-description">{description}</p>
        </FadeIn>

        <div ref={scrollRef} className="solution-washing-processes-scroll">
          <div className="solution-washing-processes-track">
            {processes.map((process, index) => (
              <FadeIn
                key={process.id}
                id={`${idPrefix}-washing-process-${process.id}`}
                className="solution-washing-process-card"
                delay={index * 60}
              >
                <img
                  src={process.image}
                  loading="lazy"
                  alt={process.imageAlt}
                  width={290}
                  height={512}
                  draggable={false}
                  className="solution-washing-process-card-image"
                />
                <div className="solution-washing-process-card-overlay" aria-hidden="true" />
                <h3 className="solution-washing-process-card-title">{process.title}</h3>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
