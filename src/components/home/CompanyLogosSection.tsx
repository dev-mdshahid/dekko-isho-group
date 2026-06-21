import { companyLogos } from '../../data/home/companyLogos'

function CompanyLogosList({ listId }: { listId: string }) {
  return (
    <div className="company-logos-list" aria-hidden={listId !== '0' ? true : undefined}>
      {companyLogos.map((logo) => (
        <div key={`${listId}-${logo.alt}`} className="company-logos-item">
          <img src={logo.src} loading="lazy" decoding="async" alt={logo.alt} className="company-logos-image" />
        </div>
      ))}
    </div>
  )
}

export function CompanyLogosSection() {
  return (
    <section className="company-logos-section" aria-label="Partner brands">
      <div className="company-logos-marquee">
        <div className="company-logos-track">
          <CompanyLogosList listId="0" />
          <CompanyLogosList listId="1" />
          <CompanyLogosList listId="2" />
        </div>
      </div>
    </section>
  )
}
