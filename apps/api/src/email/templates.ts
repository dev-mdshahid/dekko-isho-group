import { convert } from 'html-to-text'
import {
  button,
  callout,
  detailsCard,
  escapeHtml,
  heading,
  layout,
  listTable,
  paragraph,
  statRow,
  steps,
} from './layout.js'

export type RenderedEmail = { subject: string; html: string; text: string }

type Ctx = { siteUrl: string; hrPortalUrl?: string }

const portal = (ctx: Ctx) => ctx.hrPortalUrl ?? `${ctx.siteUrl}/hr/admin`

function finish(subject: string, html: string): RenderedEmail {
  const text = convert(html, {
    wordwrap: 80,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { hideLinkHrefIfSameAsText: true } },
      { selector: 'table', format: 'dataTable' },
    ],
  })
  return { subject, html, text }
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || 'there'
}

// ── Applicant ────────────────────────────────────────────────────────────────

export type ApplicationReceivedData = {
  applicantName: string
  jobTitle: string
  department?: string
  location?: string
  jobType?: string
  referenceId: string
  submittedAt: string
}

export function applicationReceived(ctx: Ctx, d: ApplicationReceivedData): RenderedEmail {
  const body = [
    paragraph(`Hi ${escapeHtml(firstName(d.applicantName))},`),
    paragraph(
      `Thank you for applying for <strong style="color:#151515;">${escapeHtml(d.jobTitle)}</strong> at Dekko ISHO Group. We've received your application and CV, and our recruitment team will review them carefully.`,
    ),
    detailsCard([
      ['Role', d.jobTitle],
      ['Department', d.department],
      ['Location', d.location],
      ['Job type', d.jobType],
      ['Submitted', d.submittedAt],
      ['Reference', d.referenceId],
    ]),
    heading('What happens next'),
    steps([
      { title: 'Review', text: 'Our team reviews every application against the role requirements.' },
      { title: 'Shortlist', text: "If your profile is a strong match, we'll contact you by phone or email." },
      { title: 'Interview', text: "Shortlisted candidates are invited to meet the team and learn more about the role." },
    ]),
    callout(
      `Please keep your reference number <strong style="color:#151515;">${escapeHtml(d.referenceId)}</strong> handy if you contact us about this application.`,
    ),
    paragraph('While you wait, take a look at other opportunities across the group.'),
    button('Explore open roles', `${ctx.siteUrl}/career/jobs`),
    paragraph(`<span style="display:block;margin-top:24px;">Best of luck,<br /><strong style="color:#151515;">Talent Acquisition Team</strong><br />Dekko ISHO Group</span>`),
  ].join('')

  return finish(
    `We've received your application – ${d.jobTitle}`,
    layout({
      siteUrl: ctx.siteUrl,
      preheader: `Thanks for applying for ${d.jobTitle}. Here's what happens next.`,
      eyebrow: 'Application received',
      title: 'Thank you for applying',
      body,
    }),
  )
}

export type TalentPoolData = {
  applicantName: string
  interests?: string
  referenceId: string
}

export function talentPoolAcknowledgement(ctx: Ctx, d: TalentPoolData): RenderedEmail {
  const body = [
    paragraph(`Hi ${escapeHtml(firstName(d.applicantName))},`),
    paragraph(
      "Thank you for sharing your CV with Dekko ISHO Group. You're now part of our talent network, and we'll reach out when a role opens that matches your experience.",
    ),
    detailsCard([
      ['Interested in', d.interests],
      ['Reference', d.referenceId],
    ]),
    heading('How it works'),
    steps([
      { title: 'Your profile stays on file', text: 'Our recruiters search the talent network whenever a new role opens.' },
      { title: 'We match you to roles', text: "When your skills fit an opening, we'll get in touch directly." },
      { title: 'Apply any time', text: 'You can still apply for any open role on our careers page.' },
    ]),
    button('See current openings', `${ctx.siteUrl}/career/jobs`),
    paragraph(`<span style="display:block;margin-top:24px;">Warm regards,<br /><strong style="color:#151515;">Talent Acquisition Team</strong><br />Dekko ISHO Group</span>`),
  ].join('')

  return finish(
    "You're in our talent network – Dekko ISHO Group",
    layout({
      siteUrl: ctx.siteUrl,
      preheader: "Thanks for your CV. We'll be in touch when a matching role opens.",
      eyebrow: 'Talent network',
      title: "We've got your CV",
      body,
    }),
  )
}

// ── HR staff ─────────────────────────────────────────────────────────────────

export type HrInviteData = {
  name?: string
  email: string
  role: string
  invitedBy: string
  setPasswordUrl: string
}

export function hrInvite(ctx: Ctx, d: HrInviteData): RenderedEmail {
  const body = [
    paragraph(`Hi ${escapeHtml(d.name ? firstName(d.name) : 'there')},`),
    paragraph(
      `${escapeHtml(d.invitedBy)} has given you access to the Dekko ISHO Group HR Portal, where you can manage job circulars and search the CV Bank.`,
    ),
    detailsCard([
      ['Sign-in email', d.email],
      ['Access level', d.role],
    ]),
    paragraph('Set your password to activate your account:'),
    button('Set your password', d.setPasswordUrl),
    callout('For your security, this link expires in 1 hour. If it has expired, ask your HR admin to resend the invite.'),
    paragraph(
      `<span style="font-size:13px;color:#6B7078;">After setting your password, sign in any time at <a href="${portal(ctx)}" style="color:#1C72A3;">${escapeHtml(portal(ctx).replace(/^https?:\/\//, ''))}</a>.</span>`,
    ),
  ].join('')

  return finish(
    "You've been invited to the Dekko ISHO Group HR Portal",
    layout({
      siteUrl: ctx.siteUrl,
      preheader: 'Set your password to start managing circulars and the CV Bank.',
      eyebrow: 'HR Portal',
      title: 'Welcome to the HR Portal',
      body,
      audience: 'staff',
    }),
  )
}

