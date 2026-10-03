import { brand } from './brand.js'

const { colors: c, fonts: f } = brand

export function escapeHtml(value: string | number | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export type LayoutOptions = {
  siteUrl: string
  preheader: string
  eyebrow?: string
  title: string
  body: string
  /** Applicant emails show the public footer; internal HR emails show a short one. */
  audience?: 'public' | 'staff'
}

export function heading(text: string): string {
  return `<h2 style="margin:28px 0 12px;font-family:${f.heading};font-size:18px;line-height:26px;font-weight:600;color:${c.ink};">${escapeHtml(text)}</h2>`
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-family:${f.body};font-size:15px;line-height:24px;color:${c.inkSoft};">${html}</p>`
}

export function button(label: string, href: string): string {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 8px;">
  <tr>
    <td align="center" bgcolor="${c.primary}" style="border-radius:999px;background:${c.primary};">
      <a href="${escapeHtml(href)}" target="_blank"
        style="display:inline-block;padding:14px 28px;font-family:${f.heading};font-size:15px;line-height:20px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">
        ${escapeHtml(label)}&nbsp;&rarr;
      </a>
    </td>
  </tr>
</table>`
}

export function detailsCard(rows: Array<[label: string, value: string | null | undefined]>): string {
  const visible = rows.filter(([, v]) => v != null && String(v).trim() !== '')
  const cells = visible
    .map(
      ([label, value], i) => `
  <tr>
    <td style="padding:12px 20px;${i ? `border-top:1px solid ${c.line};` : ''}font-family:${f.body};font-size:13px;line-height:20px;color:${c.muted};width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:12px 20px;${i ? `border-top:1px solid ${c.line};` : ''}font-family:${f.heading};font-size:14px;line-height:20px;font-weight:600;color:${c.ink};vertical-align:top;">${escapeHtml(value)}</td>
  </tr>`,
    )
    .join('')
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
  style="margin:8px 0 24px;border:1px solid ${c.line};border-radius:12px;border-collapse:separate;background:${c.page};">
  ${cells}
</table>`
}

export function steps(items: Array<{ title: string; text: string }>): string {
  const rows = items
    .map(
      (item, i) => `
  <tr>
    <td width="36" style="vertical-align:top;padding:0 0 18px;">
      <div style="width:28px;height:28px;border-radius:999px;background:${c.tint};color:${c.primaryDark};font-family:${f.heading};font-size:13px;font-weight:700;line-height:28px;text-align:center;">${i + 1}</div>
    </td>
    <td style="vertical-align:top;padding:2px 0 18px 8px;">
      <div style="font-family:${f.heading};font-size:15px;line-height:22px;font-weight:600;color:${c.ink};">${escapeHtml(item.title)}</div>
      <div style="font-family:${f.body};font-size:14px;line-height:22px;color:${c.muted};">${escapeHtml(item.text)}</div>
    </td>
  </tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 8px;">${rows}</table>`
}

export function callout(html: string): string {
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;">
  <tr>
    <td style="border-left:3px solid ${c.primary};background:${c.tint};border-radius:0 10px 10px 0;padding:14px 18px;font-family:${f.body};font-size:14px;line-height:22px;color:${c.inkSoft};">${html}</td>
  </tr>
</table>`
}

export function statRow(stats: Array<{ label: string; value: string | number }>): string {
  const width = Math.floor(100 / stats.length)
  const cells = stats
    .map(
      (s) => `
    <td width="${width}%" style="padding:16px 12px;text-align:center;background:${c.page};border:1px solid ${c.line};border-radius:12px;">
      <div style="font-family:${f.heading};font-size:26px;line-height:32px;font-weight:700;color:${c.navy};">${escapeHtml(s.value)}</div>
      <div style="font-family:${f.body};font-size:12px;line-height:18px;color:${c.muted};text-transform:uppercase;letter-spacing:0.06em;">${escapeHtml(s.label)}</div>
    </td>`,
    )
    .join('<td width="8" style="font-size:0;line-height:0;">&nbsp;</td>')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;border-collapse:separate;"><tr>${cells}</tr></table>`
}

export function listTable(
  columns: string[],
  rows: Array<Array<{ text: string; href?: string; strong?: boolean }>>,
): string {
  const head = columns
    .map(
      (col) =>
        `<th align="left" style="padding:10px 14px;font-family:${f.body};font-size:12px;line-height:16px;font-weight:500;color:${c.muted};text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid ${c.line};">${escapeHtml(col)}</th>`,
    )
    .join('')
  const body = rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => {
            const text = escapeHtml(cell.text)
            const content = cell.href
              ? `<a href="${escapeHtml(cell.href)}" style="color:${c.primaryDark};text-decoration:none;font-weight:600;">${text}</a>`
              : text
            return `<td style="padding:12px 14px;border-bottom:1px solid ${c.line};font-family:${cell.strong || cell.href ? f.heading : f.body};font-size:14px;line-height:20px;color:${cell.strong ? c.ink : c.inkSoft};${cell.strong ? 'font-weight:600;' : ''}">${content}</td>`
          })
          .join('')}</tr>`,
    )
    .join('')
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px;border-collapse:collapse;"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`
}

