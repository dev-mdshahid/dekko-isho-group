import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  formatCapacityCount,
  parseCapacityCountValue,
  scrambleCapacityText,
} from '../lib/capacityStatAnimation'

export function useCapacityStatAnimation(
  valueRef: RefObject<HTMLSpanElement | null>,
  value: string,
) {
  useLayoutEffect(() => {
    const element = valueRef.current
    const circle = element?.closest('.capacity-stat-circle')
    if (!element || !circle || !value.trim()) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    element.textContent = value
    if (motionPreference.matches) return

    gsap.registerPlugin(ScrollTrigger)
    const counted = parseCapacityCountValue(value)
    const state = { progress: 0 }
    let started = false
    let finished = false
    let lastScrambleTime = -Infinity

    const finish = () => {
      finished = true
      element.textContent = value
    }

    if (counted) element.textContent = formatCapacityCount(0, counted)

    const tween = gsap.to(state, {
      progress: 1,
      duration: counted ? 1.8 : 0.9,
      ease: counted ? 'power2.out' : 'none',
      paused: true,
      onUpdate: () => {
        if (counted) {
          element.textContent = formatCapacityCount(state.progress * counted.target, counted)
        } else {
          const now = performance.now()
          if (now - lastScrambleTime < 1000 / 30) return
          lastScrambleTime = now
          element.textContent = scrambleCapacityText(value, state.progress)
        }
      },
      onComplete: finish,
    })

    const play = () => {
      if (started || finished) return
      started = true
      if (!counted) {
        element.textContent = scrambleCapacityText(value, 0)
        lastScrambleTime = performance.now()
      }
      tween.play()
    }

    const trigger = ScrollTrigger.create({
      trigger: circle,
      start: 'top 80%',
      once: true,
      onEnter: play,
    })

    // A circle can already be past its trigger on mount or after route restoration.
    const bounds = circle.getBoundingClientRect()
    if (bounds.top <= window.innerHeight * 0.8 && bounds.bottom > 0) play()

    const onMotionChange = () => {
      if (!motionPreference.matches) return
      tween.kill()
      trigger.kill()
      finish()
    }
    motionPreference.addEventListener('change', onMotionChange)

    return () => {
      motionPreference.removeEventListener('change', onMotionChange)
      trigger.kill()
      tween.kill()
      element.textContent = value
    }
  }, [valueRef, value])
}
