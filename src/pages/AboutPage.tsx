import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { AboutContent } from './AboutContent'

const ABOUT_TITLE = 'About | Dekko Isho Group'

export function AboutPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={ABOUT_TITLE} />
      <AboutContent />
    </SiteLayout>
  )
}
