const VIDEO_IMAGE = '/images/fashion-outlet.png'

export function AboutVideoSection() {
  return (
    <section className="video-section">
      <div className="about-video-media">
        <img
          src={VIDEO_IMAGE}
          loading="lazy"
          alt="Fashion outlet showroom displaying apparel racks"
          className="about-video-image"
        />
        <div className="about-video-overlay" aria-hidden="true" />
      </div>
    </section>
  )
}
