import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { RoxyPaintsContent } from './RoxyPaintsContent'

const ROXY_PAINTS_TITLE = 'Roxy Paints Ltd. | Dekko Isho Group'

export function RoxyPaintsPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={ROXY_PAINTS_TITLE} />
      <RoxyPaintsContent />
    </SiteLayout>
  )
}
