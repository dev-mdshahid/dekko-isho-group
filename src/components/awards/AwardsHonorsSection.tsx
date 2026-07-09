import { useEffect, useRef } from 'react'

import { awardHonors, awardsHonorsContent } from '../../data/awards/honors'

type Award = {
  img: string
  title: string
  org: string
  yr: string
}

function cardHTML(a: Award) {
  return `<div class="card" data-title="${a.title}" data-org="${a.org}" data-yr="${a.yr}" data-img="${a.img}">
    <div class="ph"><img src="${a.img}" alt="${a.title}" loading="lazy"></div>
    <div class="cap">
      <div class="top"><h4>${a.title}</h4><span class="yr">${a.yr}</span></div>
      <p>${a.org}</p>
    </div>
  </div>`
}

function getNumCols() {
  return window.innerWidth <= 680 ? 2 : window.innerWidth <= 1000 ? 3 : 4
}

function estimateCardBlockHeight() {
  const phHeight = window.innerWidth <= 680 ? 200 : 250
  return phHeight + 18
}

function distributeAwards(awards: Award[], numCols: number) {
  const cols: Award[][] = Array.from({ length: numCols }, () => [])
  awards.forEach((award, index) => {
    cols[index % numCols].push(award)
  })
  return cols.map((col) => (col.length > 0 ? col : [...awards]))
}

function expandColumnItems(baseItems: Award[], minCount: number) {
  const items = [...baseItems]
  let index = 0

  while (items.length < minCount) {
    items.push(baseItems[index++ % baseItems.length])
  }

  return items
}

function buildColumnContent(awards: Award[], numCols: number, loopDurationSec: number) {
  const cardBlockHeight = estimateCardBlockHeight()
  const targetLoopHeight = 54 * loopDurationSec
  const minCards = Math.ceil(targetLoopHeight / cardBlockHeight)

  return distributeAwards(awards, numCols).map((col) => expandColumnItems(col, minCards))
}

const LOOP_DURATION_SEC = 120

export function AwardsHonorsSection() {
  const wallRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wall = wallRef.current
    if (!wall) return

    const awards: Award[] = awardHonors.map((a) => ({
      img: a.image,
      title: a.title,
      org: a.category,
      yr: a.year,
    }))

    const numCols = getNumCols()
    const cols = buildColumnContent(awards, numCols, LOOP_DURATION_SEC)

    const colEls: { el: HTMLDivElement; y: number; speed: number }[] = []
    cols.forEach((columnItems, ci) => {
      const col = document.createElement('div')
      col.className = 'col'
      const inner = document.createElement('div')
      inner.className = 'col-inner'
      inner.innerHTML = columnItems.map(cardHTML).join('') + columnItems.map(cardHTML).join('')
      col.appendChild(inner)
      wall.appendChild(col)

      const loopHeight = inner.scrollHeight / 2
      const speedVariation = ci % 2 === 0 ? 0.92 : 1.08
      colEls.push({
        el: inner,
        y: Math.random() * Math.min(loopHeight, 200),
        speed: (loopHeight / LOOP_DURATION_SEC) * speedVariation,
      })
    })

    let rafId = 0
    let lastTime = performance.now()

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      colEls.forEach((c) => {
        c.y += c.speed * dt
        const half = c.el.scrollHeight / 2
        if (c.y >= half) c.y -= half
        c.el.style.transform = `translateY(${-c.y}px)`
      })
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // detach-and-pin hover system
    let float: HTMLDivElement | null = null
    let ghost: HTMLElement | null = null

    function dismiss() {
      if (!float) return
      const f = float
      const g = ghost
      float = null
      ghost = null
      wall!.classList.remove('lit')
      f.classList.remove('in')
      f.classList.add('out')
      setTimeout(() => {
        f.remove()
        if (g) {
          g.style.transition = 'opacity .8s ease .1s, filter .8s ease .1s'
          g.classList.remove('ghost')
          setTimeout(() => {
            g.style.transition = ''
          }, 1000)
        }
      }, 450)
    }

    function handleMouseOver(e: MouseEvent) {
      if (float) return
      const card = (e.target as HTMLElement).closest('.card') as HTMLElement | null
      if (!card || card.classList.contains('ghost')) return

      const r = card.getBoundingClientRect()
      ghost = card
      ghost.classList.add('ghost')
      wall!.classList.add('lit')

      float = document.createElement('div')
      float.className = 'awards-honors-float'
      float.style.left = `${r.left}px`
      float.style.top = `${r.top}px`
      float.style.width = `${r.width}px`
      float.innerHTML = card.innerHTML
      document.body.appendChild(float)
      requestAnimationFrame(() => {
        if (float) float.classList.add('in')
      })

      float.addEventListener('mouseleave', dismiss)
    }

    function handleMouseMove(e: MouseEvent) {
      if (!float) return
      const r = float.getBoundingClientRect()
      const pad = 6
      if (
        e.clientX < r.left - pad ||
        e.clientX > r.right + pad ||
        e.clientY < r.top - pad ||
        e.clientY > r.bottom + pad
      ) {
        dismiss()
      }
    }

    wall.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', dismiss, { passive: true })
    window.addEventListener('resize', dismiss)

    return () => {
      cancelAnimationFrame(rafId)
      wall.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('resize', dismiss)
      if (float) float.remove()
      wall.innerHTML = ''
    }
  }, [])

  return (
    <section className="awards-honors-section">
      <div className="s-head">
        <span className="pill">
          <span className="sq" />
          {awardsHonorsContent.tag}
        </span>
        <h2 className="awards-grid-section__title">{awardsHonorsContent.title}</h2>
        <p className="awards-grid-section__description">{awardsHonorsContent.description}</p>
      </div>
      <div className="wall" ref={wallRef} />
    </section>
  )
}
