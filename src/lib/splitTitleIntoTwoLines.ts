function scoreSplit(line1: string, line2: string, splitAfterAmpersand: boolean): number {
  const lengthDiff = Math.abs(line1.length - line2.length)
  const ampersandBonus = splitAfterAmpersand ? -4 : 0

  return lengthDiff + ampersandBonus
}

export function splitTitleIntoTwoLines(title: string): [string, string] {
  const words = title.trim().split(/\s+/)

  if (words.length === 0) {
    return ['', '\u00A0']
  }

  if (words.length === 1) {
    return [words[0], '\u00A0']
  }

  if (words.length === 2) {
    return [words[0], words[1]]
  }

  let bestIndex = 1
  let bestScore = Infinity

  for (let index = 1; index < words.length; index += 1) {
    const line1 = words.slice(0, index).join(' ')
    const line2 = words.slice(index).join(' ')
    const splitAfterAmpersand = words[index - 1] === '&'
    const nextScore = scoreSplit(line1, line2, splitAfterAmpersand)

    if (nextScore < bestScore) {
      bestScore = nextScore
      bestIndex = index
    }
  }

  return [words.slice(0, bestIndex).join(' '), words.slice(bestIndex).join(' ')]
}
