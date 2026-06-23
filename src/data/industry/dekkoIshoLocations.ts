import type { IndustryLocationProps } from '../../components/industry'

export const dekkoIshoLocations: IndustryLocationProps = {
  id: 'dekko-isho-locations',
  badge: 'Cyber Defense',
  title: 'Secure your business with DITECH.',
  description:
    'DITECH helps modern organizations strengthen digital resilience through proactive cybersecurity, threat monitoring, vulnerability assessment, and response-focused protection for critical business systems.',
  locations: [
    {
      id: 'ditech-office',
      number: '01',
      title: 'DITECH Office',
      subtitle:
        'The Forum, West Tower, Level 16-19, 187, 188/B, Tejgaon Gulshan Link Road, Dhaka-1209, Bangladesh',
    },
    {
      id: 'corporate-hq',
      number: '02',
      title: 'Corporate HQ',
      subtitle:
        'Dekko ISHO Group, The Forum, West Tower, Tejgaon Gulshan Link Road, Dhaka-1209, Bangladesh',
    },
    {
      id: 'business-contact',
      number: '03',
      title: 'Business Contact',
      subtitle: 'DITECH, Dekko ISHO Technologies Ltd., Dhaka, Bangladesh\n+880 9606-101010',
    },
  ],
}
