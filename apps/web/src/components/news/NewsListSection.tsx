import { useEffect, useMemo, useRef, useState } from 'react'

import { latestNewsItems } from '../../data/home/latestNews'
import { revealFadeIns } from '../../lib/fadeInReveal'
import { FadeIn } from '../ui/FadeIn'
import { NewsCard } from './NewsCard'
import { newsDateToYear } from './newsDate'

export function NewsListSection() {
  const [selectedYear, setSelectedYear] = useState('all')
  const years = useMemo(
    () =>
      Array.from(
        new Set(
          latestNewsItems
            .map((item) => newsDateToYear(item.date))
            .filter((year): year is number => year !== undefined),
        ),
      ).sort((a, b) => b - a),
    [],
  )
  const filteredItems =
    selectedYear === 'all'
      ? latestNewsItems
      : latestNewsItems.filter((item) => newsDateToYear(item.date)?.toString() === selectedYear)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (gridRef.current) {
        revealFadeIns(gridRef.current, { forceInRoot: true })
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [selectedYear])

  return (
    <section className="news-page-section section-spacing" aria-labelledby="news-list-heading">
      <div className="container news-page-container">
        <div className="news-page-header">
          <FadeIn id="news-list-heading-wrap">
            <h2 id="news-list-heading" className="news-page-title">
              Latest news and updates
            </h2>
          </FadeIn>
          <div className="news-page-filter">
            <label htmlFor="news-year-filter">Filter by year</label>
            <select
              id="news-year-filter"
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredItems.length > 0 ? (
          <div ref={gridRef} className="latest-news-grid" role="list">
            {filteredItems.map((item, index) => (
              <NewsCard key={item.id} item={item} index={index} />
            ))}
          </div>
        ) : (
          <p className="news-page-empty" role="status">
            No news found for the selected year.
          </p>
        )}
      </div>
    </section>
  )
}
