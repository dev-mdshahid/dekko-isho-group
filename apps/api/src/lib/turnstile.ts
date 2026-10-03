import { config } from '../config.js'
import { HttpError } from './http.js'
import { logger } from './logger.js'

/** Verifies a Cloudflare Turnstile token. Skipped when no secret is configured (local development). */
export async function verifyTurnstile(token: string | undefined, ip: string | undefined): Promise<void> {
  if (!config.turnstile.secret) return
  if (!token) throw new HttpError(400, 'Please complete the security check and try again')
  const body = new URLSearchParams({ secret: config.turnstile.secret, response: token })
  if (ip) body.set('remoteip', ip)
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
    const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] }
    if (!data.success) throw new HttpError(400, 'The security check failed. Please refresh the page and try again')
  } catch (error) {
    if (error instanceof HttpError) throw error
    logger.error({ err: error }, 'turnstile verification error')
    throw new HttpError(503, 'We could not verify the security check. Please try again in a moment')
  }
}
