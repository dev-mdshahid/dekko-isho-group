export type LayoutVariant = 'main' | 'home2' | 'none'

export type LegacyRoute = {
  path: string
  file: string
  title: string
  layout: LayoutVariant
}

export const legacyRoutes: LegacyRoute[] = [
  { path: '/home-2', file: 'home-2.html', title: 'Home 2 | Manufactt - Webflow HTML website template', layout: 'home2' },
  { path: '/about', file: 'about.html', title: 'About | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/services', file: 'services.html', title: 'Services | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/products', file: 'products.html', title: 'product | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/case-studies', file: 'case-studies.html', title: 'Case Study| Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/blog', file: 'blog.html', title: 'Blog | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/faqs', file: 'faqs.html', title: 'FAQs | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/contact', file: 'contact.html', title: 'Contact | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/privacy-policy', file: 'privacy-policy.html', title: 'Privacy Policy | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/starter-page', file: 'starter-page.html', title: 'Starter page | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/401', file: '401.html', title: 'Password Protected - Saash - Webflow Ecommerce Website Template', layout: 'none' },
  { path: '/404', file: '404.html', title: 'Page Not Found - Saash - Webflow Ecommerce Website Template', layout: 'main' },
  { path: '/utility/style-guide', file: 'utility-pages/style-guide.html', title: 'Style guide | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/utility/instructions', file: 'utility-pages/instructions.html', title: 'Instructions | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/utility/licenses', file: 'utility-pages/licenses.html', title: 'Licenses | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/utility/changelog', file: 'utility-pages/changelog.html', title: 'Changelog | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/services/:slug', file: 'detail_service.html', title: 'Service detail | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/blog/:slug', file: 'detail_blog.html', title: 'Blog detail | Manufactt - Webflow HTML website template', layout: 'main' },
  { path: '/case-studies/:slug', file: 'detail_case-study.html', title: 'Case Study detail | Manufactt - Webflow HTML website template', layout: 'main' },
]
