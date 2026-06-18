import { legacyImage, legacyVideo } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'

const HERO_POSTER =
  'https://cdn.prod.website-files.com/68d1288562216d12f8801f37%2F68dcaf0cefe8d0466c2141cf_hero%20video-poster-00001.jpg'

export function HeroVideo() {
  return (
    <div className="hero-video-wrap">
      <div
        data-poster-url={HERO_POSTER}
        data-video-urls="videos/hero-video-transcode.mp4,videos/hero-video-transcode.webm"
        data-autoplay="true"
        data-loop="true"
        data-wf-ignore="true"
        className="hero-background-video w-background-video w-background-video-atom"
      >
        <video
          id="e77f24d8-eda0-f5c0-babb-14e345b95f67-video"
          autoPlay
          loop
          muted
          playsInline
          data-wf-ignore="true"
          data-object-fit="cover"
          style={{ backgroundImage: `url("${HERO_POSTER}")` }}
        >
          <source src={legacyVideo('hero-video-transcode.mp4')} data-wf-ignore="true" />
          <source src={legacyVideo('hero-video-transcode.webm')} data-wf-ignore="true" />
        </video>
        <div aria-live="polite">
          <button
            type="button"
            data-w-bg-video-control="true"
            aria-controls="e77f24d8-eda0-f5c0-babb-14e345b95f67-video"
            className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control"
          >
            <span className="play-state">
              <img
                src={legacyImage('video-Icon-Puse.svg')}
                loading="lazy"
                alt="Pause video"
                className="video-button-image"
              />
            </span>
            <span hidden className="pause-state">
              <img
                loading="lazy"
                alt="Play video"
                src={legacyImage('Video-Icon-Play.svg')}
                className="video-button-image"
              />
            </span>
          </button>
        </div>
      </div>
      <div className="hero-quote-wrap">
        <FadeIn id="8094fac9-4cf8-16af-6b25-90966716d9c7" className="hero-quote-info">
          <div className="hero-quote-card">
            <img
              src={legacyImage('Quote-Image-2.webp')}
              loading="lazy"
              alt="Hero Quote Image"
              className="hero-quote-image"
            />
            <div className="quote-founder-info">
              <div className="quote-founder-name">Michael R. Bennett</div>
              <div className="quote-founder-job">Founder & CEO</div>
            </div>
          </div>
          <p className="quote-description">
            Great manufacturing isn&apos;t just about precision it&apos;s about vision, commitment, and the
            relentless pursuit of excellence.
          </p>
        </FadeIn>
      </div>
      <div className="bg" />
    </div>
  )
}
