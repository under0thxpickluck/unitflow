import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'
const EBAY_URL = process.env.NEXT_PUBLIC_EBAY_STORE_URL ?? 'https://www.ebay.com'

export const metadata: Metadata = {
  title: 'Buying Used PC Parts from Japan | Guide for International Buyers | UNITFLOW JAPAN',
  description: 'A complete guide for international buyers sourcing CPUs, memory, and motherboards from Japanese business PCs. Learn why Japanese PC parts are reliable, how to read condition labels, and how to buy safely.',
  alternates: { canonical: `${SITE_URL}/guides/buying-used-pc-parts-from-japan` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Buying Used PC Parts from Japan',
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
    { '@type': 'ListItem', position: 3, name: 'Buying Used PC Parts from Japan', item: `${SITE_URL}/guides/buying-used-pc-parts-from-japan` },
  ],
}

export default function GuideBuyingFromJapan() {
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
          <span className="text-gray-400">Buying from Japan</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">Buying Used PC Parts from Japan</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Why Japanese Business PCs</h2>
            <p className="text-gray-400 leading-relaxed">Japan has one of the largest corporate PC refresh cycles in the world. Large companies replace desktop fleets every 4–5 years regardless of hardware condition. This produces a consistent supply of lightly-used, genuine business hardware — CPUs, memory modules, motherboards, and OEM parts — in good working condition.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Business PCs run at lower ambient temperatures than gaming builds, use quality OEM components, and are typically kept in clean, climate-controlled offices. The result is hardware that outlasts its intended retirement with plenty of service life remaining.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Common Parts We Export</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                ['CPUs', 'Intel Core i3/i5/i7 (Gen 3–8), LGA1155 and LGA1150 socket. Tested in reference systems.'],
                ['Memory', 'DDR3 and DDR4 desktop DIMMs. Samsung, Hynix, and Micron OEM modules.'],
                ['Motherboards', 'MicroATX and ATX boards from HP, Dell, Lenovo, Fujitsu. OEM and some retail.'],
                ['GPUs', 'NVIDIA and AMD discrete cards from workstation and business builds.'],
                ['Storage', 'SATA SSDs and HDDs. Capacity and health clearly listed.'],
                ['PSUs', 'OEM ATX power supplies in 250W–500W range.'],
              ].map(([part, desc]) => (
                <li key={part} className="flex gap-3">
                  <span className="text-white font-mono flex-shrink-0 w-28">{part}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Understanding Condition Labels</h2>
            <p className="text-gray-400 leading-relaxed mb-4">Every item is graded before listing. Here is what each label means:</p>
            <div className="space-y-3">
              {[
                ['Tested', 'text-green-400', 'Boot-tested in a known-good system. CPU frequency and core count verified. Memory passes memtest.'],
                ['Pulled from Working PC', 'text-blue-400', 'Removed from a system confirmed working at time of disassembly. Lower risk.'],
                ['Untested', 'text-gray-400', 'Not individually bench-tested. Suitable for repair stock or self-testing buyers.'],
                ['For Parts', 'text-orange-400', 'Known or suspected fault. Sold for parts use or repair practice.'],
              ].map(([grade, color, desc]) => (
                <div key={grade} className="flex gap-3 text-sm">
                  <span className={`font-mono ${color} flex-shrink-0 w-40`}>{grade}</span>
                  <span className="text-gray-500">{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4">Minor cosmetic wear (light scratches, dust marks) is normal for used hardware and does not affect function.</p>
            <Link href="/quality-policy" className="text-blue-400 hover:text-blue-300 text-sm mt-2 block">Full quality policy →</Link>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Why Buy Through eBay</h2>
            <p className="text-gray-400 leading-relaxed">All purchases are completed through eBay. This protects buyers with eBay Money Back Guarantee, dispute resolution, and a tracked purchase record. We do not accept direct payment outside eBay.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Shipping uses eBay Global Shipping where available, with tracking provided. Customs and import fees for the destination country are the buyer&apos;s responsibility and are shown at checkout.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Bulk Orders for Businesses</h2>
            <p className="text-gray-400 leading-relaxed">Repair shops, schools, Linux server builders, resellers, and PC refurbishers can contact us for bulk inventory. We source continuously from corporate PC lots and can supply regular quantities of common parts.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/bulk-orders" className="text-sm bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors">
                Inquire about bulk orders →
              </Link>
              <a href={EBAY_URL} target="_blank" rel="noopener noreferrer" className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded transition-colors">
                Visit eBay Store →
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
