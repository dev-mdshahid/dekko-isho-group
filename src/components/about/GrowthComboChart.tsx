import { useId, useRef } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from 'recharts'

import { useGrowthChartReveal } from '../../hooks/useGrowthChartReveal'

type GrowthDatum = {
  year: string
  qtyGrowth: number
  valueGrowth: number
}

const chartData: GrowthDatum[] = [
  { year: '2019', qtyGrowth: 0.05, valueGrowth: 0.32 },
  { year: '2020', qtyGrowth: 0.1, valueGrowth: 0.71 },
  { year: '2021', qtyGrowth: 0.28, valueGrowth: 2.25 },
  { year: '2022', qtyGrowth: 1.93, valueGrowth: 15.32 },
  { year: '2023', qtyGrowth: 2.51, valueGrowth: 18.79 },
  { year: '2024', qtyGrowth: 3.22, valueGrowth: 19.14 },
  { year: '2025', qtyGrowth: 3.25, valueGrowth: 23.95 },
  { year: '2026', qtyGrowth: 2.83, valueGrowth: 21.48 },
]

const qtyAxisMax = Math.ceil(Math.max(...chartData.map(({ qtyGrowth }) => qtyGrowth)))
const valueAxisMax =
  Math.ceil(Math.max(...chartData.map(({ valueGrowth }) => valueGrowth)) / 5) * 5
const qtyTicks = Array.from({ length: qtyAxisMax + 1 }, (_, index) => index)
const valueTicks = Array.from({ length: valueAxisMax / 5 + 1 }, (_, index) => index * 5)
const growthSummary = chartData
  .map(
    ({ year, qtyGrowth, valueGrowth }) =>
      `${year}: Qty Growth ${qtyGrowth} PCS and Value Growth ${valueGrowth} USD`,
  )
  .join('; ')
const minValueDatum = chartData.reduce((minimum, datum) =>
  datum.valueGrowth < minimum.valueGrowth ? datum : minimum,
)
const maxValueDatum = chartData.reduce((maximum, datum) =>
  datum.valueGrowth > maximum.valueGrowth ? datum : maximum,
)

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}

function GrowthTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload.length) return null

  const qtyValue = payload.find(({ dataKey }) => dataKey === 'qtyGrowth')?.value
  const valueValue = payload.find(({ dataKey }) => dataKey === 'valueGrowth')?.value

  if (typeof qtyValue !== 'number' || typeof valueValue !== 'number') return null

  return (
    <div className="about-growth-tooltip">
      <p className="about-growth-tooltip-year">Year: {label}</p>
      <p>Qty Growth (units): {formatNumber(qtyValue)}</p>
      <p>Value Growth (USD): {formatNumber(valueValue)}</p>
    </div>
  )
}

type GrowthCalloutProps = {
  cx?: number
  cy?: number
  value: number
  tone: 'start' | 'end'
}

function GrowthCallout({ cx, cy, value, tone }: GrowthCalloutProps) {
  if (typeof cx !== 'number' || typeof cy !== 'number') return null

  const label = `$${formatNumber(value)}`
  const width = Math.max(52, label.length * 7 + 20)
  const pillY = cy - 42

  return (
    <g className={`about-growth-chart-callout about-growth-chart-callout--${tone}`}>
      <line x1={cx} y1={cy - 5} x2={cx} y2={pillY + 24} className="about-growth-chart-callout-line" />
      <rect x={cx - width / 2} y={pillY} width={width} height={24} rx={12} />
      <text x={cx} y={pillY + 16} textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

export function GrowthComboChart() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const gradientId = useId().replace(/:/g, '')
  const qtyStrokeId = `${gradientId}-qty-stroke`
  const valueStrokeId = `${gradientId}-value-stroke`
  const valueAreaId = `${gradientId}-value-area`
  const { isRevealed, reduceMotion } = useGrowthChartReveal(viewportRef)
  const animateSeries = isRevealed && !reduceMotion

  return (
    <>
      <p className="about-turnover-sr-summary">
        Annual growth by year. {growthSummary}.
      </p>

      <div
        ref={viewportRef}
        className={`about-growth-chart-viewport${isRevealed ? ' is-revealed' : ''}`}
        role="img"
        aria-label={`Annual growth chart. ${growthSummary}.`}
      >
        <div className="about-growth-chart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 54, right: 16, bottom: 18, left: 8 }}
            >
              <defs>
                <linearGradient id={qtyStrokeId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color--primary)" />
                  <stop offset="100%" stopColor="var(--color--primary-gradient-end)" />
                </linearGradient>
                <linearGradient id={valueStrokeId} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color--secondary-amaranth)" />
                  <stop offset="100%" stopColor="var(--color--secondary-purple)" />
                </linearGradient>
                <linearGradient id={valueAreaId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color--secondary-amaranth)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color--secondary-purple)" stopOpacity={0} />
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
                yAxisId="qty"
                width={42}
                axisLine={false}
                tickLine={false}
                domain={[0, qtyAxisMax]}
                ticks={qtyTicks}
                tick={{ fill: '#616771', fontSize: 13, fontWeight: 500 }}
              />
              <YAxis
                yAxisId="value"
                orientation="right"
                width={42}
                axisLine={false}
                tickLine={false}
                domain={[0, valueAxisMax]}
                ticks={valueTicks}
                tick={{ fill: '#616771', fontSize: 13, fontWeight: 500 }}
              />
              <Tooltip
                content={GrowthTooltip}
                cursor={{ fill: 'rgb(37 149 213 / 6%)' }}
                animationDuration={180}
              />
              <Area
                yAxisId="value"
                type="monotone"
                dataKey="valueGrowth"
                stroke="none"
                fill={`url(#${valueAreaId})`}
                isAnimationActive={animateSeries}
                animationBegin={260}
                animationDuration={1250}
                animationEasing="ease-out"
                legendType="none"
                tooltipType="none"
              />
              <Line
                yAxisId="qty"
                dataKey="qtyGrowth"
                name="Qty Growth (PCS)"
                type="monotone"
                stroke={`url(#${qtyStrokeId})`}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={false}
                activeDot={{ r: 5, fill: 'var(--color--primary)', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={animateSeries}
                animationBegin={100}
                animationDuration={1250}
                animationEasing="ease-out"
              />
              <Line
                yAxisId="value"
                type="monotone"
                dataKey="valueGrowth"
                name="Value Growth (USD)"
                stroke={`url(#${valueStrokeId})`}
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={false}
                activeDot={{ r: 6, fill: 'var(--color--secondary-amaranth)', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={animateSeries}
                animationBegin={240}
                animationDuration={1350}
                animationEasing="ease-out"
              />
              <ReferenceDot
                yAxisId="value"
                x={minValueDatum.year}
                y={minValueDatum.valueGrowth}
                r={4.5}
                fill="var(--color--secondary-amaranth)"
                stroke="var(--color--white)"
                strokeWidth={2}
                shape={<GrowthCallout value={minValueDatum.valueGrowth} tone="start" />}
                ifOverflow="extendDomain"
              />
              <ReferenceDot
                yAxisId="value"
                x={maxValueDatum.year}
                y={maxValueDatum.valueGrowth}
                r={4.5}
                fill="var(--color--secondary-purple)"
                stroke="var(--color--white)"
                strokeWidth={2}
                shape={<GrowthCallout value={maxValueDatum.valueGrowth} tone="end" />}
                ifOverflow="extendDomain"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <span className="about-growth-chart-reveal" aria-hidden="true" />
      </div>
    </>
  )
}
