import "./contact.css"

import { ExternalLink, MapPin } from 'lucide-react'

const CONTACT_MAP_URL = 'https://maps.app.goo.gl/w3dVU7SA7K4Ghn3X8'

const CONTACT_MAP_LAT = 23.7701868
const CONTACT_MAP_LNG = 90.4069737

const CONTACT_MAP_ZOOM = 12

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
    <section
      className="page-contact-map-section"
      aria-label="Dekko ISHO Group location map"
    >
      <div className="page-contact-map-wrap">
        <div className="page-contact-map-overlay">
          <div className="page-contact-map-overlay-content">
            <div className="page-contact-map-overlay-text">
              <h3 className="page-contact-map-overlay-title">
                Dekko ISHO Group
              </h3>

              <p className="page-contact-map-overlay-address">
                Dhaka, Bangladesh
              </p>

              <a
                href={CONTACT_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="page-contact-map-overlay-link"
              >
                View larger map
              </a>
            </div>

            <a
              href={CONTACT_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="page-contact-map-overlay-action"
              aria-label="Open Dekko ISHO Group location in Google Maps"
            >
              <ExternalLink
                className="page-contact-map-overlay-action-icon"
                aria-hidden="true"
              />

              <span>Directions</span>
            </a>
          </div>

          <div className="page-contact-map-overlay-location">
            <MapPin
              className="page-contact-map-overlay-pin"
              aria-hidden="true"
            />

            <span>Dekko ISHO Group</span>
          </div>
        </div>

        <iframe
          title="Dekko ISHO Group location map"
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