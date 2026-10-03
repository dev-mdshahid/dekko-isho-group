import { PageMeta } from '../components/common/PageMeta'
import { NewsContent } from '../components/news'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'

const NEWS_TITLE = 'News | Dekko ISHO Group'

const NewsPage = () => {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={NEWS_TITLE} />
      <NewsContent />
    </SiteLayout>
  )
}

export default NewsPage
