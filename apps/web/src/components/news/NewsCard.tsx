import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import type { LatestNewsItem } from '../../data/home/latestNews'
import { FadeIn } from '../ui/FadeIn'
import { ButtonIcon } from '../ui/ButtonIcon'
import { newsDateToIso } from './newsDate'

const cardLinkStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  color: 'inherit',
  textDecoration: 'none',
}

function NewsCardAction() {
  return (
    <span className="latest-news-card-action" aria-hidden="true">
      <span className="button-icon-bg latest-news-card-action__icon">
        <ButtonIcon className="button-icon" />
        <ButtonIcon className="button-icon-hover" />
      </span>
    </span>
  )
}

export function NewsCard({ item, index }: { item: LatestNewsItem; index: number }) {
  const label = `Read: ${item.title}`
  const isExternal = item.href.startsWith('http')

  const content = (
    <>
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
          <NewsCardAction />
        </div>
      </div>
    </>
  )

  return (
    <FadeIn
      as="article"
      id={`latest-news-card-${item.id}`}
      delay={index * 80}
      className="latest-news-card"
    >
      {isExternal ? (
        <a
          href={item.href}
          aria-label={label}
          target="_blank"
          rel="noreferrer"
          style={cardLinkStyle}
        >
          {content}
        </a>
      ) : (
        <Link to={item.href} aria-label={label} style={cardLinkStyle}>
          {content}
        </Link>
      )}
    </FadeIn>
  )
}
