export type HeroTitleAccent = 'primary' | 'green' | 'red'

export type HeroTitlePart = {
  text: string
  accent?: HeroTitleAccent
}

export type HeroTitleLine = {
  parts: HeroTitlePart[]
  inline?: boolean
}

export const HERO_TITLE_LINES: HeroTitleLine[] = [
  {
    parts: [
      { text: 'Elevating ' },
      { text: 'Excellence', accent: 'primary' },
    ],
  },
  {
    inline: true,
    parts: [
      { text: 'Through ' },
      { text: 'Sustainable', accent: 'green' },
    ],
  },
  {
    inline: true,
    parts: [
      { text: 'Progress', accent: 'red' },
    ],
  },
]

export const HERO_TITLE_ARIA =
  'Elevating Excellence Through Sustainable Progress'
