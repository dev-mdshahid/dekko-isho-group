import type { CapacityStat } from '../../components/ui/CapacityStatCircles'

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
  badge: 'Live the Experience',
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
    "At Dekko ISHO Group, work is more than what we do—it’s how we learn, collaborate, innovate, and grow together. Every day brings new opportunities to create meaningful impact while building a career you’ll be proud of.",
  ctaLabel: 'Explore Opportunities',
  ctaHref: '#open-positions',
  watermark: 'SINCE 1953',
  heroCarousel: [
    {
      src: '/images/career/hero-carousel-03.png',
      alt: 'Award ceremony celebrating team excellence at Dekko ISHO',
    },
    {
      src: '/images/career/hero-carousel-04.png',
      alt: 'Colleagues receiving recognition at an award giving event',
    },
    {
      src: '/images/career/hero-carousel-01.png',
      alt: 'Dekko ISHO team members together at a workplace gathering',
    },
    {
      src: '/images/career/hero-carousel-02.png',
      alt: 'Employees collaborating on the factory floor',
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
      alt: 'Workplace moment capturing the Dekko ISHO community',
    },
    {
      src: '/images/career/hero-carousel-08.png',
      alt: 'Women colleagues representing the Dekko ISHO workforce',
    },
    {
      src: '/images/career/hero-carousel-09.jpg',
      alt: 'Day-to-day life across Dekko ISHO operations',
    },
    {
      src: '/images/career/hero-carousel-10.png',
      alt: 'Team members shaping the future at Dekko ISHO',
    },
  ] satisfies CareerHeroCarouselSlide[],
}

export const careerWorkplace = {
  id: 'career-workplace',
  badge: 'Our Culture',
  title: 'More Than a Workplace',
  description: [
    "Because careers aren’t built by titles alone. They’re built by people who inspire you, challenges that push you forward, and a culture that helps you become your best.",
    "Here, you’ll find opportunities to learn continuously, collaborate across businesses, celebrate achievements, and create lasting impact.",
  ],
  image: '/images/career/more-than-a-workplace.png',
  imageAlt:
    'Dekko ISHO team members gathered at a company exhibition booth discussing opportunities',
}

export const careerWhy = {
  badge: 'Why Dekko ISHO',
  heading: 'More Than Just a Job.',
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
  { id: 'career-stat-employees', value: '18,000+', countTarget: 18000, suffix: '+', label: 'EMPLOYEES WORLDWIDE' },
  { id: 'career-stat-verticals', value: '4', countTarget: 4, label: 'BUSINESS VERTICALS' },
  { id: 'career-stat-years', value: '70+', countTarget: 70, suffix: '+', label: 'YEARS OF EXCELLENCE' },
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
    `At Dekko ISHO, our journey is shaped by the people who bring it to life. Their experiences, perspectives, and everyday contributions reflect the culture, ambition, and diversity of our Group.`,
  testimonials: [
    {
      id: 'career-voice-01',
      name: 'Md. Nizam Uddin',
      role: 'Executive, Procurement',
      quote:
        'The positive and supportive work culture has been a key part of my experience at Dekko ISHO Group. I look forward to contributing more and being part of what’s ahead.',
      avatar: '/images/employees/md_nizam_uddin.png',
      avatarAlt: 'Md. Nizam Uddin',
    },
    {
      id: 'career-voice-02',
      name: 'Mst. Mohsina Aktar',
      role: 'Executive, Accounts & Finance',
      quote:
        'Dekko ISHO is my first step into corporate life, and every experience here continues to inspire me professionally and personally.',
      avatar: '/images/employees/mst_mohsina_aktar.png',
      avatarAlt: 'Portrait of Mst. Mohsina Aktar',
    },
    {
      id: 'career-voice-03',
      name: 'Safa Akter Noon',
      role: 'Coordinator, Sustainability',
      quote:
        'The transition from academics to the professional world seemed challenging at first, but the inspiring environment turned it into a journey of learning and growth.​',
      avatar: '/images/employees/safa_akter_noon.png',
      avatarAlt: 'Portrait of Safa Akter Noon',
    },
    {
      id: 'career-voice-04',
      name: 'Md. Shahed Anwar',
      role: 'Senior Executive, Procurement',
      quote:
        ' From the very first day, I felt welcomed and supported at every step and I continue to be inspired by this truly supportive and collaborative culture.',
      avatar: '/images/employees/md_shahed_anwar.png',
      avatarAlt: 'Portrait of Md. Shahed Anwar',
    },
  ] satisfies CareerTestimonial[],
}

