import { CertificationsSection } from '../certifications/CertificationsSection'
import { certifications, externalAffiliations } from '../../data/certifications/content'

export function SustainabilityCertificationsSection() {
  return (
    <CertificationsSection
      variant="sustainability"
      title={certifications.title}
      description={certifications.description}
      affiliations={externalAffiliations}
    />
  )
}
