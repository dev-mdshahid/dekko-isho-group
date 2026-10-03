import { type RefObject, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function gaugeDuration(percentage: number) {
  return Math.max(2, Math.min(4, 1.5 + (percentage / 100) * 2))
}

export function useGaugeAnimation(percentage: number, triggerRef: RefObject<HTMLElement | null>) {
  const [displayPct, setDisplayPct] = useState(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = triggerRef.current
    if (!el) return

    const obj = { val: 0 }

    const tween = gsap.to(obj, {
      val: percentage,
      duration: gaugeDuration(percentage),
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
      },
      onUpdate: () => setDisplayPct(obj.val),
      onComplete: () => setDisplayPct(percentage),
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [percentage, triggerRef])

  return displayPct
}
