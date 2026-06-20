import type { CSSProperties, PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  id?: string
  className?: string
  style?: CSSProperties
  /** Milliseconds — matches legacy Webflow slideInBottom stagger. */
  delay?: number
  /** Webflow IX2 preset replicated in React. */
  variant?: 'default' | 'slide-in-bottom'
}>

/** Wrapper for scroll-reveal animations via `useInViewAnimation` / `useFooterAnimations`. */
export function FadeIn({ id, className, style, delay, variant = 'default', children }: Props) {
  return (
    <div
      data-w-id={id}
      data-fade-in
      data-fade-delay={delay}
      data-fade-variant={variant === 'slide-in-bottom' ? variant : undefined}
      className={className}
      style={style}
    >
      {children}
    </div>
  )
}
