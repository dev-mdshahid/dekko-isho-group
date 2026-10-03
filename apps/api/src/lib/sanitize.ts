import sanitizeHtml from 'sanitize-html'

function originOf(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

export function sanitizeDescription(html: string, allowedImageOrigins: string[]): string {
  const allowed = allowedImageOrigins.map(originOf).filter(Boolean)
  return sanitizeHtml(html, {
    allowedTags: ['p', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'a', 'blockquote', 'hr', 'br', 'img', 'code'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
    },
    allowedSchemes: ['https', 'http', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
      h1: 'h2',
    },
    exclusiveFilter: (frame) => frame.tag === 'img' && !allowed.includes(originOf(String(frame.attribs.src ?? ''))),
  })
}

export function plainText(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim()
}
