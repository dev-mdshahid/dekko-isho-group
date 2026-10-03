import type { PressPost } from '../../data/press/pressPosts'

type Props = {
  post: PressPost
}

export function PressDetailContentSection({ post }: Props) {
  return (
    <section className="blog-simple-section">
      <div className="w-layout-blockcontainer container-medium w-container">
        <div
          className="blog-rich-text w-richtext"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </section>
  )
}
