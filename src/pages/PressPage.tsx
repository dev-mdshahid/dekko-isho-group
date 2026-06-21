import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { PressContent } from './PressContent'

const PRESS_TITLE = 'Press | Dekko Isho Group'

export function PressPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={PRESS_TITLE} />
      <PressContent />
    </SiteLayout>
  )
}
