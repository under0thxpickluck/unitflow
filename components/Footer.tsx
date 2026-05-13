import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg-secondary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-2">UNITFLOW JAPAN</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Used PC parts specialist in Japan.<br />
              Sourced from business PCs. Tested and shipped worldwide via eBay.
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Pages</p>
            <div className="flex flex-col gap-2">
              {[
                ['/inventory', 'Inventory'],
                ['/categories', 'Categories'],
                ['/bulk-orders', 'Bulk Orders'],
                ['/about', 'About Us'],
                ['/quality', 'Quality Policy'],
                ['/shipping', 'Shipping'],
                ['/faq', 'FAQ'],
                ['/contact', 'Contact'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">eBay</p>
            <a
              href="https://www.ebay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded transition-colors mb-4"
            >
              Visit eBay Store →
            </a>
            <div className="flex flex-col gap-2 mt-4">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-400 text-xs">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-400 text-xs">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6">
          <p className="text-gray-600 text-xs text-center">
            All purchases are completed securely through eBay. © 2026 UNITFLOW JAPAN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
