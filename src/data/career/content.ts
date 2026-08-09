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
  avatar: string
  avatarAlt: string
}

export const careerHero = {
  badge: 'Live the Experience.',
  titleLine1: 'Growing Together,',
  titleLine2: 'Every Day.',
}

export type CareerHeroCarouselSlide = {
  src: string
  alt: string
}

export const careerBanner = {
  headline: 'A Workplace Built for Excellence.',
  description:
    "At Dekko ISHO Group, work is more than what we do—it's how we learn, collaborate, innovate, and grow together. Every day brings new opportunities to create meaningful impact while building a career you'll be proud of.",
  ctaLabel: 'Explore Opportunities',
  ctaHref: '#open-positions',
  watermark: 'SINCE 1953',
  heroCarousel: [
    {
      src: '/images/career/hero-carousel-01.png',
      alt: 'Dekko Isho team members together at a workplace gathering',
    },
    {
      src: '/images/career/hero-carousel-02.png',
      alt: 'Employees collaborating on the factory floor',
    },
    {
      src: '/images/career/hero-carousel-03.png',
      alt: 'Award ceremony celebrating team excellence at Dekko Isho',
    },
    {
      src: '/images/career/hero-carousel-04.png',
      alt: 'Colleagues receiving recognition at an award giving event',
    },
    {
      src: '/images/career/hero-carousel-05.png',
      alt: 'Team celebrating Boishakhi Mela festivities together',
    },
    {
      src: '/images/career/hero-carousel-06.png',
      alt: 'Employees enjoying cultural festivities at Boishakhi Mela',
    },
    {
      src: '/images/career/hero-carousel-07.png',
      alt: 'Workplace moment capturing the Dekko Isho community',
    },
    {
      src: '/images/career/hero-carousel-08.png',
      alt: 'Women colleagues representing the Dekko Isho workforce',
    },
    {
      src: '/images/career/hero-carousel-09.jpg',
      alt: 'Day-to-day life across Dekko Isho operations',
    },
    {
      src: '/images/career/hero-carousel-10.png',
      alt: 'Team members shaping the future at Dekko Isho',
    },
  ] satisfies CareerHeroCarouselSlide[],
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
  applicationFormUrl: 'https://forms.gle/7v7Xybpjd5wboKi9A',
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
    '"Our strength is our people. From the precision in our laundry facilities to the intelligence in our software, excellence is driven by the individuals who call Dekko ISHO home."',
  testimonials: [
    {
      id: 'career-voice-01',
      name: 'Rafiq Islam',
      role: 'Production Lead',
      quote:
        'The exposure to global manufacturing standards here has completely changed my perspective on quality and scale.',
      avatar: '/images/employees/rafiq-islam.jpg',
      avatarAlt: 'Portrait of Rafiq Islam',
    },
    {
      id: 'career-voice-02',
      name: 'Sarah Ahmed',
      role: 'UX Designer',
      quote:
        'Working in the technology vertical allows us to build solutions that literally move the needle for thousands of employees.',
      avatar: '/images/employees/sarah-ahmed.jpg',
      avatarAlt: 'Portrait of Sarah Ahmed',
    },
    {
      id: 'career-voice-03',
      name: 'Tanvir Hasan',
      role: 'Sustainability Analyst',
      quote:
        'Being at a group that actually invests in solar and wastewater reuse is what makes this work truly meaningful.',
      avatar: '/images/employees/tanvir-hasan.jpg',
      avatarAlt: 'Portrait of Tanvir Hasan',
    },
  ] satisfies CareerTestimonial[],
}

export type CareerLifeCard = {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export const careerLifeAt = {
  title: 'Life at Dekko ISHO Group',
  subtitle:
    'A collection of authentic moments that reflect our culture, values, and the experiences that bring our people together.',
  cards: [
    {
      id: 'career-life-01',
      title: 'Learning Never Stops',
      description:
        'From leadership development and technical training to mentorship and cross-functional exposure, we invest in helping our people grow throughout their careers.',
      image: '/images/career/life-learning-never-stops.png',
      imageAlt: 'Team members sharing knowledge in a collaborative learning session',
    },
    {
      id: 'career-life-02',
      title: 'Honoring Every Contribution',
      description:
        'Behind every milestone are people who make it possible. We recognize dedication, celebrate achievements, and appreciate every contribution that helps us move forward together.',
      image: '/images/career/life-honoring-every-contribution.jpg',
      imageAlt: 'Colleagues celebrating recognition at an awards night',
    },
    {
      id: 'career-life-03',
      title: 'Purpose Beyond Performance',
      description:
        'Our impact extends beyond business goals. Through community initiatives and shared responsibility, we nurture a culture where purpose guides how we grow.',
      image: '/images/career/life-purpose-beyond-performance.png',
      imageAlt: 'A young community member holding a seedling plant',
    },
    {
      id: 'career-life-04',
      title: 'One Team, Many Perspectives',
      description:
        'Diverse voices strengthen how we work. We create space for collaboration, dialogue, and shared problem-solving across roles and experiences.',
      image: '/images/career/life-one-team-many-perspectives.png',
      imageAlt: 'Employees engaged in a problem-solving workshop together',
    },
    {
      id: 'career-life-05',
      title: 'Moments That Bring Us Together',
      description:
        'From celebrations to everyday connections, the moments we share build trust, camaraderie, and a workplace that feels like home.',
      image: '/images/career/life-moments-that-bring-us-together.jpg',
      imageAlt: 'Team members celebrating together at a sports tournament',
    },
  ] satisfies CareerLifeCard[],
}

export const careerApplyCta = {
  badge: 'Career',
  heading: 'Ready to Grow With Us?',
  description: "Send us your profile and let's start a conversation about your future.",
  buttonLabel: 'Apply Now',
  buttonHref: '/contact',
}
