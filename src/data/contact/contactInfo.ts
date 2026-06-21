export const contactPhone = {
  href: 'tel:+8809606101010',
  label: '+8809606101010',
} as const

export const contactEmail = {
  href: 'mailto:hello@dekkoisho.com',
  label: 'hello@dekkoisho.com',
} as const

export const socialLinks = [
  { href: 'https://facebook.com/dekkoisho', label: 'facebook.com/dekkoisho' },
  { href: 'https://instagram.com/dekkoisho', label: 'instagram.com/dekkoisho' },
  { href: 'https://linkedin.com/dekkoisho', label: 'linkedin.com/dekkoisho' },
  { href: 'https://x.com/dekkoisho', label: 'x.com/dekkoisho' },
] as const

export type OfficeLocation = {
  name: string
  lines: readonly string[]
  phone?: { href: string; label: string }
  mapsUrl: string
}

export const officeLocations: readonly OfficeLocation[] = [
  {
    name: 'Corporate HQ, Dhaka',
    lines: ['The Forum, West Tower, Tejgaon Gulshan Link Road.'],
    mapsUrl: 'https://maps.google.com/?q=The+Forum+West+Tower+Tejgaon+Gulshan+Link+Road+Dhaka',
  },
  {
    name: 'London Office',
    lines: ['36 Gloucester Avenue, London NW1 7BB, UK'],
    phone: { href: 'tel:+14439884430', label: '+1 443 988 4430' },
    mapsUrl: 'https://maps.google.com/?q=36+Gloucester+Avenue+London+NW1+7BB+UK',
  },
  {
    name: 'Madrid, Spain',
    lines: [],
    phone: { href: 'tel:+14439884430', label: '+1 443 988 4430' },
    mapsUrl: 'https://maps.google.com/?q=Madrid+Spain',
  },
  {
    name: 'New York, USA',
    lines: [],
    phone: { href: 'tel:+14439884430', label: '+1 443 988 4430' },
    mapsUrl: 'https://maps.google.com/?q=New+York+USA',
  },
]