export type PasswordResetData = { name?: string; resetUrl: string }

export function passwordReset(ctx: Ctx, d: PasswordResetData): RenderedEmail {
  const body = [
    paragraph(`Hi ${escapeHtml(d.name ? firstName(d.name) : 'there')},`),
    paragraph('We received a request to reset the password for your HR Portal account.'),
    button('Reset password', d.resetUrl),
    callout("This link expires in 1 hour. If you didn't ask for this, you can safely ignore this email — your password won't change."),
  ].join('')

  return finish(
    'Reset your HR Portal password',
    layout({
      siteUrl: ctx.siteUrl,
      preheader: 'Use this link to choose a new password.',
      eyebrow: 'HR Portal',
      title: 'Reset your password',
      body,
      audience: 'staff',
    }),
  )
}

export type DigestData = {
  recipientName?: string
  dateLabel: string
  totalNew: number
  openCirculars: number
  closingSoon: number
  byCircular: Array<{ jobTitle: string; department: string; newCount: number; url: string }>
}

export function newApplicationsDigest(ctx: Ctx, d: DigestData): RenderedEmail {
  const body = [
    paragraph(`Good morning${d.recipientName ? `, ${escapeHtml(firstName(d.recipientName))}` : ''}. Here's what came in yesterday.`),
    statRow([
      { label: 'New applications', value: d.totalNew },
      { label: 'Open circulars', value: d.openCirculars },
      { label: 'Closing this week', value: d.closingSoon },
    ]),
    d.byCircular.length
      ? listTable(
          ['Circular', 'Department', 'New'],
          d.byCircular.map((row) => [
            { text: row.jobTitle, href: row.url },
            { text: row.department },
            { text: String(row.newCount), strong: true },
          ]),
        )
      : callout('No new applications yesterday.'),
    button('Open the CV Bank', `${portal(ctx)}/cv-bank?status=new`),
  ].join('')

  return finish(
    `${d.totalNew} new application${d.totalNew === 1 ? '' : 's'} – ${d.dateLabel}`,
    layout({
      siteUrl: ctx.siteUrl,
      preheader: `${d.totalNew} new applications across ${d.byCircular.length} circulars.`,
      eyebrow: `Daily digest · ${d.dateLabel}`,
      title: 'New applications',
      body,
      audience: 'staff',
    }),
  )
}

export type ContactMessageData = {
  name: string
  email: string
  phone?: string
  message: string
  source: string
  receivedAt: string
}

export function contactMessage(ctx: Ctx, d: ContactMessageData): RenderedEmail {
  const body = [
    paragraph('A new message was sent from the website contact form.'),
    detailsCard([
      ['Name', d.name],
      ['Email', d.email],
      ['Phone', d.phone],
      ['Page', d.source],
      ['Received', d.receivedAt],
    ]),
    heading('Message'),
    callout(escapeHtml(d.message).replace(/\n/g, '<br />')),
    button(`Reply to ${firstName(d.name)}`, `mailto:${d.email}`),
  ].join('')

  return finish(
    `Website enquiry from ${d.name}`,
    layout({
      siteUrl: ctx.siteUrl,
      preheader: d.message.slice(0, 120),
      eyebrow: 'Website enquiry',
      title: `Message from ${d.name}`,
      body,
      audience: 'staff',
    }),
  )
}

export type CircularClosingData = {
  ownerName?: string
  jobTitle: string
  deadline: string
  applications: number
  shortlisted: number
  state: 'closing_soon' | 'closed'
  manageUrl: string
}

export function circularClosing(ctx: Ctx, d: CircularClosingData): RenderedEmail {
  const closed = d.state === 'closed'
  const body = [
    paragraph(`Hi ${escapeHtml(d.ownerName ? firstName(d.ownerName) : 'there')},`),
    paragraph(
      closed
        ? `<strong style="color:#151515;">${escapeHtml(d.jobTitle)}</strong> reached its deadline and is no longer accepting applications.`
        : `<strong style="color:#151515;">${escapeHtml(d.jobTitle)}</strong> closes on <strong style="color:#151515;">${escapeHtml(d.deadline)}</strong>. Extend the deadline if you'd like more applicants.`,
    ),
    statRow([
      { label: 'Applications', value: d.applications },
      { label: 'Shortlisted', value: d.shortlisted },
    ]),
    button(closed ? 'Review applicants' : 'Manage circular', d.manageUrl),
  ].join('')

  return finish(
    closed ? `Closed: ${d.jobTitle}` : `Closing soon: ${d.jobTitle}`,
    layout({
      siteUrl: ctx.siteUrl,
      preheader: closed
        ? `${d.applications} applications received. Time to review.`
        : `Deadline ${d.deadline}. ${d.applications} applications so far.`,
      eyebrow: closed ? 'Circular closed' : 'Closing soon',
      title: d.jobTitle,
      body,
      audience: 'staff',
    }),
  )
}
