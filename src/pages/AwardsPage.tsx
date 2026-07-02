import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { AwardsContent } from './AwardsContent'

const AWARDS_TITLE = 'Awards & Certifications | Dekko Isho Group'

export function AwardsPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={AWARDS_TITLE} />
      <AwardsContent />
    </SiteLayout>
  )
}
