import { PageMeta } from '../components/common/PageMeta'
import { SiteLayout } from '../layouts/SiteLayout'
import { useScrollCounter } from '../hooks/useScrollCounter'
import { useWebflowClasses } from '../hooks/useWebflowClasses'
import { ContactContent } from './ContactContent'

const CONTACT_TITLE = 'Contact | Dekko Isho Group'

export function ContactPage() {
  useWebflowClasses()
  useScrollCounter()

  return (
    <SiteLayout>
      <PageMeta title={CONTACT_TITLE} />
      <ContactContent />
    </SiteLayout>
  )
}
