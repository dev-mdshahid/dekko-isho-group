import { FadeIn } from '../components/ui/FadeIn'
import { PreSectionTitle } from '../components/ui/PreSectionTitle'
import {
  agamiFashionsShowcaseBanner,
  agamiFashionsShowcaseCategories,
  agamiFashionsShowcaseFooter,
  agamiFashionsShowcaseIntro,
} from '../data/industry/agamiFashionsShowcase'

export function AgamiFashionsShowcaseSection() {
  return (
    <section className="agami-fashions-showcase">
      <div className="agami-fashions-showcase-container">
        <FadeIn id="agami-fashions-showcase-banner" className="agami-fashions-showcase-banner">
          <img
            src={agamiFashionsShowcaseBanner.imageSrc}
            loading="lazy"
            alt={agamiFashionsShowcaseBanner.imageAlt}
            className="agami-fashions-showcase-banner-image"
          />
          <div className="agami-fashions-showcase-banner-overlay" aria-hidden="true" />
          <div className="agami-fashions-showcase-banner-content">
            <span className="agami-fashions-showcase-banner-eyebrow">
              {agamiFashionsShowcaseBanner.eyebrow}
            </span>
            <h2 className="agami-fashions-showcase-banner-title">{agamiFashionsShowcaseBanner.title}</h2>
            <p className="agami-fashions-showcase-banner-description">
              {agamiFashionsShowcaseBanner.description}
            </p>
          </div>
        </FadeIn>

        <FadeIn id="agami-fashions-showcase-header" className="agami-fashions-showcase-header">
          <PreSectionTitle title={agamiFashionsShowcaseIntro.badge} />
          <h2 className="agami-fashions-showcase-title">{agamiFashionsShowcaseIntro.title}</h2>
        </FadeIn>

        <div className="agami-fashions-showcase-grid">
          {agamiFashionsShowcaseCategories.map((item, index) => (
            <FadeIn
              key={item.id}
              id={`agami-fashions-showcase-${item.id}`}
              className="agami-fashions-showcase-card"
              delay={index * 50}
            >
              <img
                src={item.imageSrc}
                loading="lazy"
                alt={item.imageAlt}
                className="agami-fashions-showcase-card-image"
              />
              <div className="agami-fashions-showcase-card-overlay" aria-hidden="true" />
              <div className="agami-fashions-showcase-card-caption">
                <h3 className="agami-fashions-showcase-card-title">{item.title}</h3>
                <p className="agami-fashions-showcase-card-description">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn id="agami-fashions-showcase-footer" className="agami-fashions-showcase-footer" delay={80}>
          {agamiFashionsShowcaseFooter.map((paragraph) => (
            <p key={paragraph} className="agami-fashions-showcase-footer-text">
              {paragraph}
            </p>
          ))}
        </FadeIn>
      </div>
    </section>
  )
}
