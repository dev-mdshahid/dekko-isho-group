import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

type Props = PropsWithChildren<{
  to: string
  className?: string
}>

export function PrimaryButton({ to, className, children }: Props) {
  return (
    <Link to={to} className={className ?? 'primary-button w-inline-block'}>
      {children}
    </Link>
  )
}
