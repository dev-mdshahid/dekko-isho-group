type Props = {
  file: string
}

export function LegacyPageFrame({ file }: Props) {
  return (
    <iframe
      title={file}
      src={`/legacy/${file}`}
      style={{ width: '100%', minHeight: '100vh', border: 0, display: 'block' }}
    />
  )
}
