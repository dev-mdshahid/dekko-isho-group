import type { CSSProperties } from 'react'

type BoneProps = {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  block?: boolean
}

/** A text-sized placeholder. Inline bones take the line height of their parent, so wrap them in the real text class. */
export function Bone({ width = '100%', height, radius, block = false }: BoneProps) {
  return (
    <span
      aria-hidden="true"
      className={`careers-skeleton${block ? ' careers-skeleton--block' : ''}`}
      style={{ width, height, borderRadius: radius }}
    />
  )
}

export function BoneLines({ widths, className = '' }: { widths: CSSProperties['width'][]; className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      {widths.map((width, i) => (
        <span key={i} className="careers-skeleton-line">
          <Bone width={width} />
        </span>
      ))}
    </div>
  )
}
