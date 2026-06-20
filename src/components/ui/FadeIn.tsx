import type { CSSProperties, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  id?: string
  className?: string
  style?: CSSProperties
}>

/** Wrapper for scroll-reveal animations via `useInViewAnimation`. */
export function FadeIn({ id, className, style, children }: Props) {
  return (
    <div data-w-id={id} data-fade-in className={className} style={style}>
      {children}
    </div>
  )
}
