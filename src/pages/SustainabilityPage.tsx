import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { SustainabilityContent } from './SustainabilityContent'

const SUSTAINABILITY_TITLE = 'Sustainability | Dekko Isho Group'

export function SustainabilityPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={SUSTAINABILITY_TITLE} />
      <SustainabilityContent />
    </SiteLayout>
  )
}
