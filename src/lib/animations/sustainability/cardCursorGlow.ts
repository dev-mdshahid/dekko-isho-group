import { gsap } from 'gsap'

export function createCardCursorGlow(card: HTMLElement) {
  const glow = card.querySelector<HTMLElement>('.sustain-card-glow')
  if (!glow) return null

  const setPosition = (clientX: number, clientY: number, smooth = true) => {
    const rect = card.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100

    if (smooth) {
      gsap.to(glow, {
        '--glow-x': `${x}%`,
        '--glow-y': `${y}%`,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    } else {
      gsap.set(glow, { '--glow-x': `${x}%`, '--glow-y': `${y}%` })
    }
  }

  return {
    onEnter: (event: PointerEvent) => {
      setPosition(event.clientX, event.clientY, false)
      gsap.to(glow, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
    },
    onMove: (event: PointerEvent) => {
      setPosition(event.clientX, event.clientY)
    },
    onLeave: () => {
      gsap.to(glow, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
        onComplete: () => {
          gsap.set(glow, { '--glow-x': '50%', '--glow-y': '50%' })
        },
      })
    },
    kill: () => {
      gsap.killTweensOf(glow)
    },
  }
}
