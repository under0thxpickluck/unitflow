import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'About — Used PC Parts Supplier from Japan',
  description: 'UNITFLOW JAPAN specializes in sourcing, testing, and listing used PC parts from Japanese business PCs. Ships worldwide through eBay.',
  alternates: { canonical: `${SITE_URL}/about` },
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-8">Used PC Parts Supplier from Japan</h1>
      <div className="bg-bg-secondary border border-white/10 rounded p-6 mb-6">
        <p className="text-gray-300 leading-relaxed">
          We are a used PC parts specialist based in Japan, focused on sourcing, testing, and exporting
          hardware from retired business computers. Our inventory comes primarily from corporate desktop PCs —
          HP, Dell, Lenovo, Fujitsu — decommissioned from offices across Japan.
        </p>
      </div>
      {[
        { title: 'What We Do', content: 'We receive large lots of business PCs, disassemble them by hand, test each component, grade and document them, then list on eBay for international buyers. Every item is handled individually — not bulk-sorted or untouched.' },
        { title: 'Business PC Focus', content: 'Business PCs are more reliable than consumer hardware. They run at lower temperatures, follow stricter QC standards, and come with documented service histories. Our inventory reflects this: mostly Intel Core i3–i7 (Gen 3–8), DDR3/DDR4 ECC and non-ECC, and OEM motherboards.' },
        { title: 'Testing & Grading', content: 'CPUs are boot-tested in known-good systems. Memory modules are individually tested. Motherboards are powered on and checked for POST. All items are cleaned with compressed air before packaging.' },
        { title: 'International Shipping', content: 'We ship worldwide via eBay Global Shipping. All orders include tracking. Packaging uses anti-static bags, bubble wrap, and rigid board reinforcement.' },
        { title: 'Long-Term Supply', content: 'We source continuously from corporate PC lots. Bulk buyers can count on regular availability of common business PC parts. Contact us for monthly supply arrangements.' },
      ].map((s) => (
        <div key={s.title} className="mb-6">
          <h2 className="text-white font-medium text-lg mb-2">{s.title}</h2>
          <p className="text-gray-400 leading-relaxed">{s.content}</p>
        </div>
      ))}
    </div>
  )
}
