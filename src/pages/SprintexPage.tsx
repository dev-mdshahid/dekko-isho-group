import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { SprintexContent } from './SprintexContent'

const SPRINTEX_TITLE = 'Sprintex Enterprise | Dekko Isho Group'

export function SprintexPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={SPRINTEX_TITLE} />
      <SprintexContent />
    </SiteLayout>
  )
}
