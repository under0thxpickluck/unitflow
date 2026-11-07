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

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const ROWS: [string, keyof ContactFormData][] = [
  ['Name', 'name'],
  ['Company', 'company'],
  ['Country', 'country'],
  ['Email', 'email'],
  ['eBay Username', 'ebayUsername'],
  ['Desired Items', 'desiredParts'],
  ['Quantity', 'quantity'],
  ['Message', 'message'],
]

// 入力はすべて外部の人が書いたもの。HTML として解釈されないよう必ずエスケープする
export function buildContactEmailHtml(data: ContactFormData): string {
  const rows = ROWS.map(
    ([label, key]) =>
      `<tr><td style="padding:8px;font-weight:bold">${label}</td><td style="padding:8px;white-space:pre-wrap">${escapeHtml(data[key] ?? '')}</td></tr>`,
  ).join('\n')
  return `
    <h2>New Contact from UNITFLOW JAPAN</h2>
    <table style="border-collapse:collapse;width:100%">
${rows}
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
    subject: `[UNITFLOW] New inquiry from ${data.name} (${data.country})`.replace(/[\r\n]+/g, ' ').slice(0, 200),
    html: buildContactEmailHtml(data),
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}
