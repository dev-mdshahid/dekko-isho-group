import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { DekkoReadywaresContent } from './DekkoReadywaresContent'

const DEKKO_READYWARES_TITLE = 'Dekko Readywares Ltd. | Dekko Isho Group'

export function DekkoReadywaresPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={DEKKO_READYWARES_TITLE} />
      <DekkoReadywaresContent />
    </SiteLayout>
  )
}
