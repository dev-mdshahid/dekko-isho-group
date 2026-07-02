import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { KlubhausContent } from './KlubhausContent'

const KLUBHAUS_TITLE = 'Klubhaus | Dekko Isho Group'

export function KlubhausPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={KLUBHAUS_TITLE} />
      <KlubhausContent />
    </SiteLayout>
  )
}
