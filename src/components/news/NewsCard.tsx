import { Link } from 'react-router-dom'

import type { LatestNewsItem } from '../../data/home/latestNews'
import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'
import { newsDateToIso } from './newsDate'

function NewsCardAction({ href, label }: { href: string; label: string }) {
  const inner = (
    <span className="button-icon-bg latest-news-card-action__icon" aria-hidden="true">
      <img
        src={legacyImage('button-icon.svg')}
        loading="lazy"
        alt=""
        className="button-icon"
      />
      <img
        src={legacyImage('button-icon.svg')}
        loading="lazy"
        alt=""
        className="button-icon-hover"
      />
    </span>
  )

  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        className="latest-news-card-action"
        aria-label={label}
        target="_blank"
        rel="noreferrer"
      >
        {inner}
      </a>
    )
  }

  return (
    <Link to={href} className="latest-news-card-action" aria-label={label}>
      {inner}
    </Link>
  )
}

export function NewsCard({ item, index }: { item: LatestNewsItem; index: number }) {
  return (
    <FadeIn
      as="article"
      id={`latest-news-card-${item.id}`}
      delay={index * 80}
      className="latest-news-card"
    >
      <div className="latest-news-card-portal">
        <img
          src={item.portalLogo}
          loading="lazy"
          alt={item.portalLogoAlt}
          className="latest-news-card-portal-logo"
        />
        <span className="latest-news-card-portal-name">{item.portalName}</span>
      </div>

      <div className="latest-news-card-image-wrap">
        <img
          src={item.image}
          loading="lazy"
          alt={item.imageAlt}
          className="latest-news-card-image"
        />
      </div>

      <div className="latest-news-card-body">
        <h3 className="latest-news-card-title">{item.title}</h3>
        <p className="latest-news-card-description">{item.description}</p>
        <div className="latest-news-card-footer">
          <time className="latest-news-card-date" dateTime={newsDateToIso(item.date)}>
            {item.date}
          </time>
          <NewsCardAction href={item.href} label={`Read: ${item.title}`} />
        </div>
      </div>
    </FadeIn>
  )
}
