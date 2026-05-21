import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Guides — Buying Used PC Parts from Japan | UNITFLOW JAPAN',
  description: 'Guides for international buyers of used PC parts from Japan. LGA1150, DDR3, OEM motherboards, and more.',
  alternates: { canonical: `${SITE_URL}/guides` },
}

const GUIDES = [
  {
    slug: 'buying-used-pc-parts-from-japan',
    title: 'Buying Used PC Parts from Japan',
    desc: 'A complete guide for international buyers sourcing CPUs, memory, and motherboards from Japanese business PCs.',
  },
  {
    slug: 'lga1150-cpus-worth-buying',
    title: 'Are LGA1150 CPUs Still Worth Buying?',
    desc: "Intel 4th generation CPUs remain a popular used market choice. Here's what to know before buying.",
  },
  {
    slug: 'ddr3-memory-buying-guide',
    title: 'Used DDR3 Memory Buying Guide',
    desc: 'Everything you need to know about buying used DDR3 desktop memory — compatibility, capacity, and condition.',
  },
  {
    slug: 'oem-motherboards-explained',
    title: 'OEM Motherboards Explained',
    desc: 'What OEM boards from Dell, HP, and Lenovo are, how they differ from retail, and when to buy one.',
  },
]

export default function GuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Guides</h1>
      <p className="text-gray-500 text-sm mb-10">Resources for international buyers of used PC parts from Japan</p>
      <div className="space-y-4">
        {GUIDES.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block bg-bg-secondary border border-white/10 hover:border-white/20 rounded p-6 transition-colors group"
          >
            <h2 className="text-white font-medium mb-2 group-hover:text-blue-400 transition-colors">{guide.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{guide.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
