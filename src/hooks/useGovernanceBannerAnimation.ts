import { type RefObject, useEffect } from 'react'
import { gsap } from 'gsap'

import { prefersReducedMotion } from '../lib/animations/prefersReducedMotion'
import { createCardCursorGlow } from '../lib/animations/sustainability/cardCursorGlow'

const ITEM_STAGGER = 0.07
const ROW_GAP = 0.2

export function useGovernanceBannerAnimation(bannerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const banner = bannerRef.current
    if (!banner) return

    const reduced = prefersReducedMotion()
    const canHover = window.matchMedia('(hover: hover)').matches
    const header = banner.querySelector<HTMLElement>('.sustain-governance-header')
    const badge = header?.querySelector<HTMLElement>('.sustain-badge')
    const title = header?.querySelector<HTMLElement>('.sustain-governance-title')
    const rows = Array.from(banner.querySelectorAll<HTMLElement>('.sustain-governance-row'))

    const rowParts = rows.map((row) => {
      const media = row.querySelector<HTMLElement>('.sustain-governance-row-media')
      const image = row.querySelector<HTMLElement>('.sustain-governance-row-image')
      const overlay = row.querySelector<HTMLElement>('.sustain-governance-row-overlay')
      const rowTitle = row.querySelector<HTMLElement>('.sustain-governance-row-title')
      const rowCount = row.querySelector<HTMLElement>('.sustain-governance-row-count')
      const items = Array.from(row.querySelectorAll<HTMLElement>('.sustain-governance-item'))
      const checks = items
        .map((item) => item.querySelector<HTMLElement>('.sustain-governance-check'))
        .filter(Boolean) as HTMLElement[]
      const labels = items
        .map((item) => item.querySelector<HTMLElement>('span'))
        .filter(Boolean) as HTMLElement[]

      return { row, media, image, overlay, rowTitle, rowCount, items, checks, labels }
    })

    const allTargets = [
      badge,
      title,
      ...rowParts.flatMap((part) => [
        part.media,
        part.image,
        part.rowTitle,
        part.rowCount,
        ...part.items,
        ...part.checks,
        ...part.labels,
      ]),
    ].filter(Boolean) as HTMLElement[]

    let revealed = false
    let hovered = false
    let observer: IntersectionObserver | null = null
    let activeTimeline: gsap.core.Timeline | null = null
    const cursorGlow = createCardCursorGlow(banner)

    const setHiddenState = () => {
      if (reduced) {
        gsap.set(allTargets, { clearProps: 'all' })
        return
      }

      if (badge) gsap.set(badge, { opacity: 0, y: 18 })
      if (title) gsap.set(title, { opacity: 0, y: 22 })

      rowParts.forEach((part) => {
        if (part.media) gsap.set(part.media, { opacity: 0, x: -28 })
        if (part.image) gsap.set(part.image, { scale: 1.1 })
        if (part.rowTitle) gsap.set(part.rowTitle, { opacity: 0, y: 14 })
        if (part.rowCount) gsap.set(part.rowCount, { opacity: 0, y: 10 })
        part.items.forEach((item) => gsap.set(item, { opacity: 0, x: -18 }))
        part.checks.forEach((check) => gsap.set(check, { scale: 0, opacity: 0 }))
        part.labels.forEach((label) => gsap.set(label, { opacity: 0, x: -8 }))
      })
    }

    const revealBanner = () => {
      if (revealed) return
      revealed = true

      if (reduced) {
        gsap.set(allTargets, { clearProps: 'all' })
        return
      }

      activeTimeline?.kill()
      const tl = gsap.timeline()
      activeTimeline = tl

      if (badge) {
        tl.to(badge, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }, 0)
      }

      if (title) {
        tl.to(title, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.08)
      }

      let cursor = 0.22

      rowParts.forEach((part, rowIndex) => {
        const rowStart = cursor + rowIndex * ROW_GAP

        if (part.media) {
          tl.to(part.media, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, rowStart)
        }

        if (part.image) {
          tl.to(part.image, { scale: 1, duration: 1.1, ease: 'power3.out' }, rowStart)
        }

        if (part.rowTitle) {
          tl.to(part.rowTitle, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, rowStart + 0.18)
        }

        if (part.rowCount) {
          tl.to(part.rowCount, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, rowStart + 0.24)
        }

        const interleavedItems = interleavePolicyItems(part.items)

        interleavedItems.forEach((item, itemIndex) => {
          const check = item.querySelector<HTMLElement>('.sustain-governance-check')
          const label = item.querySelector<HTMLElement>('span')
          const itemStart = rowStart + 0.32 + itemIndex * ITEM_STAGGER

          tl.to(item, { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' }, itemStart)

          if (check) {
            tl.to(
              check,
              { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)' },
              itemStart + 0.04,
            )
          }

          if (label) {
            tl.to(label, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, itemStart + 0.06)
          }
        })

        cursor = rowStart + 0.32 + interleavedItems.length * ITEM_STAGGER
      })
    }

    const hideBanner = () => {
      revealed = false
      activeTimeline?.kill()
      activeTimeline = null
      setHiddenState()
    }

    setHiddenState()

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealBanner()
          else hideBanner()
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px 60px 0px' },
    )

    observer.observe(banner)

    const onEnter = (event: PointerEvent) => {
      if (!canHover || reduced) return
      hovered = true
      banner.classList.add('is-hovered')
      cursorGlow?.onEnter(event)

      gsap.to(banner, {
        y: -3,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onLeave = () => {
      if (!canHover || reduced) return
      hovered = false
      banner.classList.remove('is-hovered')
      cursorGlow?.onLeave()

      gsap.to(banner, {
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const onMove = (event: PointerEvent) => {
      if (!hovered) return
      cursorGlow?.onMove(event)
    }

    const rowHoverCleanups: (() => void)[] = []

    if (canHover && !reduced) {
      rowParts.forEach((part) => {
        if (!part.image) return

        const onRowEnter = () => {
          gsap.to(part.image, {
            scale: 1.08,
            duration: 0.7,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }

        const onRowLeave = () => {
          gsap.to(part.image, {
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            overwrite: 'auto',
          })
        }

        part.row.addEventListener('pointerenter', onRowEnter)
        part.row.addEventListener('pointerleave', onRowLeave)
        rowHoverCleanups.push(() => {
          part.row.removeEventListener('pointerenter', onRowEnter)
          part.row.removeEventListener('pointerleave', onRowLeave)
        })
      })
    }

    if (canHover && !reduced) {
      banner.addEventListener('pointerenter', onEnter)
      banner.addEventListener('pointerleave', onLeave)
      banner.addEventListener('pointermove', onMove)
    }

    return () => {
      observer?.disconnect()
      activeTimeline?.kill()
      banner.removeEventListener('pointerenter', onEnter)
      banner.removeEventListener('pointerleave', onLeave)
      banner.removeEventListener('pointermove', onMove)
      rowHoverCleanups.forEach((cleanup) => cleanup())
      banner.classList.remove('is-hovered')
      cursorGlow?.kill()
      gsap.killTweensOf([banner, ...allTargets])
    }
  }, [bannerRef])
}

/** Stagger left/right columns in reading order across the row. */
function interleavePolicyItems(items: HTMLElement[]) {
  if (items.length <= 1) return items

  const lists = Array.from(
    items[0]?.closest('.sustain-governance-row')?.querySelectorAll<HTMLElement>('.sustain-governance-list') ?? [],
  )

  if (lists.length < 2) return items

  const columns = lists.map((list) =>
    Array.from(list.querySelectorAll<HTMLElement>('.sustain-governance-item')),
  )
  const maxLen = Math.max(...columns.map((col) => col.length))
  const interleaved: HTMLElement[] = []

  for (let i = 0; i < maxLen; i += 1) {
    columns.forEach((col) => {
      if (col[i]) interleaved.push(col[i])
    })
  }

  return interleaved.length ? interleaved : items
}
