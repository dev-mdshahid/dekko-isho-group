import { solutions, solutionPath } from '../solutions/solutions'

export const footerMainLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: solutionPath(solutions[0].slug), label: 'Solutions' },
  { to: '/career', label: 'Career' },
  { to: '/press', label: 'Blog' },
] as const

export const footerBusinessLinks = [
  { to: '/solutions/manufacturing', label: 'Ready Made Garments' },
  { to: '/dekko-fashions', label: 'Retail Fashion' },
  { to: '/about', label: 'Strategic Investment' },
] as const

export const footerContact = {
  address: 'Corporate HQ, Dhaka - The Forum, West Tower, Tejgaon Gulshan Link Road.',
  phone: {
    href: 'tel:+8809606101010',
    label: '+880 9606-101010',
  },
  email: {
    href: 'mailto:info@dekkoisho.com',
    label: 'info@dekkoisho.com',
  },
} as const

export const footerSocialLinks = [
  {
    href: 'https://www.facebook.com/share/1HoDreUv8S/',
    label: 'Facebook',
    icon: 'facebook.svg',
  },
  {
    href: 'https://www.linkedin.com/company/dekkoishogroup/',
    label: 'LinkedIn',
    icon: 'linkedin.svg',
  },
  {
    href: 'https://x.com/dekkoisho',
    label: 'Twitter',
    icon: 'twitter-x.svg',
  },
  {
    href: 'https://www.youtube.com/@dekkoishogroup9251',
    label: 'Youtube',
    icon: 'social-icon-3.svg',
  },
] as const
