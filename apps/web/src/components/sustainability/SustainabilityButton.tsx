import type { AnchorHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  to: string
  label: string
  variant?: 'dark' | 'light'
  className?: string
}

export function SustainabilityButton({ to, label, variant = 'dark', className }: Props) {
  const classes = ['sustain-button', `sustain-button--${variant}`, className].filter(Boolean).join(' ')

  const inner = (
    <>
      <span className="sustain-button-text">{label}</span>
      <span className="sustain-button-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 8H13M13 8L9 4M13 8L9 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  )

  if (to.startsWith('http') || to.startsWith('mailto:')) {
    const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
      href: to,
      className: classes,
    }
    return <a {...anchorProps}>{inner}</a>
  }

  if (to.startsWith('#')) {
    return (
      <a href={to} className={classes}>
        {inner}
      </a>
    )
  }

  return (
    <Link to={to} className={classes}>
      {inner}
    </Link>
  )
}
