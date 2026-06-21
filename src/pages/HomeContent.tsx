import { useRef } from 'react'

import { useInViewAnimation } from '../hooks/useInViewAnimation'

import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'

import { useWebflowInit } from '../hooks/useWebflowInit'

import { SectionGradient } from '../components/ui/SectionDecor'

import {

  AboutSection,

  BlogSection,

  CaseStudySection,

  CompanySection,

  CompanyLogosSection,

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

  useWebflowInit(ref)



  return (

    <div ref={ref}>

      <HeroSection />

      <HeroVideo />

      <AboutSection />

      <ServiceSection />

      <SectionGradient />

      <CompanySection />

      <CompanyLogosSection />

      <ProductSection />

      <IndustrySection />

      <CaseStudySection />

      <WhyChooseSection />

      <TestimonialSection />

      <BlogSection />

    </div>

  )

}

