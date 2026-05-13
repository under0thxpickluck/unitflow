import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for UNITFLOW JAPAN.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-xs mb-10">Last updated: May 2026</p>
      <div className="space-y-6 text-gray-400 text-sm leading-relaxed">
        {[
          { title: 'Information We Collect', content: 'When you submit our contact form, we collect your name, company, country, email address, eBay username, and inquiry details. This information is used solely to respond to your inquiry.' },
          { title: 'How We Use Your Information', content: 'Contact form submissions are sent to our email via Resend and are not stored in a database. We do not sell, trade, or share your information with third parties.' },
          { title: 'eBay Transactions', content: "All purchases are completed through eBay. eBay's privacy policy governs all transaction data. We do not collect payment information." },
          { title: 'Cookies', content: 'This site uses no tracking cookies. Standard Next.js/Vercel may use essential technical cookies for operation.' },
          { title: 'Contact', content: 'For privacy inquiries, contact us through the Contact page.' },
        ].map((s) => (
          <div key={s.title}>
            <h2 className="text-white font-medium mb-2">{s.title}</h2>
            <p>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
