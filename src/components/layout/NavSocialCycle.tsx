import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { footerSocialLinks } from '../../data/footer/footerContent'

const CYCLE_INTERVAL_MS = 2600

type NavSocialBrand = {
  id: string
  href: string
  label: string
  brandColor: string
  icon: ReactNode
}

export const navSocialBrands: readonly NavSocialBrand[] = [
  {
    id: 'facebook',
    href: footerSocialLinks[0].href,
    label: 'Facebook',
    brandColor: '#1877f2',
    icon: (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M14.1654 3.1713V3.78472C14.1654 4.47508 13.6057 5.03472 12.9154 5.03472C12.225 5.03472 11.6654 5.59437 11.6654 6.28472V8.19445H12.5855C12.799 8.19445 12.9058 8.19445 12.9954 8.2065C13.5981 8.28759 14.0722 8.7617 14.1533 9.36445C14.1654 9.45404 14.1654 9.5608 14.1654 9.77431C14.1654 9.98781 14.1654 10.0946 14.1533 10.1842C14.0722 10.7869 13.5981 11.261 12.9954 11.3421C12.9058 11.3542 12.799 11.3542 12.5855 11.3542H11.6654V16.4583C11.6654 16.7526 11.6654 16.8997 11.6425 17.0223C11.5403 17.5708 11.1112 17.9999 10.5627 18.1022C10.4401 18.125 10.2929 18.125 9.9987 18.125C9.70445 18.125 9.55732 18.125 9.43473 18.1022C8.88621 17.9999 8.45709 17.5708 8.35488 17.0223C8.33203 16.8997 8.33203 16.7526 8.33203 16.4583V11.3542H7.41189C7.19838 11.3542 7.09163 11.3542 7.00204 11.3421C6.39929 11.261 5.92517 10.7869 5.84408 10.1842C5.83203 10.0946 5.83203 9.98781 5.83203 9.77431C5.83203 9.5608 5.83203 9.45404 5.84408 9.36445C5.92517 8.7617 6.39929 8.28759 7.00204 8.2065C7.09163 8.19445 7.19838 8.19445 7.41189 8.19445H8.33203V6.41204C8.33203 3.9063 10.3633 1.875 12.8691 1.875C13.585 1.875 14.1654 2.45537 14.1654 3.1713Z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    href: footerSocialLinks[1].href,
    label: 'LinkedIn',
    brandColor: '#0a66c2',
    icon: (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M6.17875 16.7425V7.71125H3.1775V16.7425H6.17875ZM4.67875 6.4775C5.725 6.4775 6.37625 5.785 6.37625 4.9175C6.3575 4.03125 5.72625 3.3575 4.69875 3.3575C3.67125 3.3575 3 4.0325 3 4.9175C3 5.785 3.65125 6.4775 4.65875 6.4775H4.67875ZM10.8138 16.7425V11.6988C10.8138 11.4288 10.8337 11.1587 10.9137 10.9662C11.13 10.4275 11.6238 9.86875 12.4538 9.86875C13.54 9.86875 13.9737 10.6963 13.9737 11.9113V16.7425H16.975V11.5625C16.975 8.7875 15.495 7.4975 13.52 7.4975C11.9275 7.4975 11.2138 8.3725 10.8138 8.98875V7.71125H7.81375C7.85125 8.55875 7.81375 16.7425 7.81375 16.7425H10.8138Z" />
      </svg>
    ),
  },
  {
    id: 'x',
    href: footerSocialLinks[2].href,
    label: 'X',
    brandColor: '#111111',
    icon: (
      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M2.03262 16.1998C1.54447 16.6879 1.54447 17.4794 2.03262 17.9675C2.52078 18.4557 3.31223 18.4557 3.80039 17.9675L2.9165 17.0837L2.03262 16.1998ZM17.9671 3.80088C18.4552 3.31272 18.4552 2.52126 17.9671 2.03311C17.4789 1.54495 16.6874 1.54495 16.1993 2.03311L17.0832 2.91699L17.9671 3.80088ZM2.9165 17.0837L3.80039 17.9675L10.0504 11.7175L9.1665 10.8337L8.28262 9.94978L2.03262 16.1998L2.9165 17.0837ZM10.8332 9.16699L11.7171 10.0509L17.9671 3.80088L17.0832 2.91699L16.1993 2.03311L9.94929 8.28311L10.8332 9.16699Z" />
        <path d="M5.06208 1.875H4.02953C2.95228 1.875 2.41365 1.875 2.18845 2.15854C2.11822 2.24696 2.06886 2.3501 2.04405 2.46027C1.96452 2.81352 2.30242 3.23298 2.97822 4.07189L13.8935 17.6219C14.0702 17.8412 14.1585 17.9509 14.2749 18.02C14.3133 18.0428 14.3537 18.0621 14.3955 18.0777C14.5223 18.125 14.6632 18.125 14.9448 18.125H15.9716C17.0485 18.125 17.587 18.125 17.8122 17.8415C17.8824 17.7531 17.9318 17.65 17.9566 17.5398C18.0362 17.1867 17.6985 16.7672 17.0231 15.9284L6.11362 2.37838C5.93693 2.15893 5.84859 2.0492 5.73218 1.98009C5.69376 1.95728 5.65338 1.93795 5.61152 1.92233C5.48469 1.875 5.34382 1.875 5.06208 1.875Z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    href: footerSocialLinks[3].href,
    label: 'YouTube',
    brandColor: '#ff0000',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z"
        />
      </svg>
    ),
  },
]

/**
 * Transparent circular link next to the navbar Contact CTA that cycles through the
 * social profiles: the current glyph blurs out while the next one focuses in.
 * Cycling pauses on hover/focus so the visible profile stays clickable.
 */
export function NavSocialCycle() {
  const [{ index, leavingIndex }, setCycle] = useState({ index: 0, leavingIndex: -1 })
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setCycle((current) => ({
        index: (current.index + 1) % navSocialBrands.length,
        leavingIndex: current.index,
      }))
    }, CYCLE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [isPaused])

  const active = navSocialBrands[index]

  return (
    <a
      href={active.href}
      target="_blank"
      rel="noreferrer"
      className="nav-social-cycle"
      aria-label={`Dekko Isho Group on ${active.label}`}
      style={{ '--nav-cycle-brand': active.brandColor } as CSSProperties}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <span className="nav-social-cycle__stack" aria-hidden="true">
        {navSocialBrands.map((brand, brandIndex) => {
          let stateClass = ''
          if (brandIndex === index) {
            stateClass = ' is-active'
          } else if (brandIndex === leavingIndex) {
            stateClass = ' is-leaving'
          }

          return (
            <span
              key={brand.id}
              className={`nav-social-cycle__icon nav-social-cycle__icon--${brand.id}${stateClass}`}
            >
              {brand.icon}
            </span>
          )
        })}
      </span>
    </a>
  )
}
