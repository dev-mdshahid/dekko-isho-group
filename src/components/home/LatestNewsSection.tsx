import { latestNewsItems } from '../../data/home/latestNews'
import { ButtonArrow } from '../ui/ButtonArrow'
import { FadeIn } from '../ui/FadeIn'
import { NewsCard } from '../news/NewsCard'

export function LatestNewsSection() {
  return (
    <section className="latest-news-section" aria-labelledby="latest-news-heading">
      <div className="latest-news-container">
        <div className="latest-news-header">
          <FadeIn id="latest-news-header-text" className="latest-news-header-text">
            <h2 id="latest-news-heading" className="latest-news-title">
              Explore the latest updates
            </h2>
            {/* <p className="latest-news-subtitle">
              Explore the latest announcements, investments, partnerships and media coverage from
              Dekko ISHO Group.
            </p> */}
          </FadeIn>
          <FadeIn id="latest-news-header-button" delay={80} className="latest-news-header-button">
            <ButtonArrow to="/news" label="All News" />
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
