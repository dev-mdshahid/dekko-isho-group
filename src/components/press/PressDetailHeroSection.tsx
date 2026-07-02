import type { PressPost } from '../../data/press/pressPosts'
import { FadeIn } from '../ui/FadeIn'

type Props = {
  post: PressPost
}

export function PressDetailHeroSection({ post }: Props) {
  return (
    <div className="hero-inner-section">
      <div className="container-medium w-container">
        <FadeIn id="57ad97ff-6e17-bb27-fb1a-35879195ab14" className="hero-inner-wrap">
          <div className="blog-category-wrap">
            <div className="blog-hero-date">{post.date}</div>
            <div className="blog-category bg-change">{post.category}</div>
          </div>
          <h1 className="hero-inner-title">{post.title}</h1>
          <p className="hero-inner-description">{post.excerpt}</p>
          <img
            src={post.image}
            loading="eager"
            alt={post.imageAlt}
            className="hero-inner-image"
          />
        </FadeIn>
      </div>
    </div>
  )
}
