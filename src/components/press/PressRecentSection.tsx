import { Link } from 'react-router-dom'

import { getRecentPressPosts, type PressPost } from '../../data/press/pressPosts'
import { FadeIn } from '../ui/FadeIn'
import { PreSectionTitle } from '../ui/PreSectionTitle'

type Props = {
  currentSlug: string
}

function RecentPressCard({ post, fadeId }: { post: PressPost; fadeId: string }) {
  return (
    <div role="listitem" className="blog-list-item-one">
      <FadeIn id={fadeId}>
        <Link to={`/press/${post.slug}`} className="blog-link-one w-inline-block">
          <div className="blog-image-wrap-one">
            <img src={post.image} loading="lazy" alt={post.imageAlt} className="blog-image-01" />
          </div>
          <div className="blog-info-item two">
            <div className="blog-inner-info">
              <div className="blog-category">{post.category}</div>
              <div className="blog-update-date">{post.date}</div>
            </div>
            <h2 className="blog-titles">{post.title}</h2>
          </div>
        </Link>
      </FadeIn>
    </div>
  )
}

export function PressRecentSection({ currentSlug }: Props) {
  const recentPosts = getRecentPressPosts(currentSlug, 3)

  return (
    <section className="resent-blog-section section-spacing-bottom">
      <div className="container-full">
        <div className="resent-blog-main">
          <FadeIn id="38c0f327-dd16-5341-9be8-15e3a9179d25" className="section-title-center">
            <PreSectionTitle title="Insights & Article" />
            <h2 className="section-title title-center">Recent press</h2>
          </FadeIn>
          <div role="list" className="blog-list-one _01">
            {recentPosts.map((post, index) => (
              <RecentPressCard
                key={post.slug}
                post={post}
                fadeId={
                  index === 0
                    ? '58bd62fe-80db-d9e6-6b94-34f2845c2cc8'
                    : `press-recent-${post.slug}`
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
