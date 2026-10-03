import {
  SolutionCapabilityCardsSection,
  type SolutionCapabilityCardItem,
  type SolutionCapabilityCardsContent,
} from './SolutionCapabilityCardsSection'

/** @deprecated Prefer SolutionCapabilityCardItem */
export type SolutionWashingProcessItem = SolutionCapabilityCardItem

export type SolutionWashingProcessesContent = Omit<SolutionCapabilityCardsContent, 'items'> & {
  processes: SolutionCapabilityCardItem[]
}

type SolutionWashingProcessesSectionProps = {
  idPrefix: string
  content: SolutionWashingProcessesContent
}

/** Thin wrapper kept for industrial laundry call sites. */
export function SolutionWashingProcessesSection({
  idPrefix,
  content,
}: SolutionWashingProcessesSectionProps) {
  const { processes, ...rest } = content

  return (
    <SolutionCapabilityCardsSection
      idPrefix={idPrefix}
      sectionKey="washing-processes"
      content={{ ...rest, items: processes }}
    />
  )
}
