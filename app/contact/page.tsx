import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact UNITFLOW JAPAN for bulk orders, sourcing requests, or general inquiries about used PC parts from Japan.',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Contact</h1>
      <p className="text-gray-500 text-sm mb-10">For bulk orders, sourcing requests, or general inquiries. We respond within 1-2 business days.</p>
      <ContactForm />
    </div>
  )
}
