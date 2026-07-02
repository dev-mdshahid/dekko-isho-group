import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { DekkoIshoContent } from './DekkoIshoContent'

const DEKKO_ISHO_TITLE = 'Dekko ISHO Technologies Ltd. | Dekko Isho Group'

export function DekkoIshoPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={DEKKO_ISHO_TITLE} />
      <DekkoIshoContent />
    </SiteLayout>
  )
}
