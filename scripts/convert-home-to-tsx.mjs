import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const inputPath = join(root, 'src', 'content', 'homeBody.html')
const outDir = join(root, 'src', 'components', 'home')

const sections = [
  { name: 'ServiceSection', start: '<section class="service-section', end: '</section>' },
  { name: 'CaseStudySection', start: '<section class="case-study-section', end: '</section>' },
  { name: 'BlogSection', start: '<section class="blog-section', end: '</section>' },
]

const raw = readFileSync(inputPath, 'utf8')

function extractBlock(startMarker, endMarker, endBefore) {
  const start = raw.indexOf(startMarker)
  if (start === -1) throw new Error(`Start not found: ${startMarker}`)
  if (endBefore) {
    const end = raw.indexOf(endBefore, start)
    if (end === -1) throw new Error(`End-before not found for: ${startMarker}`)
    return raw.slice(start, end).trimEnd()
  }
  const end = raw.indexOf(endMarker, start + startMarker.length)
  if (end === -1) throw new Error(`End not found for: ${startMarker}`)
  return raw.slice(start, end + endMarker.length)
}

const VOID_TAGS = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

function htmlToJsx(html) {
  let jsx = html
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, '')
  jsx = jsx.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')

  jsx = jsx.replace(/\bclass=/g, 'className=')
  jsx = jsx.replace(/\bfor=/g, 'htmlFor=')
  jsx = jsx.replace(/\btabindex=/g, 'tabIndex=')
  jsx = jsx.replace(/\bcrossorigin=/g, 'crossOrigin=')
  jsx = jsx.replace(/\bmaxlength=/g, 'maxLength=')
  jsx = jsx.replace(/\bsrcset=/g, 'srcSet=')

  jsx = jsx.replace(/\bfetchpriority="high"/g, '')
  jsx = jsx.replace(/\breadonly\b/g, 'readOnly')
  jsx = jsx.replace(/(?<!data-)autoplay(=""|(?=\s|>))/g, 'autoPlay')
  jsx = jsx.replace(/(?<!data-)playsinline(=""|(?=\s|>))/g, 'playsInline')

  jsx = jsx.replace(/\bhidden=""/g, 'hidden')
  jsx = jsx.replace(/\bloop(=""|(?=\s|>))/g, 'loop')
  jsx = jsx.replace(/\bmuted(=""|(?=\s|>))/g, 'muted')
  jsx = jsx.replace(/\brequired(=""|(?=\s|>))/g, 'required')

  jsx = jsx.replace(/style="opacity:0"/g, '')
  jsx = jsx.replace(
    /style="background-image:url\(&quot;([^&]+)&quot;\)"/g,
    'style={{ backgroundImage: `url("$1")` }}',
  )

  const marqueeTransform = 'translate3d(0%, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)'
  jsx = jsx.replace(
    /style="-webkit-transform:translate3d\(0%, 0, 0\)[^"]+"/g,
    `style={{ transform: '${marqueeTransform}' }}`,
  )

  jsx = jsx.replace(/&#x27;/g, "'")
  jsx = jsx.replace(/&amp;/g, '&')

  for (const tag of VOID_TAGS) {
    const re = new RegExp(`<${tag}([^>]*?)(?<!\\/)>`, 'gi')
    jsx = jsx.replace(re, `<${tag}$1 />`)
  }

  jsx = jsx.replace(/<br>/g, '<br />')
  jsx = jsx.replace(/<br\/>/g, '<br />')

  jsx = jsx.replace(/src="\/legacy\/images\/([^"]+)"/g, "src={legacyImage('$1')}")
  jsx = jsx.replace(/src="\/legacy\/videos\/([^"]+)"/g, "src={legacyVideo('$1')}")
  jsx = jsx.replace(/href="\/legacy\/documents\/([^"]+)"/g, "href={legacyDoc('$1')}")

  return jsx
}

mkdirSync(outDir, { recursive: true })

for (const section of sections) {
  const html = extractBlock(section.start, section.end, section.endBefore)
  const jsx = htmlToJsx(html)

  const needsImage = jsx.includes('legacyImage(')
  const needsVideo = jsx.includes('legacyVideo(')
  const needsDoc = jsx.includes('legacyDoc(')

  const assetImportNames = [
    needsDoc ? 'legacyDoc' : null,
    needsImage ? 'legacyImage' : null,
    needsVideo ? 'legacyVideo' : null,
  ].filter(Boolean)

  const assetImports =
    assetImportNames.length > 0
      ? `import { ${assetImportNames.join(', ')} } from '../../lib/assets'\n\n`
      : ''

  const content = `${assetImports}export function ${section.name}() {
  return (
${indent(jsx, 4)}
  )
}
`

  writeFileSync(join(outDir, `${section.name}.tsx`), content, 'utf8')
  console.log(`Wrote ${section.name}.tsx`)
}

function indent(text, spaces) {
  const pad = ' '.repeat(spaces)
  return text
    .split('\n')
    .map((line) => (line.trim() ? pad + line : line))
    .join('\n')
}
