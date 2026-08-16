const NBSP = '\u00A0'

function scoreSplit(line1: string, line2: string, splitAfterAmpersand: boolean): number {
  const lengthDiff = Math.abs(line1.length - line2.length)
  const ampersandBonus = splitAfterAmpersand ? -4 : 0

  return lengthDiff + ampersandBonus
}

function isAndWord(word: string) {
  return word.toLowerCase() === 'and'
}

/** Keep "and" attached to a neighbor so it never wraps onto a line alone. */
function glueAndNeighbors(words: string[]): string {
  const parts: string[] = []

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index]

    if (!isAndWord(word)) {
      parts.push(word)
      continue
    }

    if (index < words.length - 1) {
      parts.push(`${word}${NBSP}${words[index + 1]}`)
      index += 1
      continue
    }

    if (parts.length > 0) {
      parts[parts.length - 1] = `${parts[parts.length - 1]}${NBSP}${word}`
      continue
    }

    parts.push(word)
  }

  return parts.join(' ')
}

function splitAroundAnd(words: string[]): [string, string] | null {
  const andIndex = words.findIndex(isAndWord)
  if (andIndex <= 0 || andIndex >= words.length - 1) return null

  const wordsAfterAnd = words.length - andIndex - 1

  // One trailing word: keep "… and" on line 1 so wraps read as "WORD AND" / "LAST"
  // Multiple trailing words: keep "and …" on line 2 so wraps read as "AND WORD" / "REST"
  const splitIndex = wordsAfterAnd === 1 ? andIndex + 1 : andIndex
  if (splitIndex <= 0 || splitIndex >= words.length) return null

  return [
    glueAndNeighbors(words.slice(0, splitIndex)),
    glueAndNeighbors(words.slice(splitIndex)),
  ]
}

export function splitTitleIntoTwoLines(title: string): [string, string] {
  const words = title.trim().split(/\s+/)

  if (words.length === 0) {
    return ['', NBSP]
  }

  if (words.length === 1) {
    return [words[0], NBSP]
  }

  if (words.length === 2) {
    return [words[0], words[1]]
  }

  const andSplit = splitAroundAnd(words)
  if (andSplit) return andSplit

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
