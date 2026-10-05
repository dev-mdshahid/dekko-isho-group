import { type RefObject, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  formatCapacityCount,
  formatCapacityCountNumber,
  parseCapacityCountValue,
} from '../lib/capacityStatAnimation'

type CapacityStatAnimationTarget = 'full' | 'number'

export function useCapacityStatAnimation(
  valueRef: RefObject<HTMLSpanElement | null>,
  value: string,
  target: CapacityStatAnimationTarget = 'full',
) {
  useLayoutEffect(() => {
    const element = valueRef.current
    const circle = element?.closest('.capacity-stat-circle')
    if (!element || !circle || !value.trim()) return

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const counted = parseCapacityCountValue(value)
    const finalText = counted && target === 'number'
      ? formatCapacityCountNumber(counted.target, counted)
      : value

    element.textContent = finalText

    // Only animate numeric values (count-up). Plain text stays static — no letter scramble.
    if (!counted || motionPreference.matches) return

    const formatCount = (count: number) => target === 'number'
      ? formatCapacityCountNumber(count, counted)
      : formatCapacityCount(count, counted)

    gsap.registerPlugin(ScrollTrigger)
    const state = { progress: 0 }
    let started = false
    let finished = false

    const finish = () => {
      finished = true
      element.textContent = finalText
    }

    element.textContent = formatCount(0)

    const tween = gsap.to(state, {
      progress: 1,
      duration: 1.8,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        element.textContent = formatCount(state.progress * counted.target)
      },
      onComplete: finish,
    })

    const play = () => {
      if (started || finished) return
      started = true
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
      element.textContent = finalText
    }
  }, [valueRef, value, target])
}
