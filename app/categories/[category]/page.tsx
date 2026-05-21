import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProducts } from '@/lib/sedora'
import { filterProducts } from '@/lib/filters'
import ProductCard from '@/components/ProductCard'
import { ProductCategory } from '@/types/product'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

interface CategoryConfig {
  productCategory?: ProductCategory
  oemBrands?: string[]
  title: string
  h1: string
  description: string
  relatedSockets?: string[]
  relatedMemory?: string[]
  guideSlug?: string
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  cpu: {
    productCategory: 'CPU',
    title: 'Used CPUs from Japan | Intel and AMD Processors | UNITFLOW JAPAN',
    h1: 'Used CPUs from Japan',
    description: 'Browse used Intel and AMD CPUs sourced from Japanese business PCs. LGA1150, LGA1155, Xeon, Core i3, i5, i7 and more. Available through eBay listings.',
    relatedSockets: ['lga1150', 'lga1155'],
    guideSlug: 'lga1150-cpus-worth-buying',
  },
  memory: {
    productCategory: 'Memory',
    title: 'Used DDR3 and DDR4 Memory from Japan | UNITFLOW JAPAN',
    h1: 'Used Memory Modules from Japan',
    description: 'Browse used DDR3 and DDR4 desktop memory modules sourced from Japanese business PCs. Tested when applicable and available through eBay.',
    relatedMemory: ['ddr3'],
    guideSlug: 'ddr3-memory-buying-guide',
  },
  motherboard: {
    productCategory: 'Motherboard',
    title: 'Used Motherboards from Japan | OEM and Retail Boards | UNITFLOW JAPAN',
    h1: 'Used Motherboards from Japan',
    description: 'Browse used OEM and retail motherboards from Japanese business PCs. LGA1150, LGA1155, MicroATX and ATX boards available through eBay.',
    relatedSockets: ['lga1150', 'lga1155'],
    guideSlug: 'oem-motherboards-explained',
  },
  gpu: {
    productCategory: 'GPU',
    title: 'Used Graphics Cards from Japan | NVIDIA and AMD GPUs | UNITFLOW JAPAN',
    h1: 'Used Graphics Cards from Japan',
    description: 'Browse used NVIDIA and AMD graphics cards sourced from Japan. Tested when applicable and available through eBay listings.',
  },
  psu: {
    productCategory: 'PSU',
    title: 'Used Power Supplies from Japan | ATX and OEM PSU | UNITFLOW JAPAN',
    h1: 'Used Power Supplies from Japan',
    description: 'Browse used ATX and OEM power supplies removed from Japanese business PCs. Available through eBay listings.',
  },
  storage: {
    productCategory: 'Storage',
    title: 'Used SSD and HDD from Japan | Storage Parts | UNITFLOW JAPAN',
    h1: 'Used SSD and HDD from Japan',
    description: 'Browse used SSDs and HDDs sourced from Japanese business PCs. Storage devices are listed with clear condition notes.',
  },
  'oem-parts': {
    oemBrands: ['HP', 'Dell', 'Lenovo', 'Fujitsu', 'ASUS'],
    title: 'OEM PC Parts from Japan | Dell HP Lenovo ASUS Parts | UNITFLOW JAPAN',
    h1: 'OEM PC Parts from Japan',
    description: 'Browse OEM PC parts from Japanese business PCs including Dell, HP, Lenovo, ASUS and other manufacturers.',
    guideSlug: 'oem-motherboards-explained',
  },
}

interface Props {
  params: Promise<{ category: string }>
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_CONFIG).map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const config = CATEGORY_CONFIG[category]
  if (!config) return {}
  return {
    title: config.title,
    description: config.description,
    alternates: { canonical: `${SITE_URL}/categories/${category}` },
  }
}

const breadcrumbSchema = (category: string, h1: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Categories', item: `${SITE_URL}/categories` },
    { '@type': 'ListItem', position: 3, name: h1, item: `${SITE_URL}/categories/${category}` },
  ],
})

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const config = CATEGORY_CONFIG[category]
  if (!config) notFound()

  const allProducts = await getProducts()
  const products = config.productCategory
    ? filterProducts(allProducts, { category: config.productCategory })
    : config.oemBrands
      ? allProducts.filter((p) => config.oemBrands!.includes(p.brand))
      : allProducts

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(category, config.h1)) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex flex-wrap gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-gray-300">Categories</Link>
          <span>/</span>
          <span className="text-gray-400">{config.h1}</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white mb-3">{config.h1}</h1>
          <p className="text-gray-400 leading-relaxed max-w-2xl">{config.description}</p>
        </div>

        {(config.relatedSockets || config.relatedMemory || config.guideSlug) && (
          <div className="flex flex-wrap gap-3 mb-8 text-xs">
            {config.relatedSockets?.map((s) => (
              <Link key={s} href={`/socket/${s}`} className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
                {s.toUpperCase()} parts →
              </Link>
            ))}
            {config.relatedMemory?.map((m) => (
              <Link key={m} href={`/memory/${m}`} className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
                {m.toUpperCase()} memory →
              </Link>
            ))}
            {config.guideSlug && (
              <Link href={`/guides/${config.guideSlug}`} className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
                Buying guide →
              </Link>
            )}
            <Link href="/bulk-orders" className="border border-white/10 text-gray-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded transition-colors">
              Bulk orders →
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="mb-4">No items currently in stock for this category.</p>
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
