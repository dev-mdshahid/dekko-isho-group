import type { ReactNode } from 'react'

type IconProps = {
  children: ReactNode
}

function ResponsibilityIcon({ children }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="globus-garments-responsibility-card-icon-svg"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const globusGarmentsResponsibilityIcons = {
  compliance: (
    <ResponsibilityIcon>
      <path
        d="M6.667 3.333h6.666l2.667 2.667V16.667H6.667V3.333Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M10 3.333V6h2.667M7.5 10h5M7.5 12.5h5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="m8.333 14.167 1.334 1.333 2.666-2.666"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ResponsibilityIcon>
  ),
  energy: (
    <ResponsibilityIcon>
      <circle cx="10" cy="10" r="3.333" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M10 2.5v2.083M10 15.417V17.5M17.5 10h-2.083M4.583 10H2.5M15.303 4.697l-1.473 1.473M6.17 13.83l-1.473 1.473M15.303 15.303l-1.473-1.473M6.17 6.17 4.697 4.697"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </ResponsibilityIcon>
  ),
  water: (
    <ResponsibilityIcon>
      <path
        d="M10 3.333c2.5 3.334 4.167 5.667 4.167 8.334A4.167 4.167 0 1 1 5.833 11.667c0-2.667 1.667-5 4.167-8.334Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </ResponsibilityIcon>
  ),
  traceability: (
    <ResponsibilityIcon>
      <circle cx="8.333" cy="8.333" r="2.083" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M11.667 11.667 15.833 15.833M13.75 8.333h2.083M13.75 10.417v-2.084"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </ResponsibilityIcon>
  ),
} as const
