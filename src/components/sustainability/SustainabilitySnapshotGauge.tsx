import { useId } from 'react'

type Props = {
  percentage: number
}

const VIEW_W = 324
const VIEW_H = 232
const CX = VIEW_W / 2
const CY = 162
const R = 118
const STROKE = 28
const LABEL_GAP = 18
const LABEL_R = R + STROKE / 2 + LABEL_GAP
const HANDLE_OVERHANG = 6
const HANDLE_RADIAL = STROKE + HANDLE_OVERHANG * 2
const HANDLE_TANGENT = 10

const COLOR_PROGRESS = '#58C28D'
const COLOR_TRACK = '#D9DDE1'
const COLOR_LABEL = '#8A94A6'

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = (degrees * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  }
}

function arcPath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, radius, startDeg)
  const end = polar(cx, cy, radius, endDeg)
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

function getScaleLabelProps(mark: number) {
  const angle = 180 + (mark / 100) * 180
  const point = polar(CX, CY, LABEL_R, angle)

  return {
    x: point.x,
    y: point.y,
    rotation: angle + 90,
  }
}

const SCALE_MARKS = [0, 25, 50, 75, 100]

export function SustainabilitySnapshotGauge({ percentage }: Props) {
  const clamped = Math.min(100, Math.max(0, percentage))
  const progressEnd = 180 + (clamped / 100) * 180
  const handlePoint = polar(CX, CY, R, progressEnd)
  const shadowFilterId = `sustain-gauge-shadow-${useId().replace(/:/g, '')}`

  return (
    <svg
      className="sustain-snapshot-gauge-svg"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      overflow="visible"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <filter id={shadowFilterId} x="-80%" y="-80%" width="260%" height="260%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.22" />
        </filter>
      </defs>

      <path
        d={arcPath(CX, CY, R, 180, 360)}
        fill="none"
        stroke={COLOR_TRACK}
        strokeWidth={STROKE}
        strokeLinecap="round"
      />

      {clamped > 0 && (
        <path
          d={arcPath(CX, CY, R, 180, clamped >= 100 ? 360 : progressEnd)}
          fill="none"
          stroke={COLOR_PROGRESS}
          strokeWidth={STROKE}
          strokeLinecap="butt"
        />
      )}

      {clamped > 0 && (
        <circle
          cx={polar(CX, CY, R, 180).x}
          cy={polar(CX, CY, R, 180).y}
          r={STROKE / 2}
          fill={COLOR_PROGRESS}
        />
      )}

      {SCALE_MARKS.map((mark) => {
        const label = getScaleLabelProps(mark)
        return (
          <text
            key={mark}
            className="sustain-snapshot-gauge-label"
            x={label.x}
            y={label.y}
            fill={COLOR_LABEL}
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${label.rotation}, ${label.x}, ${label.y})`}
          >
            {mark}%
          </text>
        )
      })}

      {clamped > 0 && (
        <rect
          x={handlePoint.x - HANDLE_RADIAL / 2}
          y={handlePoint.y - HANDLE_TANGENT / 2}
          width={HANDLE_RADIAL}
          height={HANDLE_TANGENT}
          rx={HANDLE_TANGENT / 2}
          fill={COLOR_PROGRESS}
          stroke="#ffffff"
          strokeWidth="2.5"
          filter={`url(#${shadowFilterId})`}
          transform={`rotate(${progressEnd}, ${handlePoint.x}, ${handlePoint.y})`}
        />
      )}
    </svg>
  )
}
