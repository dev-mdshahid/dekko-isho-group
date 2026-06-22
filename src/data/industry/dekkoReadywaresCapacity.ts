export type DekkoReadywaresCapacityStat = {
  id: string
  value: string
  label: string
  variant: 'dark' | 'white' | 'pink' | 'blue'
}

export const dekkoReadywaresCapacityStats: DekkoReadywaresCapacityStat[] = [
  { id: 'established', value: '2006', label: 'Established', variant: 'dark' },
  { id: 'lines', value: '25', label: 'Production Lines', variant: 'white' },
  { id: 'machineries', value: '1535', label: 'Machineries', variant: 'pink' },
  { id: 'output', value: '600K+', label: 'Monthly Output', variant: 'blue' },
]
