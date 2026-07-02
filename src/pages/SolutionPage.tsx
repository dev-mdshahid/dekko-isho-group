import { Navigate, useParams } from 'react-router-dom'

import { PageMeta } from '../components/common/PageMeta'
import { getSolutionBySlug } from '../data/solutions/solutions'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { SolutionContent } from './SolutionContent'

export function SolutionPage() {
  const { slug = '' } = useParams()
  const solution = getSolutionBySlug(slug)

  useWebflowClasses()
  useScrollCounter()

  if (!solution) {
    return <Navigate to="/404" replace />
  }

  return (
    <SiteLayout>
      <PageMeta title={`${solution.title} | Dekko Isho Group`} />
      <SolutionContent solution={solution} />
    </SiteLayout>
  )
}
