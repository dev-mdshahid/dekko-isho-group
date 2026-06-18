type Props = {
  title: string
  variant?: 'base' | 'bg-dark'
}

export function PreSectionTitle({ title, variant = 'base' }: Props) {
  const wrapClass =
    variant === 'bg-dark'
      ? 'pre-section-title-wrap w-variant-de5a90dc-c401-95a9-b09f-388955c5be35'
      : 'pre-section-title-wrap'

  const titleClass =
    variant === 'bg-dark'
      ? 'pre-section-title w-variant-de5a90dc-c401-95a9-b09f-388955c5be35'
      : 'pre-section-title'

  return (
    <div data-wf--pre-section-title--variant={variant} className={wrapClass}>
      <div className="pre-section-title-inner">
        <div className="pre-section-title-square" />
        <div className={titleClass}>{title}</div>
      </div>
    </div>
  )
}
