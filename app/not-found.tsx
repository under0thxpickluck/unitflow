import Link from 'next/link'

const EBAY_URL = process.env.NEXT_PUBLIC_EBAY_STORE_URL ?? 'https://www.ebay.com'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <p className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-6">404</p>
      <h1 className="text-2xl font-bold text-white mb-3">Part Not Found</h1>
      <p className="text-gray-500 mb-2">The item may have been sold or removed from inventory.</p>
      <p className="text-gray-600 text-sm mb-10">Browse our current inventory or visit our eBay store.</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/inventory"
          className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-6 py-3 rounded transition-colors"
        >
          Browse Inventory
        </Link>
        <a
          href={EBAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded transition-colors"
        >
          Visit eBay Store
        </a>
      </div>
    </div>
  )
}
