import { useRef } from 'react'

import { useAnchorScroll } from '../hooks/useAnchorScroll'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'

import { useWebflowInit } from '../hooks/useWebflowInit'

import {
  AboutSection,
  CompanySection,
  CompanyLogosSection,
  ContactUsSection,
  HeroSection,
  HeroVideo,
  ServiceSection,
} from '../components/home'



export function HomeContent() {

  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useAnchorScroll(ref)
  useInViewAnimation(ref)

  useWebflowInit(ref)



  return (

    <div ref={ref}>

      <HeroSection />

      <HeroVideo />

      <AboutSection />

      <ServiceSection />

      <CompanySection />

      <CompanyLogosSection />

      <ContactUsSection />

      {/* <ProductSection />

      <IndustrySection />

      <CaseStudySection />

      <WhyChooseSection />

      <TestimonialSection />

      <BlogSection /> */}

    </div>

  )

}

