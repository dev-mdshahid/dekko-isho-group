import nodemailer, { type Transporter } from 'nodemailer'
import type { RenderedEmail } from './templates.js'

export type MailConfig = {
  user: string
  appPassword: string
  fromName: string
  replyTo?: string
}

export function mailConfigFromEnv(env: NodeJS.ProcessEnv = process.env): MailConfig {
  const user = env.MAIL_USER?.trim()
  const appPassword = env.MAIL_APP_PASSWORD?.replace(/\s+/g, '')
  if (!user || !appPassword) {
    throw new Error('MAIL_USER and MAIL_APP_PASSWORD must be set in apps/api/.env')
  }
  return {
    user,
    appPassword,
    fromName: env.MAIL_FROM_NAME?.trim() || 'Dekko ISHO Group Careers',
    replyTo: env.MAIL_REPLY_TO?.trim() || undefined,
  }
}

export function createMailer(config: MailConfig) {
  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 2,
    auth: { user: config.user, pass: config.appPassword },
  })

  return {
    verify: () => transporter.verify(),
    send: (to: string | string[], email: RenderedEmail) =>
      transporter.sendMail({
        from: { name: config.fromName, address: config.user },
        replyTo: config.replyTo,
        to,
        subject: email.subject,
        html: email.html,
        text: email.text,
      }),
    close: () => transporter.close(),
  }
}
