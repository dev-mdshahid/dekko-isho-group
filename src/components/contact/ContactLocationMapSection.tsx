import { ExternalLink } from 'lucide-react'

const CONTACT_MAP_URL = 'https://maps.app.goo.gl/7sU6Ei8CPtQCaVNNA'
const CONTACT_MAP_LAT = 23.7701868
const CONTACT_MAP_LNG = 90.4069737
const CONTACT_MAP_ZOOM = 16

function getContactMapEmbedUrl() {
  const params = new URLSearchParams({
    q: `${CONTACT_MAP_LAT},${CONTACT_MAP_LNG}`,
    z: String(CONTACT_MAP_ZOOM),
    hl: 'en',
    t: 'm',
    maptype: 'roadmap',
    output: 'embed',
  })

  return `https://maps.google.com/maps?${params.toString()}`
}

export function ContactLocationMapSection() {
  return (
    <section className="page-contact-map-section" aria-label="Dekko Isho Group location map">
      <div className="page-contact-map-wrap">
        <a className="page-contact-map-link" href={CONTACT_MAP_URL} target="_blank" rel="noreferrer">
          <span>Open in Maps</span>
          <ExternalLink className="page-contact-map-link-icon" aria-hidden="true" />
        </a>

        <iframe
          title="Dekko Isho Group location map"
          src={getContactMapEmbedUrl()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="page-contact-map-iframe"
        />
      </div>
    </section>
  )
}
