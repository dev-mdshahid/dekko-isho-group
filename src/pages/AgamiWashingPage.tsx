import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { AgamiWashingContent } from './AgamiWashingContent'

const AGAMI_WASHING_TITLE = 'Agami Washing Ltd. | Dekko Isho Group'

export function AgamiWashingPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={AGAMI_WASHING_TITLE} />
      <AgamiWashingContent />
    </SiteLayout>
  )
}
