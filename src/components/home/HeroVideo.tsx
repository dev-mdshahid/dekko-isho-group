import { legacyImage } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'

const HERO_VIDEO = '/videos/hero-video.mp4'
const HERO_POSTER =
  'https://cdn.prod.website-files.com/68d1288562216d12f8801f37%2F68dcaf0cefe8d0466c2141cf_hero%20video-poster-00001.jpg'
const CHAIRMAN_IMAGE = '/images/shahid-hossain.jpg'

export function HeroVideo() {
  return (
    <div className="hero-video-wrap">
      <div
        data-poster-url={HERO_POSTER}
        data-video-urls={HERO_VIDEO}
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
          <source src={HERO_VIDEO} data-wf-ignore="true" />
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
              src={CHAIRMAN_IMAGE}
              loading="lazy"
              alt="Shahid Hossain"
              className="hero-quote-image"
            />
            <div className="quote-founder-info">
              <div className="quote-founder-name">Shahid Hossain</div>
              <div className="quote-founder-job">CHAIRMAN</div>
            </div>
          </div>
          <p className="quote-description">
            Began contributing during his Masters at Dhaka University and was instrumental in
            establishing the Group from the very beginning. His creativity, drive and obsessive
            attention to detail have led the Group to industry prominence.
          </p>
        </FadeIn>
      </div>
      <div className="bg" />
    </div>
  )
}
