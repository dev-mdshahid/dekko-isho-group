import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { CareerContent } from './CareerContent'

const CAREER_TITLE = 'Career | Dekko Isho Group'

export function CareerPage() {
  useWebflowClasses()

  return (
    <SiteLayout>
      <PageMeta title={CAREER_TITLE} />
      <CareerContent />
    </SiteLayout>
  )
}
