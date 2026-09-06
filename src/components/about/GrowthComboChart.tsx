import { useId, useRef } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'

import { useGrowthChartReveal } from '../../hooks/useGrowthChartReveal'

type TurnoverDatum = {
  year: string
  turnover: number
}

const chartData: TurnoverDatum[] = [
  { year: '2022', turnover: 225 },
  { year: '2023', turnover: 223 },
  { year: '2024', turnover: 268 },
  { year: '2025', turnover: 258 },
  { year: '2026', turnover: 273 },
]

const lineAnimationBegin = 100
const lineAnimationDuration = 1600
const pointAnimationInterval = lineAnimationDuration / (chartData.length - 1)
const turnoverTicks = [0, 50, 100, 150, 200, 250, 300]
const turnoverSummary = chartData
  .map(({ year, turnover }) => `${year}: $${turnover} million`)
  .join('; ')

function formatTurnover(value: number) {
  return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}M`
}

function TurnoverTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload.length) return null

  const turnover = payload.find(({ dataKey }) => dataKey === 'turnover')?.value
  if (typeof turnover !== 'number') return null

  return (
    <div className="about-growth-tooltip">
      <p className="about-growth-tooltip-year">Year: {label}</p>
      <p>Annual turnover: {formatTurnover(turnover)}</p>
    </div>
  )
}

type TurnoverDotProps = {
  cx?: number
  cy?: number
  index?: number
  payload?: TurnoverDatum
  isVisible: boolean
  reduceMotion: boolean
}

function TurnoverDot({
  cx,
  cy,
  index = 0,
  payload,
  isVisible,
  reduceMotion,
}: TurnoverDotProps) {
  if (
    typeof cx !== 'number' ||
    typeof cy !== 'number' ||
    typeof payload?.turnover !== 'number'
  ) {
    return null
  }

  const animationDelay = `${lineAnimationBegin + index * pointAnimationInterval}ms`
  const animationStyle = reduceMotion ? undefined : { animationDelay }

  return (
    <g className={`about-turnover-point${isVisible ? ' is-visible' : ''}`}>
      <text
        x={cx}
        y={cy - 17}
        textAnchor="middle"
        className="about-turnover-value-label"
        style={animationStyle}
      >
        {formatTurnover(payload.turnover)}
      </text>
      <circle
        cx={cx}
        cy={cy}
        r={5.5}
        className="about-turnover-dot"
        style={animationStyle}
      />
    </g>
  )
}

export function GrowthComboChart() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const gradientId = useId().replace(/:/g, '')
  const strokeId = `${gradientId}-turnover-stroke`
  const areaId = `${gradientId}-turnover-area`
  const { isRevealed, reduceMotion } = useGrowthChartReveal(viewportRef)
  const animateSeries = isRevealed && !reduceMotion

  return (
    <>
      <p className="about-turnover-sr-summary">
        Annual turnover by year in millions of US dollars. {turnoverSummary}.
      </p>

      <div
        ref={viewportRef}
        className={`about-growth-chart-viewport${isRevealed ? ' is-revealed' : ''}`}
        role="img"
        aria-label={`Annual turnover chart in millions of US dollars. ${turnoverSummary}.`}
      >
        <div className="about-growth-chart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 52, right: 36, bottom: 18, left: 36 }}
            >
              <defs>
                <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color--secondary-amaranth)" />
                  <stop offset="100%" stopColor="var(--color--secondary-purple)" />
                </linearGradient>
                <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color--secondary-amaranth)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color--secondary-purple)" stopOpacity={0.015} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#dfe4ea" strokeOpacity={0.68} />
              <XAxis
                dataKey="year"
                axisLine={{ stroke: '#cfd5dc' }}
                tickLine={false}
                tick={{ fill: '#616771', fontSize: 13, fontWeight: 500 }}
                dy={10}
                interval={0}
              />
              <YAxis
                hide
                width={0}
                domain={[0, 300]}
                ticks={turnoverTicks}
              />
              <Tooltip
                content={TurnoverTooltip}
                cursor={{ stroke: 'rgb(37 149 213 / 24%)', strokeDasharray: '4 4' }}
                animationDuration={180}
              />
              <Area
                type="monotone"
                dataKey="turnover"
                stroke="none"
                fill={`url(#${areaId})`}
                isAnimationActive={animateSeries}
                animationBegin={lineAnimationBegin}
                animationDuration={lineAnimationDuration}
                animationEasing="linear"
                legendType="none"
                tooltipType="none"
              />
              <Line
                type="monotone"
                dataKey="turnover"
                name="Annual turnover"
                stroke={`url(#${strokeId})`}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={(props) => (
                  <TurnoverDot
                    {...props}
                    isVisible={isRevealed}
                    reduceMotion={reduceMotion}
                  />
                )}
                activeDot={{
                  r: 7,
                  className: 'about-turnover-active-dot',
                  strokeWidth: 3,
                }}
                isAnimationActive={animateSeries}
                animationBegin={lineAnimationBegin}
                animationDuration={lineAnimationDuration}
                animationEasing="linear"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
