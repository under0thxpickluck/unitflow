import Link from 'next/link'
import type { Metadata } from 'next'
import { getProducts } from '@/lib/sedora'
import ProductCard from '@/components/ProductCard'
import { TodaysProcessing } from '@/types/product'
import { readFile } from 'fs/promises'
import path from 'path'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'UNITFLOW JAPAN — Reliable Used PC Parts from Japan',
  description: 'Tested CPUs, memory, motherboards, GPUs and OEM parts sourced from business PCs in Japan. Ships worldwide via eBay.',
  alternates: { canonical: SITE_URL },
}

async function getTodaysProcessing(): Promise<TodaysProcessing> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'today.json')
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return { date: '', disassembled: [], added_cpu: [], added_ddr3: [] }
  }
}

const WHY_BUY = [
  { title: 'Carefully Tested', desc: 'Every CPU and module is tested before listing. No untested items shipped as tested.' },
  { title: 'Genuine OEM Parts', desc: 'Pulled from real business PCs — Dell, HP, Lenovo. Authentic OEM hardware only.' },
  { title: 'Clean Business PCs', desc: 'Corporate machines with documented service history. Not consumer or gaming hardware.' },
  { title: 'Reliable Packaging', desc: 'Anti-static bags, bubble wrap, rigid board reinforcement on every shipment.' },
  { title: 'Long-Term Supply', desc: 'Monthly sourcing from enterprise lots. Consistent supply for bulk buyers.' },
]

const WORKSHOP_LABELS = [
  'Disassembly of HP business PCs',
  'CPU inspection and testing',
  'Component cleaning with air duster',
  'Anti-static packaging',
]

export default async function HomePage() {
  const [products, today] = await Promise.all([getProducts(), getTodaysProcessing()])
  const featuredProducts = products.slice(0, 6)

  return (
    <>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">
              Ships from Japan · eBay verified seller
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              Reliable Used PC Parts<br />
              <span className="text-gray-400">from Japan</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Tested CPUs, memory, motherboards, GPUs and OEM parts sourced from business PCs in Japan.
              Genuine hardware. Honest grading. Shipped worldwide.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/inventory" className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-3 rounded transition-colors">
                Browse Inventory
              </Link>
              <a href="https://www.ebay.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded transition-colors">
                Visit eBay Store
              </a>
              <Link href="/bulk-orders" className="border border-white/20 text-gray-300 hover:border-white/40 hover:text-white px-6 py-3 rounded transition-colors">
                Bulk Orders
              </Link>
            </div>
          </div>
          <div className="relative aspect-video lg:aspect-square bg-bg-tertiary rounded overflow-hidden border border-white/10 flex items-center justify-center">
            <p className="text-gray-600 text-sm text-center px-4">[Warehouse photo — add /public/images/hero-warehouse.jpg]</p>
          </div>
        </div>
      </section>

      {/* Keyword band */}
      <div className="border-b border-white/5 bg-bg-primary py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center">
            {['Used CPUs', 'DDR3 Memory', 'OEM Motherboards', 'GPUs', 'Power Supplies', 'Storage', 'Ships from Japan'].map((kw) => (
              <span key={kw} className="text-xs font-mono text-gray-600">{kw}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Live Inventory */}
      <section className="bg-bg-secondary border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Live Inventory</h2>
              <p className="text-gray-500 text-sm mt-1">Current stock available on eBay</p>
            </div>
            <Link href="/inventory" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Workshop */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white">Inside Our Workshop</h2>
          <p className="text-gray-500 text-sm mt-1">Every item is handled, tested, and prepared by hand</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {WORKSHOP_LABELS.map((label) => (
            <div key={label} className="relative aspect-square bg-bg-tertiary rounded border border-white/10 flex items-center justify-center p-4">
              <p className="text-gray-600 text-xs text-center">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Buy From Japan */}
      <section className="bg-bg-secondary border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white mb-8">Why Buy From Japan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {WHY_BUY.map((item) => (
              <div key={item.title} className="bg-bg-primary border border-white/10 rounded p-5">
                <p className="text-white font-medium text-sm mb-2">{item.title}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-bg-tertiary border border-white/10 rounded p-8 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Bulk Orders Welcome</h2>
            <p className="text-gray-400 mb-6">
              We supply repair shops, schools, Linux server builders, resellers, and PC refurbishers.
              Mixed lots, monthly sourcing, and long-term supply available.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Repair shops', 'Schools', 'Linux server builders', 'Resellers', 'PC refurbishers'].map((t) => (
                <span key={t} className="text-xs bg-bg-secondary border border-white/10 text-gray-400 px-3 py-1 rounded-full">{t}</span>
              ))}
            </div>
            <Link href="/bulk-orders" className="inline-block bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-3 rounded transition-colors">
              Inquire About Bulk Orders →
            </Link>
          </div>
        </div>
      </section>

      {/* Today's Processing */}
      {today.date && (
        <section className="bg-bg-secondary border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">
                Today&apos;s Processing — {today.date}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {today.disassembled.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Disassembled Today</p>
                  <ul className="space-y-1">
                    {today.disassembled.map((item) => (
                      <li key={item} className="text-sm text-gray-300 font-mono">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {today.added_cpu.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">CPUs Added</p>
                  <ul className="space-y-1">
                    {today.added_cpu.map((item) => (
                      <li key={item} className="text-sm text-gray-300 font-mono">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {today.added_ddr3.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Memory Added</p>
                  <ul className="space-y-1">
                    {today.added_ddr3.map((item) => (
                      <li key={item} className="text-sm text-gray-300 font-mono">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {today.notes && (
              <p className="text-gray-600 text-xs font-mono mt-4">Note: {today.notes}</p>
            )}
          </div>
        </section>
      )}
    </>
  )
}
