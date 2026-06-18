import { useRef } from 'react'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'
import {
  AboutSection,
  BlogSection,
  CaseStudySection,
  HeroSection,
  HeroVideo,
  IndustrySection,
  ProductSection,
  ServiceSection,
  TestimonialSection,
  WhyChooseSection,
} from '../components/home'

export function HomeContent() {
  const ref = useRef<HTMLDivElement>(null)
  useLegacyLinkInterceptor(ref)
  useInViewAnimation(ref)

  return (
    <div ref={ref}>
      <HeroSection />
      <HeroVideo />
      <AboutSection />
      <ServiceSection />
      <ProductSection />
      <IndustrySection />
      <CaseStudySection />
      <WhyChooseSection />
      <TestimonialSection />
      <BlogSection />
    </div>
  )
}
