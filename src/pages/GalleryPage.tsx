import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { GalleryContent } from './GalleryContent'

const GALLERY_TITLE = 'Gallery | Dekko Isho Group'

export function GalleryPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={GALLERY_TITLE} />
      <GalleryContent />
    </SiteLayout>
  )
}
