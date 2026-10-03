import { config } from '../config.js'
import { createMailer, mailConfigFromEnv } from '../email/mailer.js'
import type { RenderedEmail } from '../email/templates.js'
import { logger } from '../lib/logger.js'

let mailer: ReturnType<typeof createMailer> | null = null

function getMailer() {
  if (!config.mail.enabled) return null
  mailer ??= createMailer(mailConfigFromEnv())
  return mailer
}

/** Sends in the background; email failures never break the request that triggered them. */
export function sendMail(to: string | string[], email: RenderedEmail, context: string): void {
  const m = getMailer()
  if (!m) {
    logger.info({ to, subject: email.subject, context }, 'mail disabled — skipped')
    return
  }
  m.send(to, email)
    .then((info) => logger.info({ to, context, messageId: info.messageId }, 'mail sent'))
    .catch((err) => logger.error({ err, to, context }, 'mail failed'))
}

export const mailCtx = () => ({ siteUrl: config.siteUrl, hrPortalUrl: config.hrPortalUrl })
