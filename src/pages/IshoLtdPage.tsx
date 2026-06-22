import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { IshoLtdContent } from './IshoLtdContent'

const ISHO_LTD_TITLE = 'ISHO Ltd. | Dekko Isho Group'

export function IshoLtdPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={ISHO_LTD_TITLE} />
      <IshoLtdContent />
    </SiteLayout>
  )
}
