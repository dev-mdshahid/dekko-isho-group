import { useRef } from 'react'

import { useAnchorScroll } from '../hooks/useAnchorScroll'
import { useHomeAnimations } from '../hooks/useHomeAnimations'
import { useInViewAnimation } from '../hooks/useInViewAnimation'
import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'

import { useWebflowInit } from '../hooks/useWebflowInit'

import {
  AboutSection,
  CompanySection,
  ContactUsSection,
  HeroSection,
  HeroVideo,
  ServiceSection,
  SolutionsExpertiseSection,
} from '../components/home'



export function HomeContent() {

  const ref = useRef<HTMLDivElement>(null)

  useLegacyLinkInterceptor(ref)
  useAnchorScroll(ref)
  useHomeAnimations(ref)
  useInViewAnimation(ref)

  useWebflowInit(ref)



  return (

    <div ref={ref}>

      <HeroSection />

      <HeroVideo />

      <SolutionsExpertiseSection />
      
      <AboutSection />


      <ServiceSection />

      <CompanySection />

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

