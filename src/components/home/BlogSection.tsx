import { legacyImage } from '../../lib/assets'

export function BlogSection() {
  return (
    <section className="blog-section section-spacing-bottom">
        <div className="container">
          <div className="w-layout-grid grid-blog">
            <div className="blog-left-wrap">
              <div data-w-id="29f61eb0-4f9c-cf25-09b0-73d9f161bc19" data-fade-in className="section-title-left">
                <div data-wf--pre-section-title--variant="base" className="pre-section-title-wrap">
                  <div className="pre-section-title-inner">
                    <div className="pre-section-title-square"></div>
                    <div className="pre-section-title">Insights & Article</div>
                  </div>
                </div>
                <h2 className="section-title">Latest from our <span className="text-linear-gradient">blog</span></h2>
                <div className="blog-button">
                  <a data-wf--button-arrow--variant="base" href="/blog" className="primary-button w-inline-block">
                    <div className="button-primary-inner">
                      <div className="button-text-wrap">
                        <div className="button-text-inner">
                          <div className="button-text">view all blog</div>
                          <div className="button-hover-text">view all blog</div>
                        </div>
                      </div>
                      <div className="button-icon-bg"><img src={legacyImage('button-icon.svg')} loading="eager" alt="Arrow" className="button-icon" /><img src={legacyImage('button-icon.svg')} loading="lazy" alt="Arrow" className="button-icon-hover" /></div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            <div className="blog-right-wrap">
              <div className="blog-list-wrapper w-dyn-list">
                <div role="list" className="blog-list w-dyn-items">
                  <div data-w-id="9aa8b664-97ad-49c4-09c4-74aca1f730e4" data-fade-in role="listitem" className="w-dyn-item">
                    <a data-w-id="885795f8-d346-8011-0579-09deed66996f" href="#" className="blog-link w-inline-block">
                      <div className="blog-image-wrap"><img src="https://d3e54v103j8qbb.cloudfront.net/plugins/Basic/assets/placeholder.60f9b1840c.svg" loading="lazy" data-w-id="7809f243-3f4a-e8e3-4d39-f009bca40867" alt="Blog Image" className="blog-image w-dyn-bind-empty" />
                        <div className="blog-layout">
                          <h3 className="blog-title w-dyn-bind-empty"></h3>
                          <div className="blog-link-inner">Read full blog</div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="empty-state w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}
