import type { ReactNode } from 'react'

import { globusGarmentsProcessIcons } from './globusGarmentsProcessIcons'

export type GlobusGarmentsProcessItem = {
  id: string
  icon: ReactNode
  title: string
  description: string
}

export const globusGarmentsProcessIntro = {
  badge: 'From Fabric to Shipment',
  title: 'One Controlled Flow, End to End',
}

export const globusGarmentsProcessItems: GlobusGarmentsProcessItem[] = [
  {
    id: 'material',
    icon: globusGarmentsProcessIcons.material,
    title: 'Material & Sourcing',
    description:
      'Fabric and trims sourced through a local & global mill network, aligned to buyer tech packs.',
  },
  {
    id: 'cutting',
    icon: globusGarmentsProcessIcons.cutting,
    title: 'Cutting',
    description: 'Spreading and cutting set to marker plans for efficient fabric utilisation.',
  },
  {
    id: 'sewing',
    icon: globusGarmentsProcessIcons.sewing,
    title: 'Sewing',
    description: 'Multi-line sewing floors with inline checks at every critical operation.',
  },
  {
    id: 'washing',
    icon: globusGarmentsProcessIcons.washing,
    title: 'Washing & Finishing',
    description: 'Garment wash, pressing and finishing — enzyme, dark, mid and light wash.',
  },
  {
    id: 'inspection',
    icon: globusGarmentsProcessIcons.inspection,
    title: 'Inspection',
    description: 'AQL inspection and measurement audits before any carton is sealed.',
  },
  {
    id: 'packing',
    icon: globusGarmentsProcessIcons.packing,
    title: 'Packing & Shipment',
    description: 'Final QC, packing and export dispatch readiness on schedule.',
  },
]
