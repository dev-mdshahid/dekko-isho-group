import { Link } from 'react-router-dom'

import {
  getBottomRowPosts,
  getFeaturedPressPost,
  getTopRowPosts,
  type PressPost,
} from '../../data/press/pressPosts'
import { FadeIn } from '../ui/FadeIn'

type PressCardProps = {
  post: PressPost
  featured?: boolean
  fadeId: string
  linkId?: string
  imageId?: string
}

function PressCard({ post, featured = false, fadeId, linkId, imageId }: PressCardProps) {
  return (
    <div role="listitem" className={featured ? 'blog-collection-item' : 'blog-list-item-one'}>
      <FadeIn id={fadeId}>
        <Link
          data-w-id={linkId}
          to={`/press/${post.slug}`}
          className="blog-link-one w-inline-block"
        >
          <div className="blog-image-wrap-one">
            <img
              src={post.image}
              loading="lazy"
              data-w-id={imageId}
              alt={post.imageAlt}
              className="blog-image-01"
            />
            {featured ? <div className="featured-blog">Featured</div> : null}
          </div>
          <div className="blog-info-item">
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

export function PressListSection() {
  const featuredPost = getFeaturedPressPost()
  const topRowPosts = getTopRowPosts()
  const bottomRowPosts = getBottomRowPosts()
  const bottomRowClass =
    bottomRowPosts.length < 3 ? 'blog-list-one _01 _two-col' : 'blog-list-one _01'

  return (
    <section className="blog-inner-section section-spacing">
      <div className="container">
        <div className="blog-list-wrap">
          <div className="w-layout-grid grid-blog-list">
            <div role="list" className="featured-collection">
              <PressCard
                post={featuredPost}
                featured
                fadeId="83db2675-5c1d-3550-539e-eed1631b3dfc"
                linkId="753b7474-533c-c7c8-b7e7-3e8083219ffc"
                imageId="f09ee6c2-d2dd-1fb3-a447-484b5dcd83d9"
              />
            </div>
            <div role="list" className="blog-list-one">
              {topRowPosts.map((post, index) => (
                <PressCard
                  key={post.slug}
                  post={post}
                  fadeId={
                    index === 0
                      ? '65d92239-da8a-894b-6a04-a0d9e5ded870'
                      : `press-top-${post.slug}`
                  }
                  linkId={
                    index === 0 ? '512ff9e4-c2ad-d651-42b4-897ccfc8b256' : undefined
                  }
                  imageId={
                    index === 0 ? '86741fcb-fbc7-8642-0106-ddf1358c1258' : undefined
                  }
                />
              ))}
            </div>
          </div>
          <div role="list" className={bottomRowClass}>
            {bottomRowPosts.map((post, index) => (
              <PressCard
                key={post.slug}
                post={post}
                fadeId={
                  index === 0
                    ? '3818a41c-1359-47ba-156a-29719e7af54f'
                    : `press-grid-${post.slug}`
                }
                linkId={
                  index === 0 ? '3818a41c-1359-47ba-156a-29719e7af550' : undefined
                }
                imageId={
                  index === 0 ? '3818a41c-1359-47ba-156a-29719e7af552' : undefined
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
