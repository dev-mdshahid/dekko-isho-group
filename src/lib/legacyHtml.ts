const htmlToRoute: Record<string, string> = {
  'index.html': '/',
  'home-2.html': '/home-2',
  'about.html': '/about',
  'services.html': '/services',
  'products.html': '/products',
  'case-studies.html': '/case-studies',
  'blog.html': '/blog',
  'faqs.html': '/faqs',
  'contact.html': '/contact',
  'privacy-policy.html': '/privacy-policy',
  'starter-page.html': '/starter-page',
  'utility-pages/style-guide.html': '/utility/style-guide',
  'utility-pages/instructions.html': '/utility/instructions',
  'utility-pages/licenses.html': '/utility/licenses',
  'utility-pages/changelog.html': '/utility/changelog',
}

function rewriteHref(href: string): string {
  const hashIdx = href.indexOf('#')
  const hash = hashIdx >= 0 ? href.slice(hashIdx) : ''
  const path = hashIdx >= 0 ? href.slice(0, hashIdx) : href

  if (!path || path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return href
  }

  if (path.startsWith('/')) return href

  const route = htmlToRoute[path]
  if (route) return route + hash

  if (path.startsWith('documents/')) return `/legacy/${path}`
  return href
}

export function transformLegacyHtml(html: string): string {
  return html
    .replace(/\bsrc="images\//g, 'src="/legacy/images/')
    .replace(/\bsrc="videos\//g, 'src="/legacy/videos/')
    .replace(/\bsrcset="images\//g, 'srcset="/legacy/images/')
    .replace(/,\s*images\//g, ', /legacy/images/')
    .replace(/\bhref="documents\//g, 'href="/legacy/documents/')
    .replace(/\bhref="([^"]+\.html[^"]*)"/g, (_match, href: string) => `href="${rewriteHref(href)}"`)
}
