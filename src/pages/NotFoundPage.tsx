import { PageMeta } from '../components/common/PageMeta'
import { ButtonArrow } from '../components/ui/ButtonArrow'
import { SiteLayout } from '../layouts/SiteLayout'
import { useWebflowClasses } from '../hooks/useWebflowClasses'

const NOT_FOUND_TITLE = 'Page Not Found | Dekko Isho Group'

export function NotFoundPage() {
  useWebflowClasses()

  return (
    <SiteLayout>
      <PageMeta title={NOT_FOUND_TITLE} />
      <div className="utility-page-wrap">
        <div className="utility-page-content">
          <h1 className="error-title">404</h1>
          <h2 className="heading-h4">Page Not Found</h2>
          <div className="error-description">
            The page you are looking for doesn&apos;t exist or has been moved
          </div>
          <div className="_404-button">
            <ButtonArrow
              to="/"
              label="Back To Home"
              className="primary-button _404-button-primary w-inline-block"
            />
          </div>
        </div>
      </div>
    </SiteLayout>
  )
}
