import { manufacturingEcosystem } from '../../data/manufacturing/content'
import { SplitContentSection } from '../ui/SplitContentSection'

export function ManufacturingEcosystemSection() {
  return (
    <SplitContentSection
      className="mfg-ecosystem-section"
      {...manufacturingEcosystem}
    />
  )
}
