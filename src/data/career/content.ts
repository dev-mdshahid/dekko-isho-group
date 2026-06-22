export type CareerWhyItem = {
  id: string
  number: string
  title: string
  description: string
}

export type CareerStat = {
  id: string
  value: string
  countTarget?: number
  suffix?: string
  label: string
}

export type CareerJob = {
  id: string
  department: string
  title: string
  location: string
  employmentType: string
}

export type CareerTestimonial = {
  id: string
  name: string
  role: string
  quote: string
}

export const careerHero = {
  badge: 'Career at Dekko Isho',
  titleLine1: 'Join a Team That',
  titleLine2: 'Shapes the Future',
}

export const careerBanner = {
  headline: 'A Workplace Built for Excellence.',
  description:
    'Our culture is defined by our commitment to quality and the shared vision of our 20,000+ people. We believe in creating an environment where everyone can thrive.',
  ctaLabel: 'Explore Roles',
  ctaHref: '#open-positions',
  watermark: 'SINCE 1953',
}

export const careerWhy = {
  badge: 'Why Dekko Isho',
  heading: 'More Than just a Job.',
  items: [
    {
      id: 'career-why-01',
      number: '01',
      title: 'Career Growth & Global Learning',
      description:
        'Access to continuous professional development programs and international brand collaborations.',
    },
    {
      id: 'career-why-02',
      number: '02',
      title: 'Purpose-Driven Impact at Scale',
      description:
        'Be part of projects that directly impact communities and promote large-scale sustainability.',
    },
    {
      id: 'career-why-03',
      number: '03',
      title: 'Culture of Excellence & Innovation',
      description:
        'A workplace that encourages challenging the status quo and thinking beyond boundaries.',
    },
  ] satisfies CareerWhyItem[],
}

export const careerStats: CareerStat[] = [
  { id: 'career-stat-employees', value: '10,000+', countTarget: 10000, suffix: '+', label: 'EMPLOYEES WORLDWIDE' },
  { id: 'career-stat-verticals', value: '4', countTarget: 4, label: 'BUSINESS VERTICALS' },
  { id: 'career-stat-years', value: '30+', countTarget: 30, suffix: '+', label: 'YEARS OF EXCELLENCE' },
  { id: 'career-stat-countries', value: '20+', countTarget: 20, suffix: '+', label: 'COUNTRIES SERVED' },
]

export const careerOpenPositions = {
  badge: 'Open Roles',
  heading: 'Open Positions',
  ctaLabel: 'All Roles',
  ctaHref: '#open-positions',
  jobs: [
    {
      id: 'career-job-01',
      department: 'Technology',
      title: 'Sr. Software Engineer',
      location: 'Dhaka',
      employmentType: 'Full-time',
    },
    {
      id: 'career-job-02',
      department: 'Compliance & Sustainability',
      title: 'Compliance Manager',
      location: 'Dhaka',
      employmentType: 'Full-time',
    },
    {
      id: 'career-job-03',
      department: 'Manufacturing',
      title: 'Production Supervisor',
      location: 'Gazipur',
      employmentType: 'Full-time',
    },
    {
      id: 'career-job-04',
      department: 'Corporate',
      title: 'Marketing Executive',
      location: 'Dhaka',
      employmentType: 'Full-time',
    },
    {
      id: 'career-job-05',
      department: 'Industrial Laundry',
      title: 'Industrial Laundry Technician',
      location: 'Gazipur',
      employmentType: 'Full-time',
    },
    {
      id: 'career-job-06',
      department: 'Sustainability',
      title: 'Sustainability Analyst',
      location: 'Dhaka',
      employmentType: 'Full-time',
    },
  ] satisfies CareerJob[],
}

export const careerEmployeeVoices = {
  badge: 'Employee Voices',
  headline:
    'Our strength is our people. From the precision in our laundry facilities to the intelligence in our software, excellence is driven by the individuals who call Dekko ISHO home.',
  testimonials: [
    {
      id: 'career-voice-01',
      name: 'Rafiq Islam',
      role: 'Production Lead',
      quote:
        'The exposure to global manufacturing standards here has completely changed my perspective on quality and scale.',
    },
    {
      id: 'career-voice-02',
      name: 'Sarah Ahmed',
      role: 'UX Designer',
      quote:
        'Working in the technology vertical allows us to build solutions that literally move the needle for thousands of employees.',
    },
    {
      id: 'career-voice-03',
      name: 'Tanvir Hasan',
      role: 'Sustainability Analyst',
      quote:
        'Being at a group that actually invests in solar and wastewater reuse is what makes this work truly meaningful.',
    },
  ] satisfies CareerTestimonial[],
}

export const careerApplyCta = {
  badge: 'Career',
  heading: 'Ready to Grow With Us?',
  description: "Send us your profile and let's start a conversation about your future.",
  buttonLabel: 'Apply Now',
  buttonHref: '/contact',
}
