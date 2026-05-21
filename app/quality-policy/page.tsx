import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Quality & Testing Policy | UNITFLOW JAPAN',
  description: 'How UNITFLOW JAPAN grades and tests used PC parts. Condition definitions: Tested, Untested, For Parts, As-is.',
  alternates: { canonical: `${SITE_URL}/quality-policy` },
}

const GRADES = [
  { grade: 'Tested', style: 'text-green-400 border-green-800 bg-green-950', def: 'Component was installed in a known-good test system and verified to boot/POST correctly. CPUs show correct frequency and core count. Memory passes memtest. This is our standard listing grade.' },
  { grade: 'Pulled from Working PC', style: 'text-blue-400 border-blue-800 bg-blue-950', def: 'Removed from a system that was confirmed working at time of disassembly. Not individually bench-tested, but low risk.' },
  { grade: 'Untested', style: 'text-gray-400 border-gray-700 bg-gray-900', def: 'Item has not been individually tested. Sold as-received. Suitable for buyers who will test themselves or need parts for repair stock.' },
  { grade: 'For Parts', style: 'text-orange-400 border-orange-800 bg-orange-950', def: 'Known or suspected fault. Sold for component harvesting, repair practice, or as-is. Not expected to function fully.' },
  { grade: 'As-is', style: 'text-gray-500 border-gray-800 bg-gray-950', def: 'Condition unknown or mixed. Sold without warranty or testing claim.' },
]

export default function QualityPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-white mb-2">Quality & Testing Policy</h1>
      <p className="text-gray-500 text-sm mb-10">How we grade and test every item before listing</p>

      <div className="bg-bg-tertiary border border-white/10 rounded p-4 mb-8 text-xs text-gray-500 font-mono">
        Used parts may have minor scratches, dust, discoloration, or signs of previous use.
        Compatibility must be confirmed by the buyer before purchase.
      </div>

      <div className="space-y-4 mb-12">
        {GRADES.map((g) => (
          <div key={g.grade} className={`border rounded p-5 ${g.style}`}>
            <p className="font-mono text-sm font-medium mb-2">{g.grade}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{g.def}</p>
          </div>
        ))}
      </div>

      <div className="bg-bg-secondary border border-white/10 rounded p-6">
        <h2 className="text-white font-medium mb-3">Our Process</h2>
        <ol className="space-y-2 text-gray-400 text-sm">
          {[
            'Receive business PC lots from corporate decommission',
            'Disassemble and catalog each unit',
            'Clean all components with compressed air',
            'Test CPUs, memory, and boards in reference systems',
            'Grade and photograph each item',
            'Package in anti-static bags with protective wrapping',
            'List on eBay with accurate condition description',
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-gray-600 flex-shrink-0">{String(i + 1).padStart(2, '0')}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
