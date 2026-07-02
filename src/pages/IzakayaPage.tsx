import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { IzakayaContent } from './IzakayaContent'

const IZAKAYA_TITLE = 'IZAKAYA | Dekko Isho Group'

export function IzakayaPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={IZAKAYA_TITLE} />
      <IzakayaContent />
    </SiteLayout>
  )
}
