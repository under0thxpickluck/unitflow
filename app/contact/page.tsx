import type { Metadata } from 'next'
import { existsSync } from 'fs'
import path from 'path'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Contact — UNITFLOW JAPAN',
  description: 'Contact UNITFLOW JAPAN for bulk orders, sourcing requests, or general inquiries about used PC parts from Japan.',
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default function ContactPage() {
  const hasWhatsApp = existsSync(path.join(process.cwd(), 'public', 'whatapp.jpg'))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Contact</h1>
      <p className="text-gray-500 text-sm mb-10">For bulk orders, sourcing requests, or general inquiries. We respond within 1-2 business days.</p>
      <ContactForm />
      {hasWhatsApp && (
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">WhatsApp</h2>
          <div className="bg-bg-secondary border border-white/10 rounded p-4 inline-block">
            <div className="relative overflow-hidden rounded" style={{ width: 200, height: 200 }}>
              <Image
                src="/whatapp.jpg"
                alt="WhatsApp QR code"
                fill
                className="object-cover"
                style={{ objectPosition: 'center 53%' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
