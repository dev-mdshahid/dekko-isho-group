import { solutionPath } from '../solutions/solutions'

export type NavLink = {
  to: string
  label: string
  showExternalIcon?: boolean
  shouldOpenInNewTab?: boolean
}

export type NavLinkGroup = {
  id: string
  label: string
  links: NavLink[]
}

export const solutionNavLinks: NavLink[] = [
  {
    to: solutionPath('design-product-development'),
    label: 'Design Studio',
  },
  {
    to: solutionPath('manufacturing'),
    label: 'Integrated Manufacturing',
  },
  {
    to: solutionPath('industrial-laundry'),
    label: 'Industrial Laundry',
  },
  {
    to: solutionPath('embroidery'),
    label: 'Embroidery Unit',
  },
]

export const businessNavGroups: NavLinkGroup[] = [
  {
    id: 'apparel-manufacturing',
    label: 'Apparel Manufacturing',
    links: [
      {
        to: '/dekko-garments',
        label: 'Dekko Garments Ltd.',
      },
      {
        to: '/dekko-readywares',
        label: 'Dekko Readywears Ltd.',
      },
      {
        to: '/dekko-fashions',
        label: 'Dekko Fashions Ltd.',
      },
      // {
      //   to: '/globus-garments',
      //   label: 'Globus Garments Ltd.',
      // },
      // {
      //   to: '/agami-fashions',
      //   label: 'Agami Fashions Ltd.',
      // },
      // {
      //   to: '/agami-washing',
      //   label: 'Agami Washing Ltd.',
      // },
    ],
  },
  {
    id: 'other-business-verticals',
    label: 'Other Business Verticals',
    links: [
      {
        to: '/isho-ltd',
        label: 'ISHO Ltd.',
        showExternalIcon: true,
      },
      {
        to: 'https://www.di.vc/',
        label: 'DIVC',
        showExternalIcon: true,
      },
      {
        to: '/dekko-isho',
        label: 'DITECH',
        showExternalIcon: true,
      },
      {
        to: '/klubhaus',
        label: 'Klubhaus',
        showExternalIcon: true,
      },
      {
        to: '/izakaya',
        label: 'IZAKAYA',
        showExternalIcon: true,
      },
      {
        to: 'https://www.ecoviaglobal.com/',
        label: 'Ecovia Ltd.',
        showExternalIcon: true,
      },
    ],
  },
]

/**
 * Flat list used by the desktop Businesses dropdown and
 * the mobile Businesses accordion.
 */
export const dekkoBusinessNav: NavLink[] = [
  {
    to: 'https://www.isho.com',
    label: 'ISHO',
    showExternalIcon: true,
    shouldOpenInNewTab: true,
  },
  {
    to: 'https://www.di.vc',
    label: 'DIVC',
    showExternalIcon: true,
    shouldOpenInNewTab: true,
  },
  {
    to: 'https://www.ditech.co',
    label: 'DITECH',
    showExternalIcon: true,
    shouldOpenInNewTab: true,
  },
  {
    to: 'https://klubhaus.com.bd',
    label: 'Klubhaus',
    showExternalIcon: true,
    shouldOpenInNewTab: true,
  },
  {
    to: 'https://izakaya.com.bd',
    label: 'IZAKAYA',
    showExternalIcon: true,
    shouldOpenInNewTab: true,
  },
  {
    to: 'https://www.ecoviaglobal.com',
    label: 'Ecovia',
    showExternalIcon: true,
    shouldOpenInNewTab: true,
  },
]

export const mediaNavLinks: NavLink[] = [
  {
    to: '/news',
    label: 'News',
  },
  {
    to: '/press',
    label: 'Press',
  },
  {
    to: '/gallery',
    label: 'Gallery',
  },
]

export function flattenNavLinks(
  groups: readonly NavLinkGroup[],
): NavLink[] {
  return groups.flatMap((group) => group.links)
}

export function isNavLinkActive(
  pathname: string,
  to: string,
): boolean {
  if (
    to.startsWith('http://') ||
    to.startsWith('https://')
  ) {
    return false
  }

  if (to === '/') {
    return pathname === '/'
  }

  return (
    pathname === to ||
    pathname.startsWith(`${to}/`)
  )
}

export function isNavGroupActive(
  pathname: string,
  links: readonly NavLink[],
): boolean {
  return links.some((link) =>
    isNavLinkActive(pathname, link.to),
  )
}
