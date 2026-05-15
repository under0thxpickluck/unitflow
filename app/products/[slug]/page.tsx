import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug, getProducts } from '@/lib/sedora'
import StatusBadge from '@/components/StatusBadge'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await getProducts()
  const seen = new Set<string>()
  return products
    .filter((p) => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true })
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: `${product.title_en} | Used PC Parts from Japan`,
    description: `Used ${product.title_en} sourced from business PCs in Japan. ${product.condition}. Tested when applicable and shipped worldwide through eBay. UNITFLOW JAPAN.`,
    alternates: { canonical: `${SITE_URL}/products/${slug}` },
    openGraph: {
      title: product.title_en,
      description: `Used ${product.title_en} from Japan. ${product.condition}. Ships worldwide via eBay.`,
      images: product.ebay_image_url ? [{ url: product.ebay_image_url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title_en,
      images: product.ebay_image_url ? [product.ebay_image_url] : [],
    },
  }
}

function generateDescription(product: Product): string {
  const base = `This ${product.title_en} was sourced from a business PC in Japan.`
  const tested = product.tested
    ? 'It has been tested in a working system before listing.'
    : 'It has been visually inspected before listing.'
  return `${base} ${tested} Minor cosmetic wear may be present due to previous use. All purchases are completed securely through eBay.`
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()])
  if (!product) notFound()

  const related = allProducts
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .slice(0, 4)

  const categoryPath = product.category.toLowerCase().replace(/\s+/g, '-')

  const details: [string, string][] = [
    ['Brand', product.brand],
    ['Model', product.model],
    ...(product.partNumber ? [['Part Number', product.partNumber] as [string, string]] : []),
    ['Category', product.category],
    ['Condition', product.condition],
    ['Tested', product.tested ? 'Yes — boot tested' : 'No'],
    ...(product.socket ? [['Socket', product.socket] as [string, string]] : []),
    ...(product.memoryType ? [['Memory Type', product.memoryType] as [string, string]] : []),
    ['Pulled From', 'Working business PC in Japan'],
    ['Ships From', 'Japan'],
    ['Shipping', 'eBay Global Shipping — Tracking included'],
    ['Stock', product.stock > 0 ? `${product.stock} available` : 'Out of stock'],
  ]

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title_en,
    image: product.ebay_image_url ? [product.ebay_image_url] : [],
    description: generateDescription(product),
    sku: product.id,
    mpn: product.partNumber ?? product.model,
    brand: { '@type': 'Brand', name: product.brand },
    category: product.category,
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: product.ebay_url,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'UNITFLOW JAPAN' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Inventory', item: `${SITE_URL}/inventory` },
      { '@type': 'ListItem', position: 3, name: product.category, item: `${SITE_URL}/categories/${categoryPath}` },
      { '@type': 'ListItem', position: 4, name: product.title_en, item: `${SITE_URL}/products/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex flex-wrap gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/inventory" className="hover:text-gray-300">Inventory</Link>
          <span>/</span>
          <Link href={`/categories/${categoryPath}`} className="hover:text-gray-300">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px]">{product.title_en}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative aspect-square bg-bg-secondary border border-white/10 rounded overflow-hidden">
            <Image
              src={product.ebay_image_url || 'https://placehold.co/600x600/1d222b/9ca3af?text=No+Image'}
              alt={`${product.title_en} ${product.partNumber ?? product.model} from Japan`}
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
              <span className="text-xs bg-bg-tertiary text-gray-500 border border-white/10 px-2 py-0.5 rounded font-mono">
                Ships from Japan
              </span>
            </div>

            <h1 className="text-2xl font-bold text-white mb-6">{product.title_en}</h1>

            <table className="w-full text-sm mb-6">
              <tbody>
                {details.map(([label, value]) => (
                  <tr key={label} className="border-b border-white/5">
                    <td className="py-2.5 pr-4 text-gray-500 font-mono text-xs w-36">{label}</td>
                    <td className="py-2.5 text-gray-300">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-gray-500 text-sm leading-relaxed mb-6 bg-bg-tertiary border border-white/10 rounded p-4">
              {generateDescription(product)}
            </p>

            <a
              href={product.ebay_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded transition-colors mb-3"
            >
              Buy on eBay →
            </a>
            <a
              href={product.ebay_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center border border-white/10 text-gray-400 hover:text-white py-3 rounded transition-colors text-sm"
            >
              View eBay Listing
            </a>
            <p className="text-gray-600 text-xs text-center mt-4">
              All purchases are completed securely through eBay. We do not request direct off-platform payment.
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-3 text-xs">
              <Link href={`/categories/${categoryPath}`} className="text-blue-400 hover:text-blue-300">
                Browse all {product.category} →
              </Link>
              {product.socket && (
                <Link href={`/socket/${product.socket.toLowerCase()}`} className="text-blue-400 hover:text-blue-300">
                  Other {product.socket} parts →
                </Link>
              )}
              {product.memoryType && (
                <Link href={`/memory/${product.memoryType.toLowerCase()}`} className="text-blue-400 hover:text-blue-300">
                  Other {product.memoryType} memory →
                </Link>
              )}
              <Link href="/bulk-orders" className="text-blue-400 hover:text-blue-300">
                Bulk orders →
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-bold text-white mb-6">Related {product.category} Parts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
