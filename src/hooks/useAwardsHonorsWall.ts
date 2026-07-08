import { useEffect, type RefObject } from 'react'

import type { AwardHonor } from '../data/awards/honors'
import { distributeHonorsColumns, getHonorsColumnCount } from '../lib/awards/distributeHonorsColumns'
import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'

const FLOAT_EXIT_MS = 450
const FLOAT_GUARD_PAD = 6

type Options = {
  awards: AwardHonor[]
  wallRef: RefObject<HTMLDivElement | null>
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function cardHTML(award: AwardHonor) {
  const title = escapeHtml(award.title)
  const org = escapeHtml(award.category)
  const year = escapeHtml(award.year)
  const image = escapeHtml(award.image)
  const alt = escapeHtml(award.imageAlt)

  return `<div class="card" data-award-id="${escapeHtml(award.id)}">
    <div class="ph"><img src="${image}" alt="${alt}" loading="lazy"></div>
    <div class="cap">
      <div class="top"><h4>${title}</h4><span class="yr">${year}</span></div>
      <p>${org}</p>
    </div>
  </div>`
}

export function useAwardsHonorsWall({ awards, wallRef }: Options) {
  useEffect(() => {
    const wall = wallRef.current
    if (!wall || awards.length === 0) return

    let animationFrameId: number | null = null
    let exitTimeoutId: number | null = null
    let floatEl: HTMLDivElement | null = null
    let ghostEl: HTMLDivElement | null = null
    let columnCount = getHonorsColumnCount(window.innerWidth)
    let reducedMotion = prefersReducedMotion()

    const colEls: Array<{ el: HTMLDivElement; y: number; speed: number }> = []

    const clearExitTimeout = () => {
      if (exitTimeoutId !== null) {
        window.clearTimeout(exitTimeoutId)
        exitTimeoutId = null
      }
    }

    const teardownFloat = (immediate = false) => {
      clearExitTimeout()

      if (!floatEl) {
        if (ghostEl) {
          ghostEl.classList.remove('ghost')
          ghostEl.style.transition = ''
          ghostEl = null
        }
        wall.classList.remove('lit')
        return
      }

      const float = floatEl
      const ghost = ghostEl
      floatEl = null
      ghostEl = null
      wall.classList.remove('lit')

      if (immediate) {
        float.remove()
        if (ghost) {
          ghost.classList.remove('ghost')
          ghost.style.transition = ''
        }
        return
      }

      float.classList.remove('in')
      float.classList.add('out')

      exitTimeoutId = window.setTimeout(() => {
        float.remove()

        if (ghost) {
          ghost.style.transition = 'opacity .8s ease .1s, filter .8s ease .1s'
          ghost.classList.remove('ghost')
          window.setTimeout(() => {
            ghost.style.transition = ''
          }, 1000)
        }

        exitTimeoutId = null
      }, FLOAT_EXIT_MS)
    }

    const dismiss = () => {
      if (!floatEl) return
      teardownFloat()
    }

    const buildWall = () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }

      teardownFloat(true)
      colEls.length = 0
      wall.innerHTML = ''
      wall.classList.remove('lit', 'wall--static')

      if (reducedMotion) {
        wall.classList.add('wall--static')
      }

      const columns = distributeHonorsColumns(awards, columnCount)

      columns.forEach((columnAwards, columnIndex) => {
        const col = document.createElement('div')
        col.className = 'col'

        const inner = document.createElement('div')
        inner.className = 'col-inner'
        inner.innerHTML = columnAwards.map(cardHTML).join('')

        if (!reducedMotion) {
          inner.innerHTML += columnAwards.map(cardHTML).join('')
        }

        col.appendChild(inner)
        wall.appendChild(col)

        if (!reducedMotion) {
          colEls.push({
            el: inner,
            y: Math.random() * 200,
            speed: columnIndex % 2 === 0 ? 0.9 : 1.2,
          })
        }
      })
    }

    const tick = () => {
      colEls.forEach((column) => {
        column.y += column.speed
        const half = column.el.scrollHeight / 2

        if (half > 0 && column.y >= half) {
          column.y -= half
        }

        column.el.style.transform = `translateY(${-column.y}px)`
      })

      animationFrameId = window.requestAnimationFrame(tick)
    }

    const handleWallMouseOver = (event: MouseEvent) => {
      if (reducedMotion || floatEl) return

      const card = (event.target as HTMLElement).closest<HTMLDivElement>('.card')
      if (!card || card.classList.contains('ghost')) return

      const rect = card.getBoundingClientRect()
      ghostEl = card
      ghostEl.classList.add('ghost')
      wall.classList.add('lit')

      const float = document.createElement('div')
      float.className = 'awards-honors-float'
      float.style.left = `${rect.left}px`
      float.style.top = `${rect.top}px`
      float.style.width = `${rect.width}px`
      float.innerHTML = card.innerHTML
      document.body.appendChild(float)
      floatEl = float

      window.requestAnimationFrame(() => {
        if (floatEl === float) {
          float.classList.add('in')
        }
      })

      float.addEventListener('mouseleave', dismiss)
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!floatEl) return

      const rect = floatEl.getBoundingClientRect()
      const pad = FLOAT_GUARD_PAD

      if (
        event.clientX < rect.left - pad ||
        event.clientX > rect.right + pad ||
        event.clientY < rect.top - pad ||
        event.clientY > rect.bottom + pad
      ) {
        dismiss()
      }
    }

    const handleResize = () => {
      const nextColumnCount = getHonorsColumnCount(window.innerWidth)
      const nextReducedMotion = prefersReducedMotion()

      if (nextColumnCount !== columnCount || nextReducedMotion !== reducedMotion) {
        columnCount = nextColumnCount
        reducedMotion = nextReducedMotion
        buildWall()

        if (!reducedMotion) {
          animationFrameId = window.requestAnimationFrame(tick)
        }

        return
      }

      dismiss()
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      const nextReducedMotion = prefersReducedMotion()
      if (nextReducedMotion === reducedMotion) return

      reducedMotion = nextReducedMotion
      buildWall()

      if (!reducedMotion) {
        animationFrameId = window.requestAnimationFrame(tick)
      }
    }

    buildWall()

    if (!reducedMotion) {
      animationFrameId = window.requestAnimationFrame(tick)
    }

    wall.addEventListener('mouseover', handleWallMouseOver)
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', dismiss, { passive: true })
    window.addEventListener('resize', handleResize)
    motionQuery.addEventListener('change', handleMotionChange)

    return () => {
      clearExitTimeout()

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }

      wall.removeEventListener('mouseover', handleWallMouseOver)
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('resize', handleResize)
      motionQuery.removeEventListener('change', handleMotionChange)

      if (floatEl) {
        floatEl.remove()
        floatEl = null
      }

      ghostEl = null
      wall.innerHTML = ''
      wall.classList.remove('lit', 'wall--static')
    }
  }, [awards, wallRef])
}
