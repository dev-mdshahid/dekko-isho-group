import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { AgamiFashionsContent } from './AgamiFashionsContent'

const AGAMI_FASHIONS_TITLE = 'Agami Fashions Ltd. | Dekko Isho Group'

export function AgamiFashionsPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={AGAMI_FASHIONS_TITLE} />
      <AgamiFashionsContent />
    </SiteLayout>
  )
}
