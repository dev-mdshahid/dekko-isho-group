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
} as const
