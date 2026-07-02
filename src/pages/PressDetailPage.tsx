import { Navigate, useParams } from 'react-router-dom'

import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { getPressPostBySlug } from '../data/press/pressPosts'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { PressDetailContent } from './PressDetailContent'

export function PressDetailPage() {
  const { slug = '' } = useParams()
  const post = getPressPostBySlug(slug)

  useWebflowClasses()
  useScrollCounter()

  if (!post) {
    return <Navigate to="/404" replace />
  }

  return (
    <SiteLayout>
      <PageMeta title={`${post.title} | Dekko Isho Group`} />
      <PressDetailContent slug={slug} />
    </SiteLayout>
  )
}
