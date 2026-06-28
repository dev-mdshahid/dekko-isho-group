export type LeadershipMember = {
  id: string
  name: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export type TopExecutivesContent = {
  title: string
  description: string
  image: string
  imageAlt: string
}

export const leadershipMembers: LeadershipMember[] = [
  {
    id: 'about-leadership-shahid-hossain',
    name: 'Shahid Hossain',
    title: 'CHAIRMAN',
    description:
      'Began contributing during his Masters at Dhaka University and was instrumental in establishing the Group from the very beginning. His creativity, drive and obsessive attention to detail have led the Group to industry prominence.',
    image: '/images/shahid-hossain.jpg',
    imageAlt: 'Shahid Hossain, Chairman of Dekko ISHO Group',
  },
  {
    id: 'about-leadership-rayana-hossain',
    name: 'Rayana Hossain',
    title: 'Director, ISHO',
    description:
      'Believes design should be embedded at every level of any organization. Harvard-educated, she founded ISHO — a stepping stone for smart-home solutions in Bangladesh — built on cumulative knowledge construction and the collaborative nature of design.',
    image: '/images/rayana-hossain.png',
    imageAlt: 'Rayana Hossain, Director of ISHO',
  },
  {
    id: 'about-leadership-prottoy-hossain',
    name: 'Prottoy Hossain',
    title: 'Director',
    description:
      "A changemaker leading sustainable business practices. Under his leadership, Dekko Isho has invested in deep tech and green tech to reduce environmental footprint and increase positive social impact — driving the Group's zero-carbon ambition.",
    image: '/images/prottoy-hossain.png',
    imageAlt: 'Prottoy Hossain, Director of Dekko ISHO Group',
  },
]

export const topExecutivesContent: TopExecutivesContent = {
  title: 'Top Executives',
  description:
    'People overseeing different departments are proactively steering the company towards new levels of success and innovation, ensuring a bright and prosperous future for the organization.',
  image: '/images/top-executives.png',
  imageAlt: 'Dekko ISHO Group top executives team photo',
}