function publicFooter(siteUrl: string): string {
  const social = brand.social
    .map(
      (s) =>
        `<a href="${s.href}" target="_blank" style="color:#ffffff;text-decoration:none;font-family:${f.heading};font-size:13px;font-weight:600;">${s.label}</a>`,
    )
    .join(`<span style="color:#5C6670;">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>`)
  return `
<tr>
  <td bgcolor="${c.ink}" style="background:${c.ink};padding:32px 40px 28px;border-radius:0 0 20px 20px;" class="px">
    <img src="${siteUrl}/images/footer-logo.png" width="120" height="48" alt="${brand.name}" style="display:block;border:0;width:120px;height:48px;margin:0 0 18px;" />
    <div style="font-family:${f.body};font-size:13px;line-height:20px;color:#A7AEB5;margin:0 0 14px;">${escapeHtml(brand.contact.address)}</div>
    <div style="font-family:${f.body};font-size:13px;line-height:20px;margin:0 0 20px;">
      <a href="${brand.contact.phoneHref}" style="color:#D8DCDF;text-decoration:none;">${brand.contact.phone}</a>
      <span style="color:#5C6670;">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <a href="mailto:${brand.contact.email}" style="color:#D8DCDF;text-decoration:none;">${brand.contact.email}</a>
    </div>
    <div style="margin:0 0 20px;">${social}</div>
    <div style="border-top:1px solid #2A2E33;padding-top:16px;font-family:${f.body};font-size:12px;line-height:18px;color:#7C858D;">
      &copy; ${new Date().getFullYear()} ${brand.name}. You're receiving this because you applied or registered on
      <a href="${siteUrl}" style="color:#A7AEB5;text-decoration:underline;">our careers site</a>.
    </div>
  </td>
</tr>`
}

function staffFooter(): string {
  return `
<tr>
  <td bgcolor="${c.ink}" style="background:${c.ink};padding:22px 40px;border-radius:0 0 20px 20px;font-family:${f.body};font-size:12px;line-height:18px;color:#7C858D;" class="px">
    ${brand.name} &middot; HR Portal &middot; This is an internal message for HR staff only.
  </td>
</tr>`
}

export function layout(opts: LayoutOptions): string {
  const siteUrl = opts.siteUrl.replace(/\/$/, '')
  const eyebrow = opts.eyebrow
    ? `<div style="font-family:${f.heading};font-size:12px;line-height:16px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#BFE3F7;margin:0 0 10px;">${escapeHtml(opts.eyebrow)}</div>`
    : ''

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>${escapeHtml(opts.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=Mona+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    body { margin:0; padding:0; background:${c.page}; -webkit-text-size-adjust:100%; }
    a { color:${c.primaryDark}; }
    @media (max-width: 620px) {
      .container { width:100% !important; }
      .px { padding-left:24px !important; padding-right:24px !important; }
      .hero-title { font-size:26px !important; line-height:32px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${c.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${escapeHtml(opts.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${c.page}" style="background:${c.page};">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

          <tr>
            <td bgcolor="${c.navy}" class="px"
              style="background:${c.navy};background-image:linear-gradient(135deg, ${c.primary} 0%, ${c.navy} 100%);padding:28px 40px 36px;border-radius:20px 20px 0 0;">
              <a href="${siteUrl}" target="_blank" style="text-decoration:none;">
                <img src="${siteUrl}/images/footer-logo.png" width="140" height="56" alt="${brand.name}" style="display:block;border:0;width:140px;height:56px;margin:0 0 28px;" />
              </a>
              ${eyebrow}
              <h1 class="hero-title" style="margin:0;font-family:${f.heading};font-size:30px;line-height:38px;font-weight:700;color:#ffffff;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>

          <tr>
            <td style="font-size:0;line-height:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td height="4" bgcolor="${c.primary}" style="background:${c.primary};font-size:0;line-height:0;">&nbsp;</td>
                <td height="4" bgcolor="${c.amaranth}" style="background:${c.amaranth};font-size:0;line-height:0;">&nbsp;</td>
                <td height="4" bgcolor="${c.green}" style="background:${c.green};font-size:0;line-height:0;">&nbsp;</td>
              </tr></table>
            </td>
          </tr>

          <tr>
            <td bgcolor="${c.card}" class="px" style="background:${c.card};padding:36px 40px 28px;">
              ${opts.body}
            </td>
          </tr>

          ${opts.audience === 'staff' ? staffFooter() : publicFooter(siteUrl)}

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
