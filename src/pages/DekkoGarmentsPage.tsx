import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { DekkoGarmentsContent } from './DekkoGarmentsContent'

const DEKKO_GARMENTS_TITLE = 'Dekko Garments Ltd | Dekko Isho Group'

export function DekkoGarmentsPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={DEKKO_GARMENTS_TITLE} />
      <DekkoGarmentsContent />
    </SiteLayout>
  )
}
