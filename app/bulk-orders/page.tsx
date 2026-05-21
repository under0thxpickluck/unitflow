import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Bulk Orders — Used PC Parts from Japan',
  description: 'Bulk used PC parts from Japan. Mixed lots, monthly sourcing, long-term supply for repair shops, schools, and resellers.',
  alternates: { canonical: `${SITE_URL}/bulk-orders` },
}

export default function BulkOrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Bulk Orders</h1>
      <p className="text-gray-500 text-sm mb-10">Long-term supply available for business buyers</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {[
          { title: 'Mixed Lots Available', desc: 'CPUs, memory, motherboards in single shipments. Reduce shipping costs.' },
          { title: 'Monthly Sourcing', desc: 'Regular supply from enterprise PC lots. Consistent monthly availability.' },
          { title: 'Long-Term Supply', desc: 'Ongoing partnership for stable procurement. Contact for terms.' },
          { title: 'OEM Parts Available', desc: 'Genuine OEM hardware from HP, Dell, Lenovo, Fujitsu business PCs.' },
        ].map((item) => (
          <div key={item.title} className="bg-bg-secondary border border-white/10 rounded p-6">
            <h2 className="text-white font-medium mb-2">{item.title}</h2>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-bg-tertiary border border-white/10 rounded p-6 mb-10">
        <h2 className="text-white font-medium mb-4">Who We Supply</h2>
        <div className="flex flex-wrap gap-2">
          {['Repair shops', 'Computer schools', 'Linux server builders', 'PC resellers', 'IT asset managers', 'PC refurbishers', 'Export businesses'].map((t) => (
            <span key={t} className="text-sm bg-bg-secondary border border-white/10 text-gray-400 px-3 py-1.5 rounded">{t}</span>
          ))}
        </div>
      </div>
      <div className="text-center">
        <p className="text-gray-400 mb-6">
          Send us your parts list, quantities, and required condition grade. We&apos;ll check current stock and sourcing options.
        </p>
        <Link href="/contact" className="inline-block bg-white text-gray-900 hover:bg-gray-100 font-medium px-8 py-3 rounded transition-colors">
          Send Bulk Inquiry →
        </Link>
      </div>
    </div>
  )
}
