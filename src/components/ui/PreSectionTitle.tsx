type Props = {
  title: string
}

export function PreSectionTitle({ title }: Props) {
  return (
    <div className="pre-section-title-wrap">
      <div className="pre-section-title-inner">
        <div className="pre-section-title-square"></div>
        <div className="pre-section-title">{title}</div>
      </div>
    </div>
  )
}
