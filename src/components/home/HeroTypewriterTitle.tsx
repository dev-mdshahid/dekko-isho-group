import {
  type HeroCharToken,
  HERO_TITLE_ARIA,
  type HeroTitleAccent,
  type HeroTitleLine,
} from '../../data/home/heroTitle'
import { useHeroTypewriter } from '../../hooks/useHeroTypewriter'

type CharGroup = {
  accent?: HeroTitleAccent
  text: string
}

function groupVisibleChars(tokens: HeroCharToken[], visibleCount: number): CharGroup[] {
  const groups: CharGroup[] = []

  for (const token of tokens.slice(0, visibleCount)) {
    const last = groups[groups.length - 1]

    if (last && last.accent === token.accent) {
      last.text += token.char
      continue
    }

    groups.push({ accent: token.accent, text: token.char })
  }

  return groups
}

function renderCharGroups(groups: CharGroup[]) {
  return groups.map((group, index) => {
    if (group.accent) {
      return (
        <span
          key={`${group.accent}-${index}`}
          className={`hero-title-word hero-title-accent hero-title-accent--${group.accent}`}
        >
          {group.text}
        </span>
      )
    }

    return <span key={`plain-${index}`}>{group.text}</span>
  })
}

function HeroTypewriterLine({
  line,
  tokens,
  visibleCount,
  showCaret,
}: {
  line: HeroTitleLine
  tokens: HeroCharToken[]
  visibleCount: number
  showCaret: boolean
}) {
  const maskClassName = [
    'hero-title-line-mask',
    line.inline ? 'hero-title-line-mask--inline' : '',
    showCaret ? 'hero-title-line-mask--typing' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={maskClassName}>
      <span className="hero-title-line">
        {renderCharGroups(groupVisibleChars(tokens, visibleCount))}
        {showCaret ? (
          <span
            className={`hero-title-caret${showCaret ? ' is-blinking' : ''}`}
            aria-hidden="true"
          />
        ) : null}
      </span>
    </span>
  )
}

export function HeroTypewriterTitle() {
  const { lines, lineTokens, visibleCounts, activeLine, isComplete, isTyping } =
    useHeroTypewriter()

  return (
    <h1 className="hero-title" aria-label={HERO_TITLE_ARIA}>
      {lines.map((line, lineIndex) => (
        <HeroTypewriterLine
          key={lineIndex}
          line={line}
          tokens={lineTokens[lineIndex]!}
          visibleCount={visibleCounts[lineIndex] ?? 0}
          showCaret={
            (isTyping && lineIndex === activeLine) ||
            (isComplete && lineIndex === lines.length - 1)
          }
        />
      ))}
    </h1>
  )
}
