type ButtonIconProps = {
  variant?: 'light' | 'primary'
  className?: string
}

export function ButtonIcon({ variant = 'light', className = 'button-icon' }: ButtonIconProps) {
  const stroke = variant === 'primary' ? '#2595D5' : '#ffffff'

  return (
    <svg
      className={className}
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.425 6L9.425 1M14.425 6L9.425 11M14.425 6H1.575"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PauseIcon({ className = 'video-button-image' }: { className?: string }) {
  return (
    <svg className={className} width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
      <path
        d="M3.25 1.4v11.2c0 .3-.12.58-.33.79-.21.2-.49.31-.78.31h-.38c-.29 0-.57-.11-.78-.31-.21-.21-.33-.49-.33-.79V1.4c0-.3.12-.58.33-.79.21-.2.49-.31.78-.31h.38c.29 0 .57.11.78.31.21.21.33.49.33.79ZM8.75.3h-.38c-.29 0-.57.11-.78.31-.21.21-.33.49-.33.79v11.2c0 .3.12.58.33.79.21.2.49.31.78.31h.38c.29 0 .57-.11.78-.31.21-.21.33-.49.33-.79V1.4c0-.3-.12-.58-.33-.79-.21-.2-.49-.31-.78-.31Z"
        fill="white"
      />
    </svg>
  )
}

export function PlayIcon({ className = 'video-button-image' }: { className?: string }) {
  return (
    <svg className={className} width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M11.5 5.63c.67.39.67 1.35 0 1.74L2.5 12.56C1.83 12.95 1 12.47 1 11.7V1.3C1 .53 1.83.05 2.5.44L11.5 5.63Z"
        fill="white"
      />
    </svg>
  )
}
