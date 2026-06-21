import { legacyImage, legacyVideo } from '../../lib/assets'
import { FadeIn } from '../ui/FadeIn'

const VIDEO_POSTER =
  'https://cdn.prod.website-files.com/68d1288562216d12f8801f37%2F68e4bc3a1992c6b0b7d18443_Video%2002-poster-00001.jpg'
const VIDEO_MP4 = legacyVideo('Video-02-transcode.mp4')
const VIDEO_WEBM = legacyVideo('Video-02-transcode.webm')

export function AboutVideoSection() {
  return (
    <section className="video-section">
      <div
        data-poster-url={VIDEO_POSTER}
        data-video-urls={`${VIDEO_MP4},${VIDEO_WEBM}`}
        data-autoplay="true"
        data-loop="true"
        data-wf-ignore="true"
        className="background-video section-spacing w-background-video w-background-video-atom"
      >
        <video
          id="4c3a6b37-8067-c476-dec6-d6fbcf23d959-video"
          autoPlay
          loop
          muted
          playsInline
          data-wf-ignore="true"
          data-object-fit="cover"
          style={{ backgroundImage: `url("${VIDEO_POSTER}")` }}
        >
          <source src={VIDEO_MP4} data-wf-ignore="true" />
          <source src={VIDEO_WEBM} data-wf-ignore="true" />
        </video>
        <div className="container">
          <div className="video-info-main">
            <FadeIn id="cf34f538-c38e-75a9-7e1b-0cf526f8bbc2" className="video-info">
              <div className="video-title-line" />
              <h3 className="video-title">Delivering quality across industries and borders.</h3>
            </FadeIn>
            <div className="video-counter-info">
              <div className="inner-number text-white">
                <div className="numbers-counts">
                  <div data-target="50,000" className="count">
                    50,000
                  </div>
                </div>
                <div className="counter-symbol text-linear-gradient">
                  <div>+</div>
                </div>
              </div>
              <div className="number-text">Global delivery. Precision assured</div>
            </div>
          </div>
        </div>
        <div aria-live="polite">
          <button
            type="button"
            data-w-bg-video-control="true"
            aria-controls="4c3a6b37-8067-c476-dec6-d6fbcf23d959-video"
            className="w-backgroundvideo-backgroundvideoplaypausebutton video-button w-background-video--control"
          >
            <span className="play-state bg-dark">
              <img
                src={legacyImage('video-Icon-Puse.svg')}
                loading="lazy"
                alt="Pause video"
              />
            </span>
            <span hidden className="pause-state bg-dark">
              <img loading="lazy" alt="Play video" src={legacyImage('Video-Icon-Play.svg')} />
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
