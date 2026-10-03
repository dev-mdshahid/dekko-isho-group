import type { ReactNode } from 'react'

type IconProps = {
  children: ReactNode
}

function ProcessIcon({ children }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="globus-garments-process-card-icon-svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const globusGarmentsProcessIcons = {
  material: (
    <ProcessIcon>
      <path
        d="M10 3.333c-2.21 0-4 1.194-4 2.667v1.333c0 .736.597 1.334 1.333 1.334h5.334c.736 0 1.333-.598 1.333-1.334V6c0-1.473-1.79-2.667-4-2.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M6 8.667V14h8V8.667M8 14v2.667M12 14v2.667"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ProcessIcon>
  ),
  cutting: (
    <ProcessIcon>
      <path
        d="M5.833 5.833 3.333 8.333l8.334 8.334 2.5-2.5M11.667 8.333l2.5-2.5M8.333 11.667l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ProcessIcon>
  ),
  sewing: (
    <ProcessIcon>
      <path
        d="M4.167 14.167 10 8.333l5.833 5.834M10 3.333v5M7.5 5.833h5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="15.833" r="1.667" stroke="currentColor" strokeWidth="1.2" />
    </ProcessIcon>
  ),
  washing: (
    <ProcessIcon>
      <path
        d="M5 3.333h10v13.334H5V3.333Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 8.333h5M7.5 11.667h5M10 3.333v2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </ProcessIcon>
  ),
  inspection: (
    <ProcessIcon>
      <path
        d="M10 4.167c2.761 0 5 2.238 5 5 0 3.75-5 6.666-5 6.666S5 12.917 5 9.167c0-2.762 2.239-5 5-5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="9.167" r="1.667" stroke="currentColor" strokeWidth="1.2" />
    </ProcessIcon>
  ),
  packing: (
    <ProcessIcon>
      <path
        d="M3.333 6.667 10 3.333l6.667 3.334v8.333L10 18.333l-6.667-3.333V6.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 10v8.333M3.333 6.667 10 10l6.667-3.333"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </ProcessIcon>
  ),
} as const
