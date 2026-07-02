import { useRef } from 'react'

import {
  PressDetailContentSection,
  PressDetailHeroSection,
  PressRecentSection,
} from '../components/press'
import { getPressPostBySlug } from '../data/press/pressPosts'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import { useWebflowInit } from '../hooks/useWebflowInit'

type Props = {
  slug: string
}

export function PressDetailContent({ slug }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const post = getPressPostBySlug(slug)

  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)
  useWebflowInit(ref)

  if (!post) return null

  return (
    <div ref={ref}>
      <PressDetailHeroSection post={post} />
      <PressDetailContentSection post={post} />
      <PressRecentSection currentSlug={post.slug} />
    </div>
  )
}
