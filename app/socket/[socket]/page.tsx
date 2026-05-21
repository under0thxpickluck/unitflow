import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProducts } from '@/lib/sedora'
import { filterProducts } from '@/lib/filters'
import ProductCard from '@/components/ProductCard'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

interface SocketConfig {
  title: string
  h1: string
  description: string
  filterSocket: string
}

const SOCKET_CONFIG: Record<string, SocketConfig> = {
  lga1150: {
    title: 'LGA1150 CPUs and Motherboards from Japan | UNITFLOW JAPAN',
    h1: 'LGA1150 CPUs and Motherboards from Japan',
    description: 'Browse LGA1150 CPUs and compatible motherboards sourced from Japanese business PCs. Common parts include Intel 4th generation Core i3, i5, i7 processors and H81, B85, H87, Z87 motherboards.',
    filterSocket: 'LGA1150',
  },
  lga1155: {
    title: 'LGA1155 CPUs and Motherboards from Japan | UNITFLOW JAPAN',
    h1: 'LGA1155 CPUs and Motherboards from Japan',
    description: 'Browse LGA1155 CPUs and compatible motherboards sourced from Japanese business PCs. Common parts include Intel 2nd and 3rd generation Core processors and H61, H67, B75 and Z77 motherboards.',
    filterSocket: 'LGA1155',
  },
}

interface Props {
  params: Promise<{ socket: string }>
}

export function generateStaticParams() {
  return Object.keys(SOCKET_CONFIG).map((socket) => ({ socket }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { socket } = await params
  const config = SOCKET_CONFIG[socket]
  if (!config) return {}
  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `${SITE_URL}/socket/${socket}` },
  }
}

export default async function SocketPage({ params }: Props) {
  const { socket } = await params
  const config = SOCKET_CONFIG[socket]
  if (!config) notFound()

  const allProducts = await getProducts()
  const products = filterProducts(allProducts, { socket: config.filterSocket })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Inventory', item: `${SITE_URL}/inventory` },
      { '@type': 'ListItem', position: 3, name: config.h1, item: `${SITE_URL}/socket/${socket}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex flex-wrap gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/inventory" className="hover:text-gray-300">Inventory</Link>
          <span>/</span>
          <span className="text-gray-400">{config.filterSocket}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-3">{config.h1}</h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">{config.description}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 text-xs">
          <Link href="/categories/cpu" className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
            All CPUs →
          </Link>
          <Link href="/categories/motherboard" className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
            All Motherboards →
          </Link>
          <Link href="/bulk-orders" className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
            Bulk orders →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">No {config.filterSocket} items currently in stock.</p>
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
