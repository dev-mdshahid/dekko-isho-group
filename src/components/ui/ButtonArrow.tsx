import type { AnchorHTMLAttributes, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { legacyImage } from '../../lib/assets'

type Variant = 'base' | 'button-primary-bg' | 'button-white-bg'

const variantClass: Record<Variant, string> = {
  base: 'primary-button w-inline-block',
  'button-primary-bg': 'primary-button w-variant-5ae0b7d1-2e18-9989-4375-c73c98041680 w-inline-block',
  'button-white-bg': 'primary-button w-variant-e5ebfb29-ba2d-88c3-9b4e-1bbc038e3a15 w-inline-block',
}

type Props = PropsWithChildren<{
  to: string
  label: string
  variant?: Variant
  className?: string
}>

export function ButtonArrow({ to, label, variant = 'base', className }: Props) {
  const classes = className ?? variantClass[variant]
  const iconBgClass =
    variant === 'button-primary-bg' ? 'button-icon-bg w-variant-5ae0b7d1-2e18-9989-4375-c73c98041680' : 'button-icon-bg'

  const inner = (
    <div className="button-primary-inner">
      <div className="button-text-wrap">
        <div className="button-text-inner">
          <div className="button-text">{label}</div>
          <div className="button-hover-text">{label}</div>
        </div>
      </div>
      <div className={iconBgClass}>
        <img src={legacyImage('button-icon.svg')} loading="eager" alt="Arrow" className="button-icon" />
        <img src={legacyImage('button-icon.svg')} loading="lazy" alt="Arrow" className="button-icon-hover" />
      </div>
    </div>
  )

  if (to.startsWith('http') || to.startsWith('/legacy/')) {
    const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
      href: to,
      className: classes,
      ...(to.startsWith('/legacy/') ? { target: '_blank', rel: 'noreferrer' } : {}),
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
