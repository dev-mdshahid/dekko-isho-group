import { PageHeroSection } from '../ui/PageHeroSection'
import { AboutImageInfoSection } from './AboutImageInfoSection'

export function AboutHeroSection() {
  return (
    <PageHeroSection
      titleLines={[
        [
          { text: 'Creating' },
          { text: 'Impact', accent: 'green' },
        ],
        [
          { text: 'Across' },
          { text: 'Generations', accent: 'primary' },
        ],
      ]}
      subtitle="For over seven decades, we have transformed ambition into progress through innovation, resilience, and responsible growth. Today, we continue to create lasting value for our people, partners and communities while shaping a better future for all."
    >
      <AboutImageInfoSection />
    </PageHeroSection>
  )
}
