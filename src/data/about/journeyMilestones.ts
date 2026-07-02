export type JourneyEntry = {
  title: string
  description?: string
}

export type JourneyMilestone = {
  id: string
  year: string
  entries: JourneyEntry[]
}

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: 'about-journey-1953',
    year: '1953',
    entries: [
      {
        title: 'Roxy Paints Ltd.',
        description:
          "Three young entrepreneurs invest in a new idea. Bangladesh's first color paint manufacturer is born — and a 70-year legacy of innovation begins.",
      },
    ],
  },
  {
    id: 'about-journey-1983',
    year: '1983',
    entries: [
      {
        title: 'Dekko Garments Ltd. (Old Factory)',
        description:
          'We enter apparel with three production lines. The unit will eventually expand to over 108 lines.',
      },
    ],
  },
  {
    id: 'about-journey-1992',
    year: '1992',
    entries: [
      {
        title: 'Dekko Fashions Ltd. (Formerly Dekko Apparels Ltd.)',
        description: '100% export-oriented woven garments concern, opened in January 1992.',
      },
    ],
  },
  {
    id: 'about-journey-2006',
    year: '2006',
    entries: [
      {
        title: 'Dekko Readywears Ltd.',
        description: 'A sister concern specializing in woven garments, fully export-oriented.',
      },
    ],
  },
  {
    id: 'about-journey-2013',
    year: '2013',
    entries: [
      {
        title: 'Globus Garments Ltd.',
        description: '18 lines, 1,319 machines, over 300,000 garments produced per month.',
      },
    ],
  },
  {
    id: 'about-journey-2015',
    year: '2015',
    entries: [
      {
        title: 'Agami Fashions',
        description:
          'Agami Fashions Ltd., established in 2015, is also an export oriented woven garments factory, based in Chandra, Gazipur.',
      },
      {
        title: 'Roxy Agami Washing Ltd.',
        description:
          'Agami Washing Ltd. was inaugurated on 2015, is partnered with all the top buyers of Dekko ISHO Group and provides clothes with top quality washing and processing.',
      },
    ],
  },
  {
    id: 'about-journey-2017',
    year: '2017',
    entries: [
      {
        title: 'Dekko Garments — Green Factory',
        description:
          'A complete green setup in Mawna, Gazipur. The latest of our RMG factories, built sustainably from the ground up.',
      },
    ],
  },
  {
    id: 'about-journey-2018',
    year: '2018',
    entries: [
      { title: 'Globus Embroidery Ltd.' },
      { title: 'Izakaya' },
      { title: 'Klubhaus' },
    ],
  },
  {
    id: 'about-journey-2019',
    year: '2019',
    entries: [{ title: 'ISHO Ltd.' }],
  },
  {
    id: 'about-journey-2020',
    year: '2020',
    entries: [{ title: 'ECOVIA' }],
  },
  {
    id: 'about-journey-2021',
    year: '2021',
    entries: [{ title: 'Sprintex Enterprise' }, { title: 'Dekko ISHO Technologies Ltd.' }],
  },
  {
    id: 'about-journey-2022',
    year: '2022',
    entries: [{ title: 'DIVC' }],
  },
  {
    id: 'about-journey-2026',
    year: '2026',
    entries: [{ title: 'Dekko Garments Ltd. Unit 2' }],
  },
]
