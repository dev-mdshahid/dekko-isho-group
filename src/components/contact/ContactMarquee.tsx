import { clientLogos } from '../../data/home/clients'
import { legacyImage } from '../../lib/assets'

function ClientMarqueeList() {
  return (
    <div className="client-marquee-list">
      {clientLogos.map((logo) => (
        <div key={logo} className="client-marquee-item bg-white">
          <img src={legacyImage(logo)} loading="lazy" alt="Client Image" className="client-image" />
        </div>
      ))}
    </div>
  )
}

export function ContactMarquee() {
  return (
    <div data-w-id="16a1fb41-f3b4-8a07-c057-a78c67b3fe82" className="client-marquee">
      <div className="client-marquee-track">
        <ClientMarqueeList />
        <ClientMarqueeList />
        <ClientMarqueeList />
      </div>
    </div>
  )
}
