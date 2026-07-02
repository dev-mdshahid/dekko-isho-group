import type { ReactNode } from 'react'

type IconProps = {
  children: ReactNode
}

export function IndustryFeatureIcon({ children }: IconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="industry-feature-icon"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const industryFeatureIcons = {
  tshirt: (
    <IndustryFeatureIcon>
      <path
        d="M4.667 4.667 2.667 6v1.333l1.333.667V12h8V8l1.333-.667V6L11.333 4.667 8 6 4.667 4.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  diamond: (
    <IndustryFeatureIcon>
      <path
        d="M8 2.667 12 8 8 13.333 4 8 8 2.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  dress: (
    <IndustryFeatureIcon>
      <path
        d="M5.333 3.333 8 2l2.667 1.333V5.333L8 12 5.333 5.333V3.333Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M5.333 5.333h5.334"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </IndustryFeatureIcon>
  ),
  airplane: (
    <IndustryFeatureIcon>
      <path
        d="M2.667 8h4.666L8 13.333 10.667 8h2.666L13.333 4 8 5.333 2.667 4 5.333 8Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  document: (
    <IndustryFeatureIcon>
      <path
        d="M4.667 2.667h4l2.666 2.666V13.333H4.667V2.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8.667 2.667V5.333H11.333M6 8h4M6 10.667h4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </IndustryFeatureIcon>
  ),
  woven: (
    <IndustryFeatureIcon>
      <path
        d="M5.333 5.333c0-1.473 1.194-2.666 2.667-2.666s2.667 1.193 2.667 2.666c0 1.474-1.194 2.667-2.667 2.667M5.333 10.667c0-1.473 1.194-2.667 2.667-2.667s2.667 1.194 2.667 2.667"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </IndustryFeatureIcon>
  ),
  designProduction: (
    <IndustryFeatureIcon>
      <path
        d="M4.667 2.667h4l2.666 2.666V13.333H4.667V2.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M8.667 2.667V5.333H11.333M10 11.333 12.667 8.667"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  shieldCheck: (
    <IndustryFeatureIcon>
      <path
        d="M8 2.667 12 4.667V8c0 2.2-1.6 4.267-4 5.333-2.4-1.066-4-3.133-4-5.333V4.667L8 2.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M6.333 8 7.333 9 9.667 6.667"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  factory: (
    <IndustryFeatureIcon>
      <path
        d="M2.667 13.333h10.666M4 13.333V6.667l2.667-2 2.666 2V13.333M9.333 13.333V8l2.667-2V13.333"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  processGrid: (
    <IndustryFeatureIcon>
      <path
        d="M2.667 2.667h4v4h-4v-4ZM9.333 2.667h4v4h-4v-4ZM2.667 9.333h4v4h-4v-4ZM9.333 9.333h4v4h-4v-4Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  washing: (
    <IndustryFeatureIcon>
      <path
        d="M4 3.333h8v2.5H4V3.333Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M5.333 8.333h5.334M5.333 11h5.334M8 5.833v9.167"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M6 5.833h4l.667 1.667H5.333L6 5.833Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </IndustryFeatureIcon>
  ),
  lab: (
    <IndustryFeatureIcon>
      <path
        d="M6 2.667h4l1.333 4-3.333 6.666L4.667 6.667 6 2.667Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M7.333 10h1.334M8 6.667v3.333"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </IndustryFeatureIcon>
  ),
} as const
