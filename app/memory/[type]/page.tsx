import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProducts } from '@/lib/sedora'
import { filterProducts } from '@/lib/filters'
import ProductCard from '@/components/ProductCard'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

interface MemoryConfig {
  title: string
  h1: string
  description: string
  filterMemoryType: string
}

const MEMORY_CONFIG: Record<string, MemoryConfig> = {
  ddr3: {
    title: 'Used DDR3 Memory from Japan | UNITFLOW JAPAN',
    h1: 'Used DDR3 Memory from Japan',
    description: 'Browse used DDR3 desktop memory modules sourced from Japanese business PCs. Common capacities include 2GB, 4GB, 8GB and 16GB kits.',
    filterMemoryType: 'DDR3',
  },
  ddr4: {
    title: 'Used DDR4 Memory from Japan | UNITFLOW JAPAN',
    h1: 'Used DDR4 Memory from Japan',
    description: 'Browse used DDR4 desktop memory modules sourced from Japanese business PCs. Available in single and kit configurations.',
    filterMemoryType: 'DDR4',
  },
}

interface Props {
  params: Promise<{ type: string }>
}

export function generateStaticParams() {
  return Object.keys(MEMORY_CONFIG).map((type) => ({ type }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const config = MEMORY_CONFIG[type]
  if (!config) return {}
  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `${SITE_URL}/memory/${type}` },
  }
}

export default async function MemoryTypePage({ params }: Props) {
  const { type } = await params
  const config = MEMORY_CONFIG[type]
  if (!config) notFound()

  const allProducts = await getProducts()
  const products = filterProducts(allProducts, { memoryType: config.filterMemoryType })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE_URL}/categories` },
      { '@type': 'ListItem', position: 3, name: 'Memory', item: `${SITE_URL}/categories/memory` },
      { '@type': 'ListItem', position: 4, name: config.h1, item: `${SITE_URL}/memory/${type}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex flex-wrap gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/categories/memory" className="hover:text-gray-300">Memory</Link>
          <span>/</span>
          <span className="text-gray-400">{config.filterMemoryType}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-3">{config.h1}</h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">{config.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 text-xs">
          <Link href="/categories/memory" className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
            All Memory →
          </Link>
          <Link href="/guides/ddr3-memory-buying-guide" className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
            Memory buying guide →
          </Link>
          <Link href="/bulk-orders" className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
            Bulk orders →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">No {config.filterMemoryType} items currently in stock.</p>
            <Link href="/inventory" className="text-blue-400 hover:text-blue-300 text-sm">Browse all inventory →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
