import type { CSSProperties, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  id?: string
  className?: string
  style?: CSSProperties
}>

/** Wrapper that marks elements for scroll-reveal via `useInViewAnimation`. */
export function FadeIn({ id, className, style, children }: Props) {
  return (
    <div data-w-id={id} className={className} style={style}>
      {children}
    </div>
  )
}
