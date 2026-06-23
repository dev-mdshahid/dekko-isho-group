import { legacyImage } from '../../lib/assets'

const HERO_VIDEO = '/videos/hero-video-2.mp4'
const HERO_VIDEO_ID = 'home-hero-video'

export function HeroVideo() {
  return (
    <div className="hero-video-wrap">
      <div
        data-video-urls={HERO_VIDEO}
        data-autoplay="true"
        data-loop="true"
        data-wf-ignore="true"
        className="hero-background-video w-background-video w-background-video-atom"
      >
        <video
          id={HERO_VIDEO_ID}
          autoPlay
          loop
          muted
          playsInline
          data-wf-ignore="true"
          className="hero-video-media"
        >
          <source src={HERO_VIDEO} type="video/mp4" data-wf-ignore="true" />
        </video>

        <div aria-live="polite">
          <button
            type="button"
            data-w-bg-video-control="true"
            aria-controls={HERO_VIDEO_ID}
            className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control hero-video-control"
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
    </div>
  )
}
