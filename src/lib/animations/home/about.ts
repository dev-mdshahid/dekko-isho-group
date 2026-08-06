import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { type AnimationCleanup, isMobileViewport, prefersReducedMotion } from '../prefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const MAX_TILT = 3.5

export function initAboutAnimations(scope: ParentNode): AnimationCleanup {
  const carousel = scope.querySelector<HTMLElement>('[data-home-animate="about-carousel"]')
  const cards = scope.querySelectorAll<HTMLElement>('[data-home-animate="about-card"]')
  const arrows = scope.querySelectorAll<HTMLElement>('.about-carousel-arrow')

  const cleanups: (() => void)[] = []

  if (carousel && !prefersReducedMotion()) {
    const tween = gsap.fromTo(
      carousel,
      { scale: 0.96, opacity: 0, y: 40 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 1.55,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: carousel,
          start: 'top 85%',
          toggleActions: 'restart reset restart reset',
        },
      },
    )

    cleanups.push(() => {
      tween.scrollTrigger?.kill()
      tween.kill()
    })
  }

  if (!isMobileViewport() && !prefersReducedMotion()) {
    cards.forEach((card) => {
      const media = card.querySelector<HTMLElement>('.about-business-card__media')

      gsap.set(card, { transformPerspective: 900, force3D: true })

      const setRotateX = gsap.quickTo(card, 'rotateX', {
        duration: 0.6,
        ease: 'power3.out',
      })
      const setRotateY = gsap.quickTo(card, 'rotateY', {
        duration: 0.6,
        ease: 'power3.out',
      })

      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5

        setRotateY(x * MAX_TILT * 2)
        setRotateX(-y * MAX_TILT * 2)

        if (media) {
          gsap.to(media, {
            scale: 1.035,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      }

      const onLeave = () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.9,
          ease: 'power3.out',
          overwrite: 'auto',
        })
        if (media) {
          gsap.to(media, {
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }
      }

      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)

      cleanups.push(() => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
        gsap.killTweensOf([card, media].filter(Boolean))
      })
    })
  }

  arrows.forEach((arrow) => {
    const onEnter = () => {
      if (prefersReducedMotion()) return
      gsap.to(arrow, { scale: 1.05, duration: 0.35, ease: 'power3.out' })
    }
    const onLeave = () => {
      gsap.to(arrow, { scale: 1, duration: 0.4, ease: 'power3.out' })
    }

    arrow.addEventListener('mouseenter', onEnter)
    arrow.addEventListener('mouseleave', onLeave)

    cleanups.push(() => {
      arrow.removeEventListener('mouseenter', onEnter)
      arrow.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(arrow)
    })
  })

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
