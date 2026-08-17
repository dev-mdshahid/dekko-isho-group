import { useCallback, useEffect, useRef, useState } from 'react'

const OVERVIEW_IMAGE = '/images/about/old-machine.png'
const OVERVIEW_VIDEO = '/videos/about-overview-machine.mp4'
const OVERVIEW_ALT = 'Vintage industrial machine representing Dekko Isho Group origins'
const LUMA_KEY_FILTER_ID = 'about-overview-luma-key'
const SLOW_CONNECTIONS = new Set(['slow-2g', '2g'])
const SUPPORTS_OBSERVER = typeof IntersectionObserver !== 'undefined'

type NetworkInformation = {
  saveData?: boolean
  effectiveType?: string
}

function prefersLightweightMedia() {
  const { connection } = navigator as Navigator & { connection?: NetworkInformation }
  if (!connection) return false
  return Boolean(connection.saveData) || SLOW_CONNECTIONS.has(connection.effectiveType ?? '')
}

/**
 * The source clip is rendered on solid black, so its luminance becomes the alpha
 * channel that drops the backdrop onto the light section.
 *
 * Keying on luminance alone leaves a dark rim: pixels along the silhouette are a blend
 * of artwork and black, and painting them at full opacity reads as a black outline. So
 * the matte is blurred and re-thresholded above its midpoint, which pulls the edge
 * inward past that rim. Interior shading is untouched because it is already fully
 * opaque before the blur.
 */
function LumaKeyFilter() {
  return (
    <svg className="about-overview-luma-key" aria-hidden="true" focusable="false">
      <defs>
        <filter
          id={LUMA_KEY_FILTER_ID}
          colorInterpolationFilters="sRGB"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0.2126 0.7152 0.0722 0 0"
            result="luminance"
          />
          <feComponentTransfer in="luminance" result="silhouette">
            <feFuncA type="linear" slope="8" intercept="-0.08" />
          </feComponentTransfer>
          <feGaussianBlur in="silhouette" stdDeviation="1" result="spread" />
          <feComponentTransfer in="spread" result="matte">
            <feFuncA type="linear" slope="4" intercept="-2.4" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="matte" operator="in" />
        </filter>
      </defs>
    </svg>
  )
}

export function AboutOverviewVisual() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const [video, setVideo] = useState<HTMLVideoElement | null>(null)
  const [isMotionAllowed, setIsMotionAllowed] = useState(false)
  const [isNearViewport, setIsNearViewport] = useState(!SUPPORTS_OBSERVER)
  const [hasEnteredViewport, setHasEnteredViewport] = useState(!SUPPORTS_OBSERVER)
  const [isVideoVisible, setIsVideoVisible] = useState(false)
  const [hasVideoFailed, setHasVideoFailed] = useState(false)

  const showVideo = isMotionAllowed && hasEnteredViewport && !hasVideoFailed

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setIsMotionAllowed(!query.matches && !prefersLightweightMedia())

    sync()
    query.addEventListener('change', sync)

    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const media = mediaRef.current
    if (!media || !SUPPORTS_OBSERVER) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting)
        if (entry.isIntersecting) setHasEnteredViewport(true)
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(media)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!video) return

    let isCancelled = false

    const sync = () => {
      if (!isNearViewport || document.hidden) {
        video.pause()
        return
      }

      video.play().catch((error: unknown) => {
        // Pausing while play() is pending rejects with AbortError; only blocked autoplay is fatal.
        if (isCancelled || (error instanceof DOMException && error.name === 'AbortError')) return
        setHasVideoFailed(true)
      })
    }

    sync()
    document.addEventListener('visibilitychange', sync)

    return () => {
      isCancelled = true
      document.removeEventListener('visibilitychange', sync)
    }
  }, [isNearViewport, video])

  // Tracking the element as state keeps playback tied to the mounted node, and the
  // imperative source lets teardown cancel an in-flight download.
  const attachVideo = useCallback((node: HTMLVideoElement | null) => {
    if (node) {
      // Muting before the first play attempt is what keeps autoplay allowed on Safari.
      node.defaultMuted = true
      node.muted = true
      node.src = OVERVIEW_VIDEO
    }

    setVideo(node)

    return () => {
      setVideo(null)
      if (!node) return
      node.pause()
      node.removeAttribute('src')
      node.load()
    }
  }, [])

  const handlePlaying = useCallback(() => setIsVideoVisible(true), [])

  const handleError = useCallback(() => {
    setIsVideoVisible(false)
    setHasVideoFailed(true)
  }, [])

  return (
    <div className="about-overview-visual">
      <div
        ref={mediaRef}
        className="about-overview-media"
        data-video-visible={isVideoVisible ? 'true' : 'false'}
      >
        <img
          src={OVERVIEW_IMAGE}
          loading="lazy"
          decoding="async"
          width={1080}
          height={1459}
          alt={OVERVIEW_ALT}
          className="about-author-image about-overview-machine"
        />

        {showVideo && (
          <video
            ref={attachVideo}
            className="about-overview-machine-video"
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
            disablePictureInPicture
            disableRemotePlayback
            onPlaying={handlePlaying}
            onError={handleError}
          />
        )}
      </div>

      {showVideo && <LumaKeyFilter />}
    </div>
  )
}
