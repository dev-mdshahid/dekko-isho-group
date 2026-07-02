type Props = {
  color: string
  number: string
  orientation?: 'up' | 'down'
}

export function RoadmapPointer({ color, number, orientation = 'down' }: Props) {
  const isUp = orientation === 'up'

  return (
    <svg
      width="125"
      height="225"
      viewBox="0 0 125 225"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="about-roadmap-pointer"
      aria-hidden="true"
    >
      <g transform={isUp ? 'translate(0 225) scale(1 -1)' : undefined}>
        <circle cx="62.0596" cy="62.0313" r="62.0596" fill={color} />
        <circle cx="62.5408" cy="62.511" r="46.1839" fill="#D8DCDF" />
        <circle cx="62.5398" cy="62.5119" r="34.6379" fill={color} />
        <path d="M62 224.972L79 120.972H45L62 224.972Z" fill={color} />
      </g>
      <text
        x="62"
        y={isUp ? 171 : 70}
        fill="#FCFCFC"
        fontFamily="var(--_typography---font-family--body)"
        fontSize="28"
        fontWeight="600"
        textAnchor="middle"
      >
        {number}
      </text>
    </svg>
  )
}
