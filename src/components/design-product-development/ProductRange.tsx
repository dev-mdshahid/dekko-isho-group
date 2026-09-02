
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'

import { designProductDevelopmentProductRange } from '../../data/design-product-development/content'
import { FadeIn } from '../ui/FadeIn'
import { NoiseOverlay, SectionLines } from '../ui/SectionDecor'
import { PreSectionTitle } from '../ui/PreSectionTitle'
import Model3DViewer from './Model3DViewer'

type ProductColorId = 'default' | 'cyan' | 'magenta' | 'yellow'

const PRODUCT_COLORS: {
  id: ProductColorId
  label: string
  value: string
}[] = [
  { id: 'default', label: 'Default', value: '#f5f5f5' },
  { id: 'cyan', label: 'Cyan', value: '#00d5ff' },
  { id: 'magenta', label: 'Magenta', value: '#ff2fc3' },
  { id: 'yellow', label: 'Yellow', value: '#ffd91a' },
]

const ProductRange = () => {
  const { id, badge, title, items } = designProductDevelopmentProductRange
  const [selectedColors, setSelectedColors] = useState<Record<string, ProductColorId>>({})
  const [openPickerId, setOpenPickerId] = useState<string | null>(null)
  const pickerRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const handleDocumentPointerDown = (event: globalThis.PointerEvent) => {
      if (!openPickerId) return

      const activePicker = pickerRefs.current[openPickerId]

      if (activePicker?.contains(event.target as Node)) return

      setOpenPickerId(null)
    }

    const handleDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPickerId(null)
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown)
    document.addEventListener('keydown', handleDocumentKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown)
      document.removeEventListener('keydown', handleDocumentKeyDown)
    }
  }, [openPickerId])

  const stopPickerPointer = (event: PointerEvent) => {
    event.stopPropagation()
  }

  return (
    <section id={id} className="dpd-product-range-section">
      <div className="dpd-product-range-container">
        <FadeIn
          id="dpd-product-range-header"
          className="dpd-product-range-header"
          variant="slide-in-bottom"
        >
          <PreSectionTitle title={badge} />
          <h2 className="dpd-product-range-title">{title}</h2>
        </FadeIn>

        <div className="dpd-product-range-grid" data-solution-animate-group>
          {items.map((item) => (
            <article
              key={item.id}
              id={`dpd-product-range-${item.id}`}
              className={`dpd-product-range-card ${item.model3d ? 'dpd-product-range-card--3d' : ''}`}
              style={{ '--dpd-product-card-bg': item.background } as CSSProperties}
            >
              <div className="dpd-product-range-card-visual">
                {item.model3d ? (
                  <Model3DViewer
                    modelPath={item.model3d}
                    label={item.label}
                    color={selectedColors[item.id] ?? 'default'}
                  />
                ) : item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="dpd-product-range-card-image"
                  />
                ) : (
                  <div className="dpd-product-range-card-placeholder" aria-hidden="true" />
                )}
              </div>
              {item.model3d ? (
                <div
                  ref={(node) => {
                    pickerRefs.current[item.id] = node
                  }}
                  className="dpd-product-range-color-picker"
                  onPointerDown={stopPickerPointer}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="dpd-product-range-color-trigger"
                    aria-label={`Choose color for ${item.label}`}
                    aria-expanded={openPickerId === item.id}
                    aria-controls={`dpd-product-range-color-menu-${item.id}`}
                    onClick={() => {
                      setOpenPickerId((currentId) => (currentId === item.id ? null : item.id))
                    }}
                  >
                    <span
                      className="dpd-product-range-color-swatch"
                      style={{
                        '--dpd-product-color': PRODUCT_COLORS.find(
                          (colorOption) =>
                            colorOption.id === (selectedColors[item.id] ?? 'default'),
                        )?.value,
                      } as CSSProperties}
                      aria-hidden="true"
                    />
                  </button>

                  {openPickerId === item.id ? (
                    <div
                      id={`dpd-product-range-color-menu-${item.id}`}
                      className="dpd-product-range-color-menu"
                      role="menu"
                      aria-label={`Color options for ${item.label}`}
                    >
                      {PRODUCT_COLORS.map((colorOption) => {
                        const isSelected =
                          (selectedColors[item.id] ?? 'default') === colorOption.id

                        return (
                          <button
                            key={colorOption.id}
                            type="button"
                            className={`dpd-product-range-color-option ${
                              isSelected ? 'is-selected' : ''
                            }`}
                            aria-label={`Select ${colorOption.label.toLowerCase()} color`}
                            aria-checked={isSelected}
                            role="menuitemradio"
                            onClick={() => {
                              setSelectedColors((currentColors) => ({
                                ...currentColors,
                                [item.id]: colorOption.id,
                              }))
                              setOpenPickerId(null)
                            }}
                          >
                            <span
                              className="dpd-product-range-color-swatch"
                              style={
                                {
                                  '--dpd-product-color': colorOption.value,
                                } as CSSProperties
                              }
                              aria-hidden="true"
                            />
                            <span className="sr-only">{colorOption.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="dpd-product-range-card-overlay" aria-hidden="true" />
              <h3 className="dpd-product-range-card-title">{item.label}</h3>
            </article>
          ))}
        </div>
      </div>

      <SectionLines border="grey" />
      <NoiseOverlay />
    </section>
  )
}

export default ProductRange
