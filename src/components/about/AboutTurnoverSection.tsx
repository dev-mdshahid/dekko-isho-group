import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { annualTurnoverData } from '../../data/about/turnover'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'

const turnoverTicks = [0, 50, 100, 150, 200, 250, 300]
const turnoverSummary = annualTurnoverData
  .map((item) => `${item.year}: $${item.value} million`)
  .join(', ')

function formatCurrencyLabel(value: unknown) {
  const numericValue = Number(value)

  return Number.isFinite(numericValue) ? `$${numericValue}` : ''
}

export function AboutTurnoverSection() {
  return (
    <section
      className="about-turnover-section--about"
      aria-labelledby="about-turnover-title"
    >
      <div className="about-turnover-main section-spacing">
        <div className="container">
          <FadeIn className="about-turnover-chart-wrap">
            <div className="about-turnover-heading">
              <span className="about-turnover-heading-line" aria-hidden="true" />
              <h2 id="about-turnover-title" className="about-turnover-title">
                Annual Turnover
              </h2>
              <span className="about-turnover-heading-line" aria-hidden="true" />
            </div>

            <p className="about-turnover-sr-summary">
              Annual turnover in millions: {turnoverSummary}.
            </p>

            <div
              className="about-turnover-chart"
              role="img"
              aria-label={`Annual turnover in millions. ${turnoverSummary}.`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={annualTurnoverData}
                  margin={{ top: 26, right: 18, bottom: 24, left: 10 }}
                  barCategoryGap="34%"
                >
                  <CartesianGrid vertical={false} stroke="#dfe4ea" strokeDasharray="0" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#616771', fontSize: 14, fontWeight: 500 }}
                    dy={10}
                    interval={0}
                  />
                  <YAxis
                    width={52}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 300]}
                    ticks={turnoverTicks}
                    tickFormatter={formatCurrencyLabel}
                    tick={{ fill: '#616771', fontSize: 14, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgb(27 63 111 / 6%)' }}
                    formatter={(value) => [formatCurrencyLabel(Number(value)), 'Turnover']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar
                    dataKey="value"
                    fill="#184a98"
                    maxBarSize={28}
                    radius={[0, 0, 0, 0]}
                    isAnimationActive
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      formatter={formatCurrencyLabel}
                      className="about-turnover-bar-label"
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <p className="about-turnover-caption">Total Business Turnover in Millions (M)</p>
          </FadeIn>
        </div>
      </div>
      <SectionLines />
      <NoiseOverlay />
    </section>
  )
}
