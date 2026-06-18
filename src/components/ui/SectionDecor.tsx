type Props = {
  border?: 'grey' | 'dark' | 'none'
}

export function SectionLines({ border = 'grey' }: Props) {
  const lineClass =
    border === 'grey' ? 'section-line border-grey-1' : border === 'dark' ? 'section-line' : 'section-line'

  return (
    <div className={`line-wrapper${border === 'dark' ? ' bg-dark-line' : ''}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={lineClass} />
      ))}
    </div>
  )
}

export function NoiseOverlay() {
  return <div className="noise-overlay" />
}
