import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail, ContactFormData } from '@/lib/resend'

// 画面で * が付いている欄だけ必須（会社名・eBay ユーザー名は任意）
const REQUIRED_FIELDS: (keyof ContactFormData)[] = ['name', 'country', 'email', 'desiredParts', 'quantity', 'message']

const MAX_LENGTH: Partial<Record<keyof ContactFormData, number>> = { message: 5000 }
const DEFAULT_MAX_LENGTH = 300
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(body: Record<string, unknown>, key: string): string {
  const v = body[key]
  return typeof v === 'string' ? v.trim() : ''
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

  // 人には見えない欄。ボットが埋めてきたら送ったふりをして捨てる
  if (field(body, 'website')) return NextResponse.json({ success: true })

  const data: ContactFormData = {
    name: field(body, 'name'),
    company: field(body, 'company'),
    country: field(body, 'country'),
    email: field(body, 'email'),
    ebayUsername: field(body, 'ebayUsername'),
    desiredParts: field(body, 'desiredParts'),
    quantity: field(body, 'quantity'),
    message: field(body, 'message'),
  }

  const missing = REQUIRED_FIELDS.filter((f) => !data[f])
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })
  }
  if (!EMAIL_RE.test(data.email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }
  const tooLong = (Object.keys(data) as (keyof ContactFormData)[]).filter(
    (k) => data[k].length > (MAX_LENGTH[k] ?? DEFAULT_MAX_LENGTH),
  )
  if (tooLong.length > 0) {
    return NextResponse.json({ error: `Too long: ${tooLong.join(', ')}` }, { status: 400 })
  }

  const result = await sendContactEmail(data)
  if (!result.success) return NextResponse.json({ error: 'Could not send your message. Please email us directly.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
