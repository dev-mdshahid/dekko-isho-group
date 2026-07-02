import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { GlobusGarmentsContent } from './GlobusGarmentsContent'

const GLOBUS_GARMENTS_TITLE = 'Globus Garments Ltd. | Dekko Isho Group'

export function GlobusGarmentsPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={GLOBUS_GARMENTS_TITLE} />
      <GlobusGarmentsContent />
    </SiteLayout>
  )
}
