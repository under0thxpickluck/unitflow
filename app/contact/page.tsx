import type { Metadata } from 'next'
import { existsSync } from 'fs'
import path from 'path'
import Image from 'next/image'
import ContactForm from '@/components/ContactForm'
import { getGenre, inquiryPrefill } from '@/lib/genres'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Contact — UNITFLOW JAPAN',
  description: 'Contact UNITFLOW JAPAN for bulk orders, sourcing requests, or general inquiries about used PC parts and other items from Japan.',
  alternates: { canonical: `${SITE_URL}/contact` },
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ genre?: string | string[] }> }) {
  const { genre: genreParam } = await searchParams
  // ジャンルのページの「Request an item」から来たら、欲しい物の欄にジャンル名を入れておく
  const genre = typeof genreParam === 'string' ? getGenre(genreParam) : undefined
  const hasWhatsApp = existsSync(path.join(process.cwd(), 'public', 'whatapp.png'))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Contact</h1>
      <p className="text-gray-500 text-sm mb-10">For bulk orders, sourcing requests, or general inquiries. We respond within 1-2 business days.</p>
      {genre && (
        <p className="text-sm text-gray-400 mb-6">
          Request for <span className="text-white">{genre.name}</span>: tell us the item, condition and quantity you are looking for.
        </p>
      )}
      <ContactForm initialDesired={genre ? inquiryPrefill(genre) : ''} />
      {hasWhatsApp && (
        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">WhatsApp</h2>
          <div className="inline-block rounded-2xl overflow-hidden">
            <Image
              src="/whatapp.png"
              alt="WhatsApp QR code"
              width={220}
              height={220}
            />
          </div>
        </div>
      )}
    </div>
  )
}
