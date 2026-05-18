import { Resend } from 'resend'

export interface ContactFormData {
  name: string
  company: string
  country: string
  email: string
  ebayUsername: string
  desiredParts: string
  quantity: string
  message: string
}

export function buildContactEmailHtml(data: ContactFormData): string {
  return `
    <h2>New Contact from UNITFLOW JAPAN</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${data.name}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Company</td><td style="padding:8px">${data.company}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Country</td><td style="padding:8px">${data.country}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${data.email}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">eBay Username</td><td style="padding:8px">${data.ebayUsername}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Desired Parts</td><td style="padding:8px">${data.desiredParts}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Quantity</td><td style="padding:8px">${data.quantity}</td></tr>
      <tr><td style="padding:8px;font-weight:bold">Message</td><td style="padding:8px">${data.message}</td></tr>
    </table>
  `
}

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? 'i0000e.bay@gmail.com'

  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: 'UNITFLOW JAPAN <noreply@unitflow.jp>',
    to: toEmail,
    replyTo: data.email,
    subject: `[UNITFLOW] New inquiry from ${data.name} (${data.country})`,
    html: buildContactEmailHtml(data),
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
