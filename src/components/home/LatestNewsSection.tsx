import { Link } from 'react-router-dom'

import { latestNewsItems } from '../../data/home/latestNews'
import { legacyImage } from '../../lib/assets'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'

function NewsCardAction({ href, label }: { href: string; label: string }) {
  const icon = (
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
        {icon}
      </a>
    )
  }

  return (
    <Link to={href} className="latest-news-card-action" aria-label={label}>
      {icon}
    </Link>
  )
}

function NewsCard({
  item,
  index,
}: {
  item: (typeof latestNewsItems)[number]
  index: number
}) {
  return (
    <FadeIn
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
          <time className="latest-news-card-date" dateTime={item.date}>
            {item.date}
          </time>
          <NewsCardAction href={item.href} label={`Read: ${item.title}`} />
        </div>
      </div>
    </FadeIn>
  )
}

export function LatestNewsSection() {
  return (
    <section className="latest-news-section" aria-labelledby="latest-news-heading">
      <div className="latest-news-container">
        <div className="latest-news-header">
          <FadeIn id="latest-news-header-text" className="latest-news-header-text">
            <h2 id="latest-news-heading" className="latest-news-title">
              Latest News
            </h2>
            <p className="latest-news-subtitle">
              Explore the latest announcements, investments, partnerships and media coverage from
              Dekko ISHO Group.
            </p>
          </FadeIn>
          <FadeIn id="latest-news-header-button" delay={80} className="latest-news-header-button">
            <ButtonArrow to="/press" label="All News" />
          </FadeIn>
        </div>

        <div className="latest-news-grid">
          {latestNewsItems.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