export type CareerLifeCard = {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
  /** Subject position when the photo fills its portrait card. */
  imagePosition?: string
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
      imagePosition: '32% center',
      imageAlt: 'Team members sharing knowledge in a collaborative learning session',
    },
    {
      id: 'career-life-02',
      title: 'Honoring Every Contribution',
      description:
        'Behind every milestone are people who make it possible. We recognize dedication, celebrate achievements, and appreciate every contribution that helps us move forward together.',
      image: '/images/career/life-honoring-every-contribution.jpg',
      imagePosition: '22% center',
      imageAlt: 'Colleagues celebrating recognition at an awards night',
    },
    {
      id: 'career-life-03',
      title: 'Purpose Beyond Performance',
      description:
        'Our impact extends beyond business goals. Through community initiatives and shared responsibility, we nurture a culture where purpose guides how we grow.',
      image: '/images/career/life-purpose-beyond-performance.png',
      imagePosition: 'center',
      imageAlt: 'A young community member holding a seedling plant',
    },
    {
      id: 'career-life-04',
      title: 'One Team, Many Perspectives',
      description:
        'Diverse voices strengthen how we work. We create space for collaboration, dialogue, and shared problem-solving across roles and experiences.',
      image: '/images/career/life-one-team-many-perspectives.png',
      imagePosition: '25% center',
      imageAlt: 'Employees engaged in a problem-solving workshop together',
    },
    {
      id: 'career-life-05',
      title: 'Moments That Bring Us Together',
      description:
        'From celebrations to everyday connections, the moments we share build trust, camaraderie, and a workplace that feels like home.',
      image: '/images/career/life-moments-that-bring-us-together.jpg',
      imagePosition: 'center',
      imageAlt: 'Team members celebrating together at a sports tournament',
    },
    {
      id: 'career-life-06',
      title: 'Learning and Development',
      description:
        'We believe in nurturing talent and fostering growth. Our comprehensive learning and development programs empower employees to reach their full potential.',
      image: `/images/career/Learning-and-Development.png`,
      imagePosition: 'center',
      imageAlt: 'Employees participating in a training session',
    },
    {
      id: 'career-life-07',
      title: 'Investing in People',
      description:
        'We prioritize the well-being and growth of our employees. Through mentorship, coaching, and career advancement opportunities, we invest in our people for long-term success.',
      image: '/images/career/Investing-in-People.png',
      imagePosition: 'center',
      imageAlt: 'Employees engaged in a mentorship program',
    },
  ] satisfies CareerLifeCard[],
}

export const careerGrowthTogether = {
  badge: 'Growth',
  title: 'Growing Together in Numbers',
  description:
    'Behind every milestone is a shared commitment to learning, collaboration, and continuous growth.',
  stats: [
    {
      id: 'people',
      value: '18,000+',
      label: 'People Growing Together',
      variant: 'blue',
    },
    {
      id: 'years',
      value: '70+',
      label: 'Years of Building Trust',
      variant: 'sky',
    },
    {
      id: 'verticals',
      value: 'Multiple',
      label: 'Business Verticals',
      variant: 'navy',
    },
    {
      id: 'leadership',
      value: 'Leadership',
      label: 'Development Initiatives',
      variant: 'pink',
    },
    {
      id: 'learning',
      value: 'Continuous',
      label: 'Learning & Development Programs',
      variant: 'white',
    },
    {
      id: 'careers',
      value: 'Diverse',
      label: 'Career Opportunities',
      variant: 'dark',
    },
  ] satisfies CapacityStat[],
}

export const careerApplyCta = {
  badge: 'Career',
  heading: 'Ready to Grow with Us?',
  description: "Send us your profile and let’s start a conversation about your future.",
  buttonLabel: 'Apply Now',
  buttonHref: '#open-positions',
}
