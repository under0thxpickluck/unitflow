import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProduct, getProducts } from '@/lib/sedora'
import StatusBadge from '@/components/StatusBadge'
import ProductCard from '@/components/ProductCard'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return {}
  return {
    title: product.title_en,
    description: `${product.title_en} — ${product.condition}. Pulled from working business PC in Japan. Ships worldwide via eBay.`,
    openGraph: {
      title: product.title_en,
      images: [{ url: product.ebay_image_url }],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const [product, allProducts] = await Promise.all([getProduct(id), getProducts()])
  if (!product) notFound()

  const related = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title_en,
    image: product.ebay_image_url,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      url: product.ebay_url,
      priceCurrency: 'USD',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'UNITFLOW JAPAN' },
    },
  }

  const details: [string, string][] = [
    ['Model', product.model],
    ['Brand', product.brand],
    ['Category', product.category],
    ['Condition', product.condition],
    ['Tested', product.tested ? 'Yes — boot tested' : 'No'],
    ['Pulled From', 'Working business PC in Japan'],
    ...(product.socket ? [['Socket', product.socket] as [string, string]] : []),
    ['Ships From', 'Japan'],
    ['Shipping', 'eBay Global Shipping — Tracking included'],
    ['Stock', product.stock > 0 ? `${product.stock} available` : 'Out of stock'],
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          {' / '}
          <Link href="/inventory" className="hover:text-gray-300">Inventory</Link>
          {' / '}
          <span className="text-gray-400">{product.model}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative aspect-square bg-bg-secondary border border-white/10 rounded overflow-hidden">
            <Image
              src={product.ebay_image_url || 'https://placehold.co/600x600/1d222b/9ca3af?text=No+Image'}
              alt={product.title_en}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge condition={product.condition} />
              {product.tested && (
                <span className="text-xs bg-green-950 text-green-400 border border-green-800 px-2 py-0.5 rounded font-mono">
                  ✓ Tested
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-6">{product.title_en}</h1>
            <table className="w-full text-sm mb-8">
              <tbody>
                {details.map(([label, value]) => (
                  <tr key={label} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 text-gray-500 font-mono text-xs w-36">{label}</td>
                    <td className="py-2.5 text-gray-300">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-bg-tertiary border border-white/10 rounded p-4 mb-6 text-xs text-gray-500 font-mono">
              Pulled from working business PC in Japan · Carefully tested · Genuine OEM part · Cleaned before shipment · Ships from Japan
            </div>
            <a href={product.ebay_url} target="_blank" rel="noopener noreferrer"
              className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded transition-colors mb-3">
              Buy on eBay →
            </a>
            <a href={product.ebay_url} target="_blank" rel="noopener noreferrer"
              className="w-full block text-center border border-white/10 text-gray-400 hover:text-white py-3 rounded transition-colors text-sm">
              View eBay Listing
            </a>
            <p className="text-gray-600 text-xs text-center mt-4">
              All purchases are completed securely through eBay.
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-bold text-white mb-6">Related Items</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
