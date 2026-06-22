import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { DekkoFashionsContent } from './DekkoFashionsContent'

const DEKKO_FASHIONS_TITLE = 'Dekko Fashions Ltd. | Dekko Isho Group'

export function DekkoFashionsPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={DEKKO_FASHIONS_TITLE} />
      <DekkoFashionsContent />
    </SiteLayout>
  )
}
