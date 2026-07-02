import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const indexPath = join(root, 'public', 'legacy', 'index.html')
const outPath = join(root, 'src', 'content', 'homeBody.html')

const htmlToRoute = {
  'index.html': '/',
  'home-2.html': '/home-2',
  'about.html': '/about',
  'services.html': '/services',
  'products.html': '/products',
  'case-studies.html': '/case-studies',
  'blog.html': '/press',
  'faqs.html': '/faqs',
  'contact.html': '/contact',
  'privacy-policy.html': '/privacy-policy',
  'starter-page.html': '/starter-page',
  'utility-pages/style-guide.html': '/utility/style-guide',
  'utility-pages/instructions.html': '/utility/instructions',
  'utility-pages/licenses.html': '/utility/licenses',
  'utility-pages/changelog.html': '/utility/changelog',
}

function rewriteHref(href) {
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

function transformLegacyHtml(html) {
  return html
    .replace(/\bsrc="images\//g, 'src="/legacy/images/')
    .replace(/\bsrc="videos\//g, 'src="/legacy/videos/')
    .replace(/\bsrcset="images\//g, 'srcset="/legacy/images/')
    .replace(/,\s*images\//g, ', /legacy/images/')
    .replace(/\bhref="documents\//g, 'href="/legacy/documents/')
    .replace(/\bhref="([^"]+\.html[^"]*)"/g, (_match, href) => `href="${rewriteHref(href)}"`)
}

const raw = readFileSync(indexPath, 'utf8')
const heroStart = raw.indexOf('<section class="hero-section')
const footerStart = raw.indexOf('<section id="Footer"')

if (heroStart === -1 || footerStart === -1) {
  throw new Error('Could not find hero or footer markers in index.html')
}

const body = raw.slice(heroStart, footerStart).trim()
const transformed = transformLegacyHtml(body)

mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, transformed, 'utf8')
console.log(`Wrote ${outPath} (${transformed.length} chars)`)
