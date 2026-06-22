import { galleryItems, GALLERY_PLACEHOLDER_IMAGE } from '../../data/gallery/galleryItems'
import { FadeIn } from '../ui/FadeIn'

export function GalleryGridSection() {
  return (
    <section className="gallery-section">
      <div className="container-gallery">
        <div className="gallery-grid" role="list">
          {galleryItems.map((item, index) => (
            <FadeIn key={item.id} id={`gallery-item-${index}`}>
              <div className="gallery-item" role="listitem">
                <img
                  src={GALLERY_PLACEHOLDER_IMAGE}
                  loading="lazy"
                  alt={item.alt}
                  className="gallery-image"
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
