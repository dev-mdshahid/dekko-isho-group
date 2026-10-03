import type { MouseEvent } from 'react'

type CarouselArrowProps = {
  direction: 'previous' | 'next'
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  label?: string
  className?: string
  disabled?: boolean
  /** `light` adds a tinted fill so the white chevron stays visible on light backgrounds. */
  surface?: 'media' | 'light'
}

export function CarouselArrow({
  direction,
  onClick,
  label,
  className,
  disabled,
  surface = 'media',
}: CarouselArrowProps) {
  const classes = [
    'carousel-arrow',
    `carousel-arrow--${direction}`,
    surface === 'light' ? 'carousel-arrow--on-light' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      aria-label={label ?? (direction === 'previous' ? 'Previous slide' : 'Next slide')}
      onClick={(event) => {
        onClick(event)
        if (event.detail > 0) event.currentTarget.blur()
      }}
    >
      <svg
        className="carousel-arrow__icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d={direction === 'previous' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'}
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
