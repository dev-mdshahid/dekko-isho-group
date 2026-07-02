import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

/** @deprecated Use ButtonArrow instead */
export function PrimaryButton({
  to,
  className,
  children,
}: PropsWithChildren<{ to: string; className?: string }>) {
  return (
    <Link to={to} className={className ?? 'primary-button w-inline-block'}>
      {children}
    </Link>
  )
}

export { ButtonArrow } from './ButtonArrow'
