import { useRef } from 'react'
import {
  Bar,
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
      <p>Qty Growth (PCS): {formatNumber(qtyValue)}</p>
      <p>Value Growth (USD): {formatNumber(valueValue)}</p>
    </div>
  )
}

export function GrowthComboChart() {
  const viewportRef = useRef<HTMLDivElement>(null)
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
              margin={{ top: 24, right: 10, bottom: 18, left: 4 }}
              barCategoryGap="40%"
            >
              <CartesianGrid horizontal={false} stroke="#dfe4ea" strokeOpacity={0.75} />
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
              <Bar
                yAxisId="qty"
                dataKey="qtyGrowth"
                name="Qty Growth (PCS)"
                fill="#2595d5"
                maxBarSize={34}
                radius={[3, 3, 0, 0]}
                isAnimationActive={animateSeries}
                animationBegin={100}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Line
                yAxisId="value"
                type="monotone"
                dataKey="valueGrowth"
                name="Value Growth (USD)"
                stroke="#f3215d"
                strokeWidth={3}
                dot={{ r: 4, fill: '#fff', stroke: '#f3215d', strokeWidth: 2.5 }}
                activeDot={{ r: 6, fill: '#f3215d', stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={animateSeries}
                animationBegin={160}
                animationDuration={1100}
                animationEasing="ease-out"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <span className="about-growth-chart-reveal" aria-hidden="true" />
      </div>
    </>
  )
}
