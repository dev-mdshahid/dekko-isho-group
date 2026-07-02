export type AwardHonor = {
  id: string
  image: string
  imageAlt: string
  title: string
  category: string
}

const awardImage = (file: string) => `/images/awards/award-list/${file}`

export const awardsHonorsContent = {
  tag: 'Awards',
  title: 'Awards & Honors',
  description:
    'Celebrating our achievements in innovation, quality, and sustainability that set industry standards and inspire excellence.',
} as const

export const awardHonors: AwardHonor[] = [
  {
    id: 'honor-supplier-award-2024',
    image: awardImage('supplier-award-2024.png'),
    imageAlt: 'Supplier Award 2024 certificate',
    title: 'Supplier Award 2024',
    category: 'Supplier Award 2024',
  },
  {
    id: 'honor-certificate-excellence-thrive-1',
    image: awardImage('certificate-of-excellence-thrive-champions-award.png'),
    imageAlt: 'Certificate of Excellence from Thrive Champions Award 2024',
    title: 'Certificate of Excellence',
    category: 'Thrive Champions Award 2024',
  },
  {
    id: 'honor-certificate-excellence-thrive-2',
    image: awardImage('28fd16e88849bad1549dac6e8940a4f90ca0bd8a.png'),
    imageAlt: 'Certificate of Excellence from Thrive Champions Award 2024',
    title: 'Certificate of Excellence',
    category: 'Thrive Champions Award 2024',
  },
  {
    id: 'honor-best-pace-trainer',
    image: awardImage('best-pace-trainer.png'),
    imageAlt: 'Best P.A.C.E Trainer trophy from Thrive Champions Award 2024',
    title: 'Best P.A.C.E Trainer',
    category: 'Thrive Champions Award 2024',
  },
  {
    id: 'honor-highest-pace-learners',
    image: awardImage('highest-pace-learners.png'),
    imageAlt: 'Highest P.A.C.E Learners trophy from Thrive Champions Award 2024',
    title: 'Highest P.A.C.E Learners (2nd Runner Up)',
    category: 'Thrive Champions Award 2024',
  },
  {
    id: 'honor-partnership-award',
    image: awardImage('partnership-award.png'),
    imageAlt: 'JOYJO Partnership Award trophy',
    title: 'Partnership Award',
    category: 'JOYJO Partnership Award Aug 2025',
  },
  {
    id: 'honor-certificate-appreciation',
    image: awardImage('certificate-of-appreciation.png'),
    imageAlt: 'Certificate of Appreciation for Top Hard Value Score 2023',
    title: 'Certificate of Appreciation',
    category: 'Top Hard Value Score 2023',
  },
  {
    id: 'honor-kiabi-supplier-relationship',
    image: awardImage('kiabi-supplier-relationship.png'),
    imageAlt: 'KIABI Supplier Relationship Management Day award',
    title: 'KIABI Supplier Relationship Management Day',
    category: 'Supplier Award 2024',
  },
  {
    id: 'honor-jack-jones-leading-manufacturer',
    image: awardImage('jack-and-jones-leading-manufacturer.png'),
    imageAlt: 'Jack&Jones Leading Manufacturer Growth Turnover trophy',
    title: 'Jack&Jones Leading Manufacturer Growth Turnover',
    category: 'Supplier Award 2024',
  },
  {
    id: 'honor-recognition-key-supplier',
    image: awardImage('recognition-key-supplier.png'),
    imageAlt: 'Certificate of Recognition Key Supplier',
    title: 'Certificate of Recognition Key Supplier',
    category: 'Supplier Award 2024',
  },
  {
    id: 'honor-certificate-excellence-supplier-2024-1',
    image: awardImage('certificate-of-excellece-supplier-award-2024.png'),
    imageAlt: 'Certificate of Excellence from Supplier Award 2024',
    title: 'Certificate of Excellence',
    category: 'Supplier Award 2024',
  },
  {
    id: 'honor-certificate-excellence-supplier-2024-2',
    image: awardImage('certificate-of-excellece-supplier-award-2024.png'),
    imageAlt: 'Certificate of Excellence from Supplier Award 2024',
    title: 'Certificate of Excellence',
    category: 'Supplier Award 2024',
  },
  {
    id: 'honor-supplier-award-glass',
    image: awardImage('supplier-award.png'),
    imageAlt: 'Supplier Award 2024 glass trophy',
    title: 'Supplier Award 2024',
    category: 'Supplier Award 2024',
  },
]
