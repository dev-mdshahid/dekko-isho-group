import type { AwardHonor } from '../../data/awards/honors'

const MIN_ITEMS_PER_COLUMN = 4

export function getHonorsColumnCount(viewportWidth: number): number {
  if (viewportWidth <= 680) return 2
  if (viewportWidth <= 1000) return 3
  return 4
}

export function distributeHonorsColumns(awards: AwardHonor[], columnCount: number): AwardHonor[][] {
  if (awards.length === 0 || columnCount <= 0) {
    return []
  }

  const columns: AwardHonor[][] = Array.from({ length: columnCount }, () => [])

  awards.forEach((award, index) => {
    columns[index % columnCount].push(award)
  })

  columns.forEach((column) => {
    let fillIndex = 0
    while (column.length < MIN_ITEMS_PER_COLUMN) {
      column.push(awards[fillIndex % awards.length])
      fillIndex += 1
    }
  })

  return columns
}
