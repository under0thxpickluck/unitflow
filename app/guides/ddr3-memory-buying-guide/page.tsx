import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Used DDR3 Memory Buying Guide | UNITFLOW JAPAN',
  description: 'Everything you need to know about buying used DDR3 desktop memory — DDR3 vs DDR3L, PC3-10600 vs PC3-12800, compatibility, and bulk buying tips.',
  alternates: { canonical: `${SITE_URL}/guides/ddr3-memory-buying-guide` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Used DDR3 Memory Buying Guide',
  datePublished: '2026-05-15',
  author: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    { '@type': 'ListItem', position: 3, name: 'Used DDR3 Memory Buying Guide', item: `${SITE_URL}/guides/ddr3-memory-buying-guide` },
  ],
}

export default function GuideDDR3() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex flex-wrap gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-gray-300">Guides</Link>
          <span>/</span>
          <span className="text-gray-400">DDR3</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">Used DDR3 Memory Buying Guide</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">DDR3 vs DDR3L</h2>
            <p className="text-gray-400 leading-relaxed">DDR3 runs at 1.5V. DDR3L (low voltage) runs at 1.35V. Both fit in the same physical slot. DDR3L modules work in standard DDR3 slots — the lower voltage is within spec. Standard DDR3 modules should not be used in systems that require DDR3L-only (certain laptops and some mobile platforms), but for desktop use you can mix them freely.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Japanese business PCs use both. Our listings specify the voltage when known.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Desktop DIMM vs SO-DIMM</h2>
            <p className="text-gray-400 leading-relaxed">Desktop memory uses 240-pin DIMM form factor. Laptop memory uses 204-pin SO-DIMM. They are not interchangeable. UNITFLOW JAPAN primarily sells desktop DIMMs pulled from business towers and small form factor desktops.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">PC3-10600 vs PC3-12800</h2>
            <div className="bg-bg-secondary border border-white/10 rounded p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white font-mono mb-1">PC3-10600</p>
                  <p className="text-gray-500">DDR3-1333 · 10.6 GB/s bandwidth</p>
                </div>
                <div>
                  <p className="text-white font-mono mb-1">PC3-12800</p>
                  <p className="text-gray-500">DDR3-1600 · 12.8 GB/s bandwidth</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">PC3-12800 (DDR3-1600) is the most common speed from Japanese business PCs and is fully backward compatible with PC3-10600 slots. If your motherboard only supports DDR3-1333, a DDR3-1600 module will run at 1333 without issue.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4GB vs 8GB Modules</h2>
            <p className="text-gray-400 leading-relaxed">4GB modules are the most common from Gen 3–4 business PCs and are available at very low cost. 8GB modules are less common but well-suited for 16GB dual-channel configurations. Most H81/B85 boards support up to 16GB total (2 slots × 8GB).</p>
            <p className="text-gray-400 leading-relaxed mt-3">For bulk buyers running repair shops or reselling, 4GB modules in large quantities are often more practical than 8GB kits.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Buying in Bulk</h2>
            <p className="text-gray-400 leading-relaxed">We supply memory modules in bulk to repair shops, IT resellers, schools, and PC refurbishers. Common lots include 10×4GB, 20×4GB, 10×8GB, and mixed-capacity lots. Contact us with your quantity and capacity requirements.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/memory/ddr3" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Browse DDR3 memory →
              </Link>
              <Link href="/bulk-orders" className="text-sm bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors">
                Bulk order inquiry →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
