type Props = {
  title: string
  variant?: 'light' | 'dark'
}

export function SustainabilityBadge({ title, variant = 'light' }: Props) {
  return (
    <div className={`sustain-badge sustain-badge--${variant}`}>
      <div className="sustain-badge-inner">
        <div className="sustain-badge-square" aria-hidden="true" />
        <div className="sustain-badge-text">{title}</div>
      </div>
    </div>
  )
}
