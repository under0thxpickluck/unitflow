import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Are LGA1150 CPUs Still Worth Buying? | UNITFLOW JAPAN',
  description: 'Intel 4th generation LGA1150 CPUs remain a strong used market value. Learn about i3-4130, i5-4570, i7-4770, i7-4790 and what DDR3 memory to pair with them.',
  alternates: { canonical: `${SITE_URL}/guides/lga1150-cpus-worth-buying` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Are LGA1150 CPUs Still Worth Buying?',
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
    { '@type': 'ListItem', position: 3, name: 'Are LGA1150 CPUs Still Worth Buying?', item: `${SITE_URL}/guides/lga1150-cpus-worth-buying` },
  ],
}

export default function GuideLGA1150() {
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
          <span className="text-gray-400">LGA1150</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">Are LGA1150 CPUs Still Worth Buying?</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">What Is LGA1150?</h2>
            <p className="text-gray-400 leading-relaxed">LGA1150 is Intel&apos;s socket for 4th generation (Haswell) and some 5th generation (Broadwell) Core processors, released in 2013–2014. It was used in mainstream desktop motherboards (H81, B85, H87, Z87, H97, Z97) and in a large volume of business desktops from HP, Dell, and Lenovo.</p>
            <p className="text-gray-400 leading-relaxed mt-3">These machines are now reaching the end of corporate service cycles, which means large quantities of LGA1150 hardware are entering the used market at low prices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">i3, i5, and i7: Which to Buy</h2>
            <div className="space-y-4">
              {[
                { cpu: 'Core i3-4130 / i3-4150', cores: '2C/4T', note: 'Entry option. Good for light Linux builds, NAS, or repair stock.' },
                { cpu: 'Core i5-4570 / i5-4590', cores: '4C/4T', note: 'The value pick. Solid for home servers, retro gaming, and daily use.' },
                { cpu: 'Core i7-4770', cores: '4C/8T', note: 'Most common high-end LGA1150. Good performance, wide availability.' },
                { cpu: 'Core i7-4790 / i7-4790K', cores: '4C/8T', note: 'Highest clocked LGA1150 CPU. 4790K is the unlocked version for overclockers.' },
              ].map((row) => (
                <div key={row.cpu} className="bg-bg-secondary border border-white/10 rounded p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white font-mono text-sm">{row.cpu}</span>
                    <span className="text-gray-600 font-mono text-xs">{row.cores}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{row.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">DDR3 Compatibility</h2>
            <p className="text-gray-400 leading-relaxed">LGA1150 CPUs use DDR3 or DDR3L memory (1.5V or 1.35V). Most H81/B85 motherboards support dual-channel DDR3-1333 or DDR3-1600. A common and cost-effective configuration is 2×4GB or 2×8GB DDR3-1600.</p>
            <p className="text-gray-400 leading-relaxed mt-3">DDR3L (low voltage, 1.35V) modules are compatible with standard DDR3 slots — the lower voltage is within spec. DDR4 is not compatible with LGA1150.</p>
            <Link href="/memory/ddr3" className="text-blue-400 hover:text-blue-300 text-sm mt-3 block">Browse DDR3 memory →</Link>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Current Used Market Demand</h2>
            <p className="text-gray-400 leading-relaxed">LGA1150 remains active in the used market for repair shops replacing failed CPUs in existing systems, Linux builders looking for cheap but capable 4-core machines, retro/budget PC builds, and server hobbyists building low-power mini servers.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Supply from Japan is strong because business-grade HP and Dell desktops used LGA1150 at scale. These machines were well-maintained and are retiring in volume now.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/socket/lga1150" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Browse LGA1150 parts →
              </Link>
              <Link href="/bulk-orders" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Bulk orders →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
