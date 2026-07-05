import type { SdgGoal, SdgPillar } from '../../data/sustainability/content'

type SustainabilitySdgGoalsProps = {
  pillars: SdgPillar[]
}

function SdgGoalItem({ goal }: { goal: SdgGoal }) {
  if (goal.highlight) {
    return (
      <li>
        <b>{goal.highlight}</b>
        {goal.text}
      </li>
    )
  }

  return <li>{goal.text}</li>
}

export function SustainabilitySdgGoals({ pillars }: SustainabilitySdgGoalsProps) {
  return (
    <div className="sustain-sdg-goals">
      {pillars.map((pillar) => (
        <div key={pillar.id} className={`sustain-sdg-pillar sustain-sdg-pillar--${pillar.id}`}>
          <div className="sustain-sdg-pillar-label">
            <div className="sustain-sdg-pillar-bar" aria-hidden="true" />
            <h3>{pillar.label}</h3>
            <span>{pillar.description}</span>
          </div>

          <div className="sustain-sdg-groups">
            {pillar.groups.map((group) => (
              <div key={group.id} className="sustain-sdg-group">
                <div className="sustain-sdg-logos">
                  {group.logos.map((logo) => (
                    <img key={logo.src} src={logo.src} alt={logo.alt} loading="lazy" />
                  ))}
                </div>
                <ul>
                  {group.goals.map((goal) => (
                    <SdgGoalItem key={`${group.id}-${goal.highlight ?? goal.text}`} goal={goal} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
