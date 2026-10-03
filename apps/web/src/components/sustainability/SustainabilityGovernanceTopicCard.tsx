import type { GovernanceTopic } from '../../data/sustainability/content'

type Props = {
  topic: GovernanceTopic
}

export function SustainabilityGovernanceTopicCard({ topic }: Props) {
  const isPng = topic.icon.toLowerCase().endsWith('.png')

  return (
    <article className="sustain-governance-topic-card">
      <div className="sustain-governance-topic-content">
        <h3 className="sustain-governance-topic-title">{topic.title}</h3>
        <p className="sustain-governance-topic-description">{topic.description}</p>
      </div>
      <img
        src={topic.icon}
        loading="lazy"
        alt=""
        aria-hidden="true"
        className={
          isPng
            ? 'sustain-governance-topic-icon sustain-governance-topic-icon--png'
            : 'sustain-governance-topic-icon'
        }
      />
    </article>
  )
}
