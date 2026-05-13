import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, ContactFormData } from '@/lib/resend'

const REQUIRED_FIELDS: (keyof ContactFormData)[] = ['name', 'company', 'country', 'email', 'desiredParts', 'quantity', 'message']

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  const missing = REQUIRED_FIELDS.filter((f) => !body[f])
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })
  }

  const data: ContactFormData = {
    name: body.name,
    company: body.company,
    country: body.country,
    email: body.email,
    ebayUsername: body.ebayUsername ?? '',
    desiredParts: body.desiredParts,
    quantity: body.quantity,
    message: body.message,
  }

  const result = await sendContactEmail(data)
  if (!result.success) return NextResponse.json({ error: result.error }, { status: 500 })
  return NextResponse.json({ success: true })
}
