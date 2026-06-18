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

export async function submitContactForm(data: ContactFormData) {
  const errors = validateContactForm(data)
  if (errors.length) return { ok: false, errors }

  // TODO: wire this to backend API endpoint.
  console.log('submitContactForm', data)
  return { ok: true as const }
}

export async function submitSubscribeForm(data: SubscribeFormData) {
  const errors = validateSubscribeForm(data)
  if (errors.length) return { ok: false, errors }

  // TODO: wire this to backend API endpoint.
  console.log('submitSubscribeForm', data)
  return { ok: true as const }
}
