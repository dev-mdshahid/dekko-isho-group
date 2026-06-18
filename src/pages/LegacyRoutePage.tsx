import { LegacyPageFrame } from '../components/common/LegacyPageFrame'
import { PageMeta } from '../components/common/PageMeta'
import { Home2Layout } from '../layouts/Home2Layout'
import { MainLayout } from '../layouts/MainLayout'
import type { LegacyRoute } from '../data/legacyRoutes'
import { useWebflowClasses } from '../hooks/useWebflowClasses'

type Props = {
  route: LegacyRoute
}

export function LegacyRoutePage({ route }: Props) {
  useWebflowClasses()

  const content = (
    <>
      <PageMeta title={route.title} />
      <LegacyPageFrame file={route.file} />
    </>
  )

  if (route.layout === 'home2') return <Home2Layout>{content}</Home2Layout>
  if (route.layout === 'none') return content
  return <MainLayout>{content}</MainLayout>
}
