import { SolutionProductionNetworkSection } from '../solutions'
import { manufacturingProductionNetwork } from '../../data/manufacturing/content'

/** @deprecated Prefer SolutionProductionNetworkSection with content props. */
export function ManufacturingProductionNetworkSection() {
  return (
    <SolutionProductionNetworkSection
      idPrefix="mfg"
      content={manufacturingProductionNetwork}
    />
  )
}
