import { ApiError, apiPost } from './api'
import { TURNSTILE_PENDING_MESSAGE, TURNSTILE_SITE_KEY } from './turnstile'

export type ContactFormData = {
  name: string
  email: string
  inquiry?: string
  message: string
}

export type SubscribeFormData = {
  email: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactForm(data: ContactFormData): string[] {
  const errors: string[] = []
  if (!data.name.trim()) errors.push('Name is required.')
  if (!emailRegex.test(data.email.trim())) errors.push('Valid email is required.')
  if (!data.message.trim()) errors.push('Message is required.')
  return errors
}

export function validateSubscribeForm(data: SubscribeFormData): string[] {
  return emailRegex.test(data.email.trim()) ? [] : ['Valid email is required.']
}

type SubmitResult = { ok: true } | { ok: false; errors: string[] }

export async function submitContactForm(
  data: ContactFormData & { phone?: string; source?: string; turnstileToken?: string },
): Promise<SubmitResult> {
  const errors = validateContactForm(data)
  if (errors.length) return { ok: false, errors }
  if (TURNSTILE_SITE_KEY && !data.turnstileToken) return { ok: false, errors: [TURNSTILE_PENDING_MESSAGE] }

  const message = data.inquiry ? `Inquiry: ${data.inquiry}\n\n${data.message}` : data.message
  try {
    await apiPost('/api/public/contact', {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() ?? '',
      message: message.trim(),
      source: data.source ?? 'contact',
      turnstileToken: data.turnstileToken,
    })
    return { ok: true }
  } catch (error) {
    return { ok: false, errors: [error instanceof ApiError ? error.message : 'Something went wrong. Please try again.'] }
  }
}

export async function submitSubscribeForm(data: SubscribeFormData & { turnstileToken?: string }): Promise<SubmitResult> {
  const errors = validateSubscribeForm(data)
  if (errors.length) return { ok: false, errors }
  if (TURNSTILE_SITE_KEY && !data.turnstileToken) return { ok: false, errors: [TURNSTILE_PENDING_MESSAGE] }

  try {
    await apiPost('/api/public/subscribe', { email: data.email.trim(), turnstileToken: data.turnstileToken })
    return { ok: true }
  } catch (error) {
    return { ok: false, errors: [error instanceof ApiError ? error.message : 'Something went wrong. Please try again.'] }
  }
}
