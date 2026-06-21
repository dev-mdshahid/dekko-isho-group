import { useRef } from 'react'

import { useInViewAnimation } from '../hooks/useInViewAnimation'

import { useLegacyLinkInterceptor } from '../hooks/useLegacyLinkInterceptor'

import { useWebflowInit } from '../hooks/useWebflowInit'

import { SectionGradient } from '../components/ui/SectionDecor'

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

