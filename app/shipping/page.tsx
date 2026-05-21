import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'International Shipping from Japan | UNITFLOW JAPAN',
  description: 'UNITFLOW JAPAN ships worldwide from Japan via eBay Global Shipping. All orders include tracking and secure packaging.',
  alternates: { canonical: `${SITE_URL}/shipping` },
}

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">International Shipping from Japan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { title: 'Ships from Japan', desc: 'All items ship directly from our warehouse in Japan.' },
          { title: 'Tracking Included', desc: 'Every shipment includes a tracking number via eBay.' },
          { title: 'Secure Packaging', desc: 'Anti-static bags, bubble wrap, rigid board reinforcement.' },
          { title: 'eBay Global Shipping', desc: 'All purchases and shipping arranged securely through eBay.' },
        ].map((item) => (
          <div key={item.title} className="bg-bg-secondary border border-white/10 rounded p-5">
            <h2 className="text-white font-medium mb-1">{item.title}</h2>
            <p className="text-gray-500 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-bg-tertiary border border-white/10 rounded p-6">
        <h2 className="text-white font-medium mb-3">Packaging Details</h2>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li>· CPUs shipped in original trays or padded CPU mailers</li>
          <li>· Memory modules in anti-static bags, individually wrapped</li>
          <li>· HDDs and SSDs double-boxed with foam padding</li>
          <li>· Motherboards wrapped in anti-static bag + bubble wrap + rigid outer box</li>
          <li>· GPUs in anti-static bag with rigid foam support</li>
        </ul>
      </div>
      <p className="text-gray-600 text-xs text-center mt-8">All purchases are completed securely through eBay.</p>
    </div>
  )
}
