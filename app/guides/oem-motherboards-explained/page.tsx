import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'OEM Motherboards Explained | Dell HP Lenovo Used Boards | UNITFLOW JAPAN',
  description: 'What OEM motherboards from Dell, HP, and Lenovo are, how they differ from retail boards, front panel connector differences, BIOS limitations, and when to buy one.',
  alternates: { canonical: `${SITE_URL}/guides/oem-motherboards-explained` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'OEM Motherboards Explained',
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
    { '@type': 'ListItem', position: 3, name: 'OEM Motherboards Explained', item: `${SITE_URL}/guides/oem-motherboards-explained` },
  ],
}

export default function GuideOEMMotherboards() {
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
          <span className="text-gray-400">OEM Motherboards</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">OEM Motherboards Explained</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">What Is an OEM Motherboard?</h2>
            <p className="text-gray-400 leading-relaxed">An OEM motherboard is designed by a PC manufacturer (Dell, HP, Lenovo, Fujitsu) for a specific desktop model, not sold separately at retail. It uses a standard Intel or AMD chipset but has a custom PCB layout, BIOS, and sometimes proprietary connectors optimized for their chassis.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">OEM vs Retail: Key Differences</h2>
            <div className="space-y-3">
              {[
                ['Form factor', 'OEM boards often use MicroATX or custom mini footprints designed for compact chassis.'],
                ['BIOS', 'OEM BIOS is locked to specific features. No overclock options, limited memory XMP support.'],
                ['Front panel', 'Front panel connector may be a single proprietary multi-pin header instead of standard individual pins.'],
                ['Price', 'Significantly cheaper than equivalent retail boards. Ideal for direct replacement in existing OEM chassis.'],
              ].map(([topic, desc]) => (
                <div key={topic} className="bg-bg-secondary border border-white/10 rounded p-4 text-sm">
                  <p className="text-white font-mono mb-1">{topic}</p>
                  <p className="text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Dell, HP, Lenovo: What to Expect</h2>
            <p className="text-gray-400 leading-relaxed mb-3">Each manufacturer has its own conventions:</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><span className="text-white font-mono">Dell</span> — Uses a proprietary front panel connector. Pinout is different from standard. Adapter cables exist but are not always included.</li>
              <li><span className="text-white font-mono">HP</span> — Front panel is often a single 10-pin block. Some models use standard 2-pin individual connectors. HP Compro and EliteDesk boards have good documentation online.</li>
              <li><span className="text-white font-mono">Lenovo</span> — ThinkCentre boards frequently have standard front panel pinouts. Good documentation available on Lenovo&apos;s support site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">When to Buy OEM</h2>
            <p className="text-gray-400 leading-relaxed">OEM boards are the right choice when you need a direct replacement for an existing OEM system (same model), you are building in an OEM chassis and do not need overclocking, you are building a budget workstation or server where BIOS limitations do not matter, or you are a repair shop stocking replacement boards.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Avoid OEM boards if you plan to overclock, use a custom chassis that requires standard front panel headers (without adapters), or need specific BIOS features not available in OEM firmware.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/categories/motherboard" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Browse motherboards →
              </Link>
              <Link href="/categories/oem-parts" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                All OEM parts →
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
