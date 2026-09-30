import { PageMeta } from '../components/common/PageMeta'

import { SiteLayout } from '../layouts/SiteLayout'

import { useScrollCounter } from '../hooks/useScrollCounter'

import { useWebflowClasses } from '../hooks/useWebflowClasses'

import { HomeContent } from './HomeContent'



const HOME_TITLE = 'Dekko ISHO Group'



export function HomePage() {

  useWebflowClasses()

  useScrollCounter()



  return (

    <SiteLayout>

      <PageMeta title={HOME_TITLE} />

      <HomeContent />

    </SiteLayout>

  )

}

