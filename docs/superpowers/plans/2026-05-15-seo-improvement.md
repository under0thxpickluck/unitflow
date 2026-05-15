# UNITFLOW JAPAN SEO Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate product URLs to SEO-friendly slugs, add structured data, build category/socket/memory/guide pages, and wire up all SEO infrastructure across UNITFLOW JAPAN.

**Architecture:** Slugs are computed in `lib/slug.ts` from brand+model+socket+category and attached to `Product` objects in `lib/sedora.ts`. A new `/products/[slug]` route becomes the canonical product page; `/inventory/[id]` permanently redirects there. New static pages (categories, sockets, memory types, guides) each have their own metadata, JSON-LD, and canonicals.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, Jest 30 + Testing Library, schema.org JSON-LD

---

## File Map

**New files:**
- `lib/slug.ts` — `createSlug()` pure utility
- `__tests__/lib/slug.test.ts` — slug unit tests
- `app/products/[slug]/page.tsx` — canonical product detail page
- `app/categories/[category]/page.tsx` — category sub-pages (7 variants)
- `app/socket/[socket]/page.tsx` — socket filter pages
- `app/memory/[type]/page.tsx` — memory type filter pages
- `app/quality-policy/page.tsx` — canonical quality policy page
- `app/guides/page.tsx` — guide index
- `app/guides/buying-used-pc-parts-from-japan/page.tsx`
- `app/guides/lga1150-cpus-worth-buying/page.tsx`
- `app/guides/ddr3-memory-buying-guide/page.tsx`
- `app/guides/oem-motherboards-explained/page.tsx`
- `app/not-found.tsx` — 404 page
- `.env.local.example` — env var documentation

**Modified files:**
- `types/product.ts` — add `slug`, `partNumber?`, `updatedAt?`
- `lib/sedora.ts` — import createSlug, attach slug on load, add `getProductBySlug()`
- `components/ProductCard.tsx` — add "Details" button, update title link href
- `__tests__/components/ProductCard.test.tsx` — add `slug` to mockProduct, add Details test
- `app/inventory/[id]/page.tsx` — convert to `permanentRedirect`
- `app/sitemap.ts` — add product slugs, category/socket/memory/guide URLs; remove `/inventory/[id]`
- `app/robots.ts` — add `Disallow: /inventory/`
- `app/layout.tsx` — enrich Organization schema
- `app/page.tsx` — add canonical, add keyword band below hero
- `app/inventory/page.tsx` — add canonical metadata
- `app/categories/page.tsx` — add canonical, add sub-category links
- `app/bulk-orders/page.tsx` — add canonical
- `app/about/page.tsx` — improve H1, add canonical
- `app/quality/page.tsx` — convert to `permanentRedirect` → `/quality-policy`
- `app/shipping/page.tsx` — improve H1, add canonical
- `app/faq/page.tsx` — add FAQPage JSON-LD, add missing FAQ item, add canonical
- `app/contact/page.tsx` — add canonical
- `components/Footer.tsx` — use `NEXT_PUBLIC_EBAY_STORE_URL`, add Guides nav link

---

## Task 1: Slug utility + Product type update

**Files:**
- Create: `lib/slug.ts`
- Create: `__tests__/lib/slug.test.ts`
- Modify: `types/product.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Write failing slug tests**

Create `__tests__/lib/slug.test.ts`:

```ts
import { createSlug } from '@/lib/slug'

describe('createSlug', () => {
  it('combines brand, model, socket, category', () => {
    expect(createSlug({ brand: 'Intel', model: 'i5-3470', socket: 'LGA1155', category: 'CPU' }))
      .toBe('intel-i5-3470-lga1155-cpu')
  })

  it('works without socket', () => {
    expect(createSlug({ brand: 'Samsung', model: 'M378B5273DH0-CK0', category: 'Memory' }))
      .toBe('samsung-m378b5273dh0-ck0-memory')
  })

  it('lowercases everything', () => {
    expect(createSlug({ brand: 'ASUS', model: 'P8H61-M LX', socket: 'LGA1155', category: 'Motherboard' }))
      .toBe('asus-p8h61-m-lx-lga1155-motherboard')
  })

  it('collapses multiple separators', () => {
    expect(createSlug({ brand: 'HP', model: 'ProDesk 400 G1', category: 'CPU' }))
      .toBe('hp-prodesk-400-g1-cpu')
  })

  it('strips leading and trailing hyphens', () => {
    expect(createSlug({ brand: 'Intel', model: 'i7-4770', category: 'CPU' }))
      .toBe('intel-i7-4770-cpu')
  })
})
```

- [ ] **Step 2: Run tests — expect failure**

```bash
npx jest __tests__/lib/slug.test.ts --no-coverage
```

Expected: `Cannot find module '@/lib/slug'`

- [ ] **Step 3: Create `lib/slug.ts`**

```ts
export function createSlug(fields: {
  brand: string
  model: string
  socket?: string
  category: string
}): string {
  return [fields.brand, fields.model, fields.socket, fields.category]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx jest __tests__/lib/slug.test.ts --no-coverage
```

Expected: `5 passed`

- [ ] **Step 5: Update `types/product.ts`**

Replace entire file:

```ts
export type ProductCategory = 'CPU' | 'GPU' | 'Memory' | 'Motherboard' | 'PSU' | 'Storage'

export type ProductCondition = 'Tested' | 'Untested' | 'For Parts' | 'As-is'

export type StockStatus = 'in-stock' | 'listed' | 'junk' | 'sold'

export interface Product {
  id: string
  slug: string
  title_en: string
  title_ja: string
  category: ProductCategory
  brand: string
  model: string
  partNumber?: string
  socket?: string
  memoryType?: string
  condition: ProductCondition
  tested: boolean
  ebay_url: string
  ebay_image_url: string
  stock: number
  listed_at: string
  updatedAt?: string
  sold_at?: string
}

export interface TodaysProcessing {
  date: string
  disassembled: string[]
  added_cpu: string[]
  added_ddr3: string[]
  notes?: string
}
```

- [ ] **Step 6: Create `.env.local.example`**

```env
# Base URL for canonical tags and sitemap (no trailing slash)
NEXT_PUBLIC_SITE_URL=https://unitflow.jp

# Your eBay Store URL
NEXT_PUBLIC_EBAY_STORE_URL=https://www.ebay.com/str/YOUR_EBAY_STORE

# Sedora API (optional — falls back to static data)
SEDORA_API_URL=
SEDORA_API_KEY=

# Contact form (Resend)
RESEND_API_KEY=
```

- [ ] **Step 7: Commit**

```bash
git add lib/slug.ts __tests__/lib/slug.test.ts types/product.ts .env.local.example
git commit -m "feat: add slug utility and extend Product type"
```

---

## Task 2: Update sedora.ts to attach slugs

**Files:**
- Modify: `lib/sedora.ts`

- [ ] **Step 1: Replace `lib/sedora.ts`**

The key changes: (a) type FALLBACK_PRODUCTS as `Omit<Product, 'slug'>[]`, (b) attach slug after fetch, (c) add `getProductBySlug`.

```ts
import { Product } from '@/types/product'
import { createSlug } from '@/lib/slug'

type RawProduct = Omit<Product, 'slug'>

const FALLBACK_PRODUCTS: RawProduct[] = [
  {
    id: 'cpu-001',
    title_en: 'Intel Core i5-3470 3.20GHz LGA1155',
    title_ja: 'Intel Core i5-3470',
    category: 'CPU',
    brand: 'Intel',
    model: 'i5-3470',
    socket: 'LGA1155',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=CPU',
    stock: 12,
    listed_at: '2026-05-10',
  },
  {
    id: 'cpu-002',
    title_en: 'Intel Core i7-3770 3.40GHz LGA1155',
    title_ja: 'Intel Core i7-3770',
    category: 'CPU',
    brand: 'Intel',
    model: 'i7-3770',
    socket: 'LGA1155',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=CPU',
    stock: 5,
    listed_at: '2026-05-11',
  },
  {
    id: 'mem-001',
    title_en: 'Samsung 4GB DDR3-1600 PC3-12800 DIMM',
    title_ja: 'Samsung DDR3 4GB',
    category: 'Memory',
    brand: 'Samsung',
    model: 'M378B5273DH0-CK0',
    memoryType: 'DDR3',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=RAM',
    stock: 40,
    listed_at: '2026-05-09',
  },
  {
    id: 'mem-002',
    title_en: 'Hynix 8GB DDR3-1333 PC3-10600 DIMM',
    title_ja: 'Hynix DDR3 8GB',
    category: 'Memory',
    brand: 'Hynix',
    model: 'HMT41GU6BFR8C-H9',
    memoryType: 'DDR3',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=RAM',
    stock: 18,
    listed_at: '2026-05-08',
  },
  {
    id: 'mb-001',
    title_en: 'ASUS P8H61-M LX LGA1155 MicroATX Motherboard',
    title_ja: 'ASUS P8H61-M LX マザーボード',
    category: 'Motherboard',
    brand: 'ASUS',
    model: 'P8H61-M LX',
    socket: 'LGA1155',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=MB',
    stock: 7,
    listed_at: '2026-05-07',
  },
  {
    id: 'gpu-001',
    title_en: 'NVIDIA GeForce GT 730 2GB DDR3',
    title_ja: 'NVIDIA GT 730',
    category: 'GPU',
    brand: 'NVIDIA',
    model: 'GT 730',
    condition: 'Tested',
    tested: true,
    ebay_url: 'https://www.ebay.com',
    ebay_image_url: 'https://placehold.co/400x400/1d222b/9ca3af?text=GPU',
    stock: 3,
    listed_at: '2026-05-06',
  },
]

function attachSlug(raw: RawProduct): Product {
  return { ...raw, slug: createSlug({ brand: raw.brand, model: raw.model, socket: raw.socket, category: raw.category }) }
}

async function fetchFromSedora(): Promise<Product[]> {
  const url = process.env.SEDORA_API_URL
  const key = process.env.SEDORA_API_KEY
  if (!url || !key) return FALLBACK_PRODUCTS.map(attachSlug)

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${key}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return FALLBACK_PRODUCTS.map(attachSlug)
  const data = await res.json()
  return (data as RawProduct[]).map(attachSlug)
}

export async function getProducts(): Promise<Product[]> {
  return fetchFromSedora()
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === id) ?? null
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.slug === slug) ?? null
}

export { filterProducts } from './filters'
export type { ProductFilter } from './filters'
```

- [ ] **Step 2: Run existing tests to verify nothing broke**

```bash
npx jest --no-coverage
```

Expected: existing tests pass (TypeScript errors on `mockProduct` missing `slug` are expected — will fix in Task 3)

- [ ] **Step 3: Commit**

```bash
git add lib/sedora.ts
git commit -m "feat: attach slug to products in sedora data layer"
```

---

## Task 3: Update ProductCard + tests

**Files:**
- Modify: `components/ProductCard.tsx`
- Modify: `__tests__/components/ProductCard.test.tsx`

- [ ] **Step 1: Update test file to add `slug` and test Details button**

Replace `__tests__/components/ProductCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'

const mockProduct: Product = {
  id: 'cpu-001',
  slug: 'intel-core-i5-3470-lga1155-cpu',
  title_en: 'Intel Core i5-3470 3.20GHz LGA1155',
  title_ja: 'Intel Core i5-3470',
  category: 'CPU',
  brand: 'Intel',
  model: 'i5-3470',
  socket: 'LGA1155',
  condition: 'Tested',
  tested: true,
  ebay_url: 'https://www.ebay.com/itm/123',
  ebay_image_url: 'https://placehold.co/400x400',
  stock: 5,
  listed_at: '2026-05-10',
}

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Intel Core i5-3470 3.20GHz LGA1155')).toBeInTheDocument()
  })

  it('renders model number', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('i5-3470')).toBeInTheDocument()
  })

  it('renders socket when present', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('LGA1155')).toBeInTheDocument()
  })

  it('renders eBay link', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link', { name: /buy on ebay/i })
    expect(link).toHaveAttribute('href', 'https://www.ebay.com/itm/123')
  })

  it('renders In Stock when stock > 0', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(/in stock/i)).toBeInTheDocument()
  })

  it('renders Details link pointing to /products/[slug]', () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole('link', { name: /details/i })
    expect(link).toHaveAttribute('href', '/products/intel-core-i5-3470-lga1155-cpu')
  })

  it('title link points to /products/[slug]', () => {
    render(<ProductCard product={mockProduct} />)
    const titleLink = screen.getByRole('link', { name: /intel core i5-3470/i })
    expect(titleLink).toHaveAttribute('href', '/products/intel-core-i5-3470-lga1155-cpu')
  })
})
```

- [ ] **Step 2: Run tests — expect failure on Details and title link tests**

```bash
npx jest __tests__/components/ProductCard.test.tsx --no-coverage
```

Expected: `renders Details link` and `title link` tests fail

- [ ] **Step 3: Update `components/ProductCard.tsx`**

Replace entire file:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import StatusBadge from './StatusBadge'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="bg-bg-secondary border border-white/10 rounded hover:border-white/20 transition-colors group">
      <div className="relative aspect-square overflow-hidden rounded-t bg-bg-tertiary">
        <Image
          src={product.ebay_image_url || 'https://placehold.co/400x400/1d222b/9ca3af?text=No+Image'}
          alt={`${product.title_en} from Japan`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm text-white font-medium leading-snug group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {product.title_en}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="text-xs font-mono text-gray-500 bg-bg-tertiary px-1.5 py-0.5 rounded">
            {product.model}
          </span>
          {product.socket && (
            <span className="text-xs font-mono text-gray-500 bg-bg-tertiary px-1.5 py-0.5 rounded">
              {product.socket}
            </span>
          )}
          <span className="text-xs font-mono text-gray-500 bg-bg-tertiary px-1.5 py-0.5 rounded">
            {product.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <StatusBadge condition={product.condition} />
          {product.tested && (
            <span className="text-xs text-gray-500">✓ Tested</span>
          )}
        </div>

        <span className={`text-xs block mb-3 ${product.stock > 0 ? 'text-green-400' : 'text-gray-500'}`}>
          {product.stock > 0 ? `● In Stock (${product.stock})` : '○ Out of Stock'}
        </span>

        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 text-xs text-center border border-white/20 hover:border-white/40 text-gray-400 hover:text-white px-2 py-1.5 rounded transition-colors"
          >
            Details
          </Link>
          <a
            href={product.ebay_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-xs text-center bg-blue-600 hover:bg-blue-500 text-white px-2 py-1.5 rounded transition-colors"
          >
            Buy on eBay
          </a>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npx jest __tests__/components/ProductCard.test.tsx --no-coverage
```

Expected: `7 passed`

- [ ] **Step 5: Commit**

```bash
git add components/ProductCard.tsx __tests__/components/ProductCard.test.tsx
git commit -m "feat: add Details button and slug-based links to ProductCard"
```

---

## Task 4: Build `/products/[slug]` page

**Files:**
- Create: `app/products/[slug]/page.tsx`

- [ ] **Step 1: Create `app/products/[slug]/page.tsx`**

```tsx
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
      priceCurrency: 'USD',
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
          <span className="text-gray-400">{product.model}</span>
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/products/
git commit -m "feat: add /products/[slug] canonical product detail page"
```

---

## Task 5: Convert `/inventory/[id]` to redirect

**Files:**
- Modify: `app/inventory/[id]/page.tsx`

- [ ] **Step 1: Replace `app/inventory/[id]/page.tsx`**

```tsx
import { permanentRedirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/sedora'

interface Props {
  params: Promise<{ id: string }>
}

export default async function OldProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()
  permanentRedirect(`/products/${product.slug}`)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/inventory/
git commit -m "feat: redirect /inventory/[id] to /products/[slug] permanently"
```

---

## Task 6: Update sitemap + robots

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`

- [ ] **Step 1: Replace `app/sitemap.ts`**

```ts
import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/sedora'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()

  // deduplicate by slug
  const seen = new Set<string>()
  const uniqueProducts = products.filter((p) => {
    if (seen.has(p.slug)) return false
    seen.add(p.slug)
    return true
  })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/inventory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/categories/cpu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/categories/memory`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/categories/motherboard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/categories/gpu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/categories/psu`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/categories/storage`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/categories/oem-parts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/socket/lga1150`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/socket/lga1155`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/memory/ddr3`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/bulk-orders`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/quality-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guides/buying-used-pc-parts-from-japan`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guides/lga1150-cpus-worth-buying`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guides/ddr3-memory-buying-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/guides/oem-motherboards-explained`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const productPages: MetadataRoute.Sitemap = uniqueProducts.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(p.listed_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...productPages]
}
```

- [ ] **Step 2: Replace `app/robots.ts`**

```ts
import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/inventory/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: update sitemap with slug URLs and robots disallow /inventory/"
```

---

## Task 7: Add canonicals to all existing pages

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/inventory/page.tsx`
- Modify: `app/categories/page.tsx`
- Modify: `app/bulk-orders/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/shipping/page.tsx`
- Modify: `app/faq/page.tsx`
- Modify: `app/contact/page.tsx`

- [ ] **Step 1: Add canonical + keyword band to `app/page.tsx`**

At the top of the file, after the existing imports, the `metadata` export needs `alternates`:

```ts
// In app/page.tsx — update the metadata export:
export const metadata: Metadata = {
  title: 'UNITFLOW JAPAN — Reliable Used PC Parts from Japan',
  description: 'Tested CPUs, memory, motherboards, GPUs and OEM parts sourced from business PCs in Japan. Ships worldwide via eBay.',
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp' },
}
```

Also, inside `HomePage`, add a keyword band immediately after the Hero section closing `</section>` tag and before the Live Inventory section:

```tsx
{/* Keyword band */}
<div className="border-b border-white/5 bg-bg-primary py-3">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center">
      {['Used CPUs', 'DDR3 Memory', 'OEM Motherboards', 'GPUs', 'Power Supplies', 'Storage', 'Ships from Japan'].map((kw) => (
        <span key={kw} className="text-xs font-mono text-gray-600">{kw}</span>
      ))}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add canonical to `app/inventory/page.tsx`**

The inventory page is a client component — it has no `metadata` export. Add a layout file for inventory to carry the metadata. Actually, `app/inventory/layout.tsx` already exists. Check its content:

The existing `app/inventory/layout.tsx` likely just wraps children. Add metadata there:

```tsx
// app/inventory/layout.tsx — add metadata export:
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Inventory — Used PC Parts from Japan',
  description: 'Browse used CPUs, memory, motherboards, GPUs, PSUs and storage from Japanese business PCs. Filter by category, socket, brand, and condition.',
  alternates: { canonical: `${SITE_URL}/inventory` },
}

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 3: Add canonical to `app/categories/page.tsx`**

```ts
// In app/categories/page.tsx — update metadata:
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Categories — Used PC Parts from Japan',
  description: 'Browse used PC parts by category — CPU, GPU, Memory, Motherboard, PSU, Storage. Sourced from business PCs in Japan.',
  alternates: { canonical: `${SITE_URL}/categories` },
}
```

Also update the category links to point to `/categories/[slug]` instead of `/inventory?category=`:

```tsx
// In CategoriesPage, change each Link href:
<Link key={cat} href={`/categories/${cat.toLowerCase()}`} ...>
```

- [ ] **Step 4: Add canonical to `app/bulk-orders/page.tsx`, `app/about/page.tsx`, `app/shipping/page.tsx`, `app/contact/page.tsx`**

For `app/about/page.tsx`:
```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'About — Used PC Parts Supplier from Japan',
  description: 'UNITFLOW JAPAN specializes in sourcing, testing, and listing used PC parts from Japanese business PCs. Ships worldwide through eBay.',
  alternates: { canonical: `${SITE_URL}/about` },
}
```

Also change the H1 in the page component:
```tsx
<h1 className="text-2xl font-bold text-white mb-8">Used PC Parts Supplier from Japan</h1>
```

For `app/shipping/page.tsx`:
```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'International Shipping from Japan | UNITFLOW JAPAN',
  description: 'UNITFLOW JAPAN ships worldwide from Japan via eBay Global Shipping. All orders include tracking and secure packaging.',
  alternates: { canonical: `${SITE_URL}/shipping` },
}
```

Also update H1:
```tsx
<h1 className="text-2xl font-bold text-white mb-8">International Shipping from Japan</h1>
```

For `app/bulk-orders/page.tsx` and `app/contact/page.tsx`, add:
```ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'
// and alternates: { canonical: `${SITE_URL}/bulk-orders` } (or /contact)
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 6: Run all tests**

```bash
npx jest --no-coverage
```

Expected: all pass

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/inventory/ app/categories/page.tsx app/bulk-orders/ app/about/ app/shipping/ app/contact/
git commit -m "feat: add canonical tags and improve H1s on existing pages"
```

---

## Task 8: Improve Organization schema + Footer env var

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Update Organization schema in `app/layout.tsx`**

```ts
// Replace orgJsonLd in app/layout.tsx:
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'
const EBAY_URL = process.env.NEXT_PUBLIC_EBAY_STORE_URL ?? 'https://www.ebay.com'

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UNITFLOW JAPAN',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: 'Used PC parts supplier from Japan. CPUs, memory, motherboards, GPUs and OEM parts shipped worldwide through eBay.',
  areaServed: 'Worldwide',
  sameAs: [EBAY_URL],
  knowsAbout: ['used PC parts', 'used CPU', 'used memory', 'DDR3', 'OEM PC parts', 'Japan electronics'],
}
```

- [ ] **Step 2: Update `components/Footer.tsx` to use env vars and add Guides link**

Replace the eBay `href` and add Guides to nav:

```tsx
import Link from 'next/link'

const EBAY_URL = process.env.NEXT_PUBLIC_EBAY_STORE_URL ?? 'https://www.ebay.com'

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
                ['/guides', 'Guides'],
                ['/bulk-orders', 'Bulk Orders'],
                ['/about', 'About Us'],
                ['/quality-policy', 'Quality Policy'],
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
              href={EBAY_URL}
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
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx components/Footer.tsx
git commit -m "feat: improve Organization schema and use env var for eBay URL in footer"
```

---

## Task 9: FAQPage schema + missing FAQ item

**Files:**
- Modify: `app/faq/page.tsx`

- [ ] **Step 1: Replace `app/faq/page.tsx`**

```tsx
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'FAQ — UNITFLOW JAPAN',
  description: 'Frequently asked questions about UNITFLOW JAPAN — shipping, testing, bulk orders, and sourcing.',
  alternates: { canonical: `${SITE_URL}/faq` },
}

const FAQS = [
  { q: 'Do you ship worldwide?', a: 'Yes. We ship internationally via eBay Global Shipping. Most countries are supported. Shipping rates and estimated delivery times are shown on each eBay listing.' },
  { q: 'Are items tested before shipping?', a: 'Items listed as "Tested" have been individually verified in a working system. Items listed as "Untested" or "For Parts" are clearly marked and priced accordingly. We never list untested items as tested.' },
  { q: 'Can I request bulk orders?', a: 'Yes. We regularly supply repair shops, schools, server builders, and resellers. Use our Bulk Orders page to send an inquiry with your parts list and quantities.' },
  { q: 'Do you combine shipping?', a: "Combined shipping discounts are available on eBay when purchasing multiple items. Use eBay's cart feature to add items, and the combined rate will be calculated automatically." },
  { q: 'Can you source specific parts?', a: "We receive large corporate PC lots regularly. If you need specific models (CPU generation, socket, memory type), contact us through the inquiry form and we'll check upcoming inventory." },
  { q: 'What brands do you carry?', a: 'Primarily OEM parts from HP, Dell, Lenovo, and Fujitsu business desktops. CPU brands include Intel (Core i3/i5/i7, Xeon) and AMD. Memory is Samsung, Hynix, Micron.' },
  { q: 'How do I purchase?', a: "All purchases are made through eBay. Click 'Buy on eBay' on any product page. Payment is handled securely through eBay's checkout system." },
  { q: 'Do you sell outside eBay?', a: 'For buyer protection and policy compliance, all purchases are completed through our official eBay listings. We do not accept direct payment, PayPal, or off-platform transactions.' },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a,
    },
  })),
}

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="bg-bg-secondary border border-white/10 rounded p-6">
              <h2 className="text-white font-medium mb-3">{faq.q}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/faq/page.tsx
git commit -m "feat: add FAQPage schema and off-eBay policy FAQ item"
```

---

## Task 10: Build `/categories/[category]` sub-pages

**Files:**
- Create: `app/categories/[category]/page.tsx`

- [ ] **Step 1: Create `app/categories/[category]/page.tsx`**

```tsx
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
        <nav className="text-xs text-gray-500 mb-8 font-mono flex gap-1">
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/categories/
git commit -m "feat: add /categories/[category] sub-pages with SEO metadata and schema"
```

---

## Task 11: Build `/socket/[socket]` + `/memory/[type]` pages

**Files:**
- Create: `app/socket/[socket]/page.tsx`
- Create: `app/memory/[type]/page.tsx`

- [ ] **Step 1: Create `app/socket/[socket]/page.tsx`**

```tsx
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
        <nav className="text-xs text-gray-500 mb-8 font-mono flex gap-1">
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
```

- [ ] **Step 2: Create `app/memory/[type]/page.tsx`**

```tsx
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
        <nav className="text-xs text-gray-500 mb-8 font-mono flex gap-1">
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
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/socket/ app/memory/
git commit -m "feat: add socket and memory type SEO pages"
```

---

## Task 12: Build `/quality-policy` + redirect `/quality`

**Files:**
- Create: `app/quality-policy/page.tsx`
- Modify: `app/quality/page.tsx`

- [ ] **Step 1: Create `app/quality-policy/page.tsx`**

Copy all content from `app/quality/page.tsx` but update metadata and add canonical:

```tsx
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
          {['Receive business PC lots from corporate decommission', 'Disassemble and catalog each unit', 'Clean all components with compressed air', 'Test CPUs, memory, and boards in reference systems', 'Grade and photograph each item', 'Package in anti-static bags with protective wrapping', 'List on eBay with accurate condition description'].map((step, i) => (
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
```

- [ ] **Step 2: Replace `app/quality/page.tsx` with redirect**

```tsx
import { permanentRedirect } from 'next/navigation'

export default function QualityRedirect() {
  permanentRedirect('/quality-policy')
}
```

- [ ] **Step 3: Commit**

```bash
git add app/quality-policy/ app/quality/page.tsx
git commit -m "feat: add /quality-policy page and redirect /quality"
```

---

## Task 13: Build guide pages

**Files:**
- Create: `app/guides/page.tsx`
- Create: `app/guides/buying-used-pc-parts-from-japan/page.tsx`
- Create: `app/guides/lga1150-cpus-worth-buying/page.tsx`
- Create: `app/guides/ddr3-memory-buying-guide/page.tsx`
- Create: `app/guides/oem-motherboards-explained/page.tsx`

- [ ] **Step 1: Create `app/guides/page.tsx`**

```tsx
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
    desc: 'Intel 4th generation CPUs remain a popular used market choice. Here\'s what to know before buying.',
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
```

- [ ] **Step 2: Create `app/guides/buying-used-pc-parts-from-japan/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'
const EBAY_URL = process.env.NEXT_PUBLIC_EBAY_STORE_URL ?? 'https://www.ebay.com'

export const metadata: Metadata = {
  title: 'Buying Used PC Parts from Japan | Guide for International Buyers | UNITFLOW JAPAN',
  description: 'A complete guide for international buyers sourcing CPUs, memory, and motherboards from Japanese business PCs. Learn why Japanese PC parts are reliable, how to read condition labels, and how to buy safely.',
  alternates: { canonical: `${SITE_URL}/guides/buying-used-pc-parts-from-japan` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Buying Used PC Parts from Japan',
  datePublished: '2026-05-15',
  author: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    { '@type': 'ListItem', position: 3, name: 'Buying Used PC Parts from Japan', item: `${SITE_URL}/guides/buying-used-pc-parts-from-japan` },
  ],
}

export default function GuideBuyingFromJapan() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-gray-300">Guides</Link>
          <span>/</span>
          <span className="text-gray-400">Buying from Japan</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">Buying Used PC Parts from Japan</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="prose-custom space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Why Japanese Business PCs</h2>
            <p className="text-gray-400 leading-relaxed">Japan has one of the largest corporate PC refresh cycles in the world. Large companies replace desktop fleets every 4–5 years regardless of hardware condition. This produces a consistent supply of lightly-used, genuine business hardware — CPUs, memory modules, motherboards, and OEM parts — in good working condition.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Business PCs run at lower ambient temperatures than gaming builds, use quality OEM components, and are typically kept in clean, climate-controlled offices. The result is hardware that outlasts its intended retirement with plenty of service life remaining.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Common Parts We Export</h2>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                ['CPUs', 'Intel Core i3/i5/i7 (Gen 3–8), LGA1155 and LGA1150 socket. Tested in reference systems.'],
                ['Memory', 'DDR3 and DDR4 desktop DIMMs. Samsung, Hynix, and Micron OEM modules.'],
                ['Motherboards', 'MicroATX and ATX boards from HP, Dell, Lenovo, Fujitsu. OEM and some retail.'],
                ['GPUs', 'NVIDIA and AMD discrete cards from workstation and business builds.'],
                ['Storage', 'SATA SSDs and HDDs. Capacity and health clearly listed.'],
                ['PSUs', 'OEM ATX power supplies in 250W–500W range.'],
              ].map(([part, desc]) => (
                <li key={part} className="flex gap-3">
                  <span className="text-white font-mono flex-shrink-0 w-28">{part}</span>
                  <span>{desc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Understanding Condition Labels</h2>
            <p className="text-gray-400 leading-relaxed mb-4">Every item is graded before listing. Here is what each label means:</p>
            <div className="space-y-3">
              {[
                ['Tested', 'text-green-400', 'Boot-tested in a known-good system. CPU frequency and core count verified. Memory passes memtest.'],
                ['Pulled from Working PC', 'text-blue-400', 'Removed from a system confirmed working at time of disassembly. Lower risk.'],
                ['Untested', 'text-gray-400', 'Not individually bench-tested. Suitable for repair stock or self-testing buyers.'],
                ['For Parts', 'text-orange-400', 'Known or suspected fault. Sold for parts use or repair practice.'],
              ].map(([grade, color, desc]) => (
                <div key={grade} className="flex gap-3 text-sm">
                  <span className={`font-mono ${color} flex-shrink-0 w-40`}>{grade}</span>
                  <span className="text-gray-500">{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4">Minor cosmetic wear (light scratches, dust marks) is normal for used hardware and does not affect function.</p>
            <Link href="/quality-policy" className="text-blue-400 hover:text-blue-300 text-sm mt-2 block">Full quality policy →</Link>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Why Buy Through eBay</h2>
            <p className="text-gray-400 leading-relaxed">All purchases are completed through eBay. This protects buyers with eBay Money Back Guarantee, dispute resolution, and a tracked purchase record. We do not accept direct payment outside eBay.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Shipping uses eBay Global Shipping where available, with tracking provided. Customs and import fees for the destination country are the buyer's responsibility and are shown at checkout.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Bulk Orders for Businesses</h2>
            <p className="text-gray-400 leading-relaxed">Repair shops, schools, Linux server builders, resellers, and PC refurbishers can contact us for bulk inventory. We source continuously from corporate PC lots and can supply regular quantities of common parts.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/bulk-orders" className="text-sm bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors">
                Inquire about bulk orders →
              </Link>
              <a href={EBAY_URL} target="_blank" rel="noopener noreferrer" className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded transition-colors">
                Visit eBay Store →
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: Create `app/guides/lga1150-cpus-worth-buying/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Are LGA1150 CPUs Still Worth Buying? | UNITFLOW JAPAN',
  description: 'Intel 4th generation LGA1150 CPUs remain a strong used market value. Learn about i3-4130, i5-4570, i7-4770, i7-4790 and what DDR3 memory to pair with them.',
  alternates: { canonical: `${SITE_URL}/guides/lga1150-cpus-worth-buying` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Are LGA1150 CPUs Still Worth Buying?',
  datePublished: '2026-05-15',
  author: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    { '@type': 'ListItem', position: 3, name: 'Are LGA1150 CPUs Still Worth Buying?', item: `${SITE_URL}/guides/lga1150-cpus-worth-buying` },
  ],
}

export default function GuideLGA1150() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-gray-300">Guides</Link>
          <span>/</span>
          <span className="text-gray-400">LGA1150</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">Are LGA1150 CPUs Still Worth Buying?</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">What Is LGA1150?</h2>
            <p className="text-gray-400 leading-relaxed">LGA1150 is Intel's socket for 4th generation (Haswell) and some 5th generation (Broadwell) Core processors, released in 2013–2014. It was used in mainstream desktop motherboards (H81, B85, H87, Z87, H97, Z97) and in a large volume of business desktops from HP, Dell, and Lenovo.</p>
            <p className="text-gray-400 leading-relaxed mt-3">These machines are now reaching the end of corporate service cycles, which means large quantities of LGA1150 hardware are entering the used market at low prices.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">i3, i5, and i7: Which to Buy</h2>
            <div className="space-y-4">
              {[
                { cpu: 'Core i3-4130 / i3-4150', cores: '2C/4T', note: 'Entry option. Good for light Linux builds, NAS, or repair stock.' },
                { cpu: 'Core i5-4570 / i5-4590', cores: '4C/4T', note: 'The value pick. Solid for home servers, retro gaming, and daily use.' },
                { cpu: 'Core i7-4770', cores: '4C/8T', note: 'Most common high-end LGA1150. Good performance, wide availability.' },
                { cpu: 'Core i7-4790 / i7-4790K', cores: '4C/8T', note: 'Highest clocked LGA1150 CPU. 4790K is the unlocked version for overclockers.' },
              ].map((row) => (
                <div key={row.cpu} className="bg-bg-secondary border border-white/10 rounded p-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-white font-mono text-sm">{row.cpu}</span>
                    <span className="text-gray-600 font-mono text-xs">{row.cores}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{row.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">DDR3 Compatibility</h2>
            <p className="text-gray-400 leading-relaxed">LGA1150 CPUs use DDR3 or DDR3L memory (1.5V or 1.35V). Most H81/B85 motherboards support dual-channel DDR3-1333 or DDR3-1600. A common and cost-effective configuration is 2×4GB or 2×8GB DDR3-1600.</p>
            <p className="text-gray-400 leading-relaxed mt-3">DDR3L (low voltage, 1.35V) modules are compatible with standard DDR3 slots — the lower voltage is within spec. DDR4 is not compatible with LGA1150.</p>
            <Link href="/memory/ddr3" className="text-blue-400 hover:text-blue-300 text-sm mt-3 block">Browse DDR3 memory →</Link>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Current Used Market Demand</h2>
            <p className="text-gray-400 leading-relaxed">LGA1150 remains active in the used market for repair shops replacing failed CPUs in existing systems, Linux builders looking for cheap but capable 4-core machines, retro/budget PC builds, and server hobbyists building low-power mini servers.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Supply from Japan is strong because business-grade HP and Dell desktops used LGA1150 at scale. These machines were well-maintained and are retiring in volume now.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/socket/lga1150" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Browse LGA1150 parts →
              </Link>
              <Link href="/bulk-orders" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Bulk orders →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 4: Create `app/guides/ddr3-memory-buying-guide/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'Used DDR3 Memory Buying Guide | UNITFLOW JAPAN',
  description: 'Everything you need to know about buying used DDR3 desktop memory — DDR3 vs DDR3L, PC3-10600 vs PC3-12800, compatibility, and bulk buying tips.',
  alternates: { canonical: `${SITE_URL}/guides/ddr3-memory-buying-guide` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Used DDR3 Memory Buying Guide',
  datePublished: '2026-05-15',
  author: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    { '@type': 'ListItem', position: 3, name: 'Used DDR3 Memory Buying Guide', item: `${SITE_URL}/guides/ddr3-memory-buying-guide` },
  ],
}

export default function GuideDDR3() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-gray-300">Guides</Link>
          <span>/</span>
          <span className="text-gray-400">DDR3</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">Used DDR3 Memory Buying Guide</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">DDR3 vs DDR3L</h2>
            <p className="text-gray-400 leading-relaxed">DDR3 runs at 1.5V. DDR3L (low voltage) runs at 1.35V. Both fit in the same physical slot. DDR3L modules work in standard DDR3 slots — the lower voltage is within spec. Standard DDR3 modules should not be used in systems that require DDR3L-only (certain laptops and some mobile platforms), but for desktop use you can mix them freely.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Japanese business PCs use both. Our listings specify the voltage when known.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Desktop DIMM vs SO-DIMM</h2>
            <p className="text-gray-400 leading-relaxed">Desktop memory uses 240-pin DIMM form factor. Laptop memory uses 204-pin SO-DIMM. They are not interchangeable. UNITFLOW JAPAN primarily sells desktop DIMMs pulled from business towers and small form factor desktops.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">PC3-10600 vs PC3-12800</h2>
            <div className="bg-bg-secondary border border-white/10 rounded p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white font-mono mb-1">PC3-10600</p>
                  <p className="text-gray-500">DDR3-1333 · 10.6 GB/s bandwidth</p>
                </div>
                <div>
                  <p className="text-white font-mono mb-1">PC3-12800</p>
                  <p className="text-gray-500">DDR3-1600 · 12.8 GB/s bandwidth</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">PC3-12800 (DDR3-1600) is the most common speed from Japanese business PCs and is fully backward compatible with PC3-10600 slots. If your motherboard only supports DDR3-1333, a DDR3-1600 module will run at 1333 without issue.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">4GB vs 8GB Modules</h2>
            <p className="text-gray-400 leading-relaxed">4GB modules are the most common from Gen 3–4 business PCs and are available at very low cost. 8GB modules are less common but well-suited for 16GB dual-channel configurations. Most H81/B85 boards support up to 16GB total (2 slots × 8GB).</p>
            <p className="text-gray-400 leading-relaxed mt-3">For bulk buyers running repair shops or reselling, 4GB modules in large quantities are often more practical than 8GB kits.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Buying in Bulk</h2>
            <p className="text-gray-400 leading-relaxed">We supply memory modules in bulk to repair shops, IT resellers, schools, and PC refurbishers. Common lots include 10×4GB, 20×4GB, 10×8GB, and mixed-capacity lots. Contact us with your quantity and capacity requirements.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/memory/ddr3" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Browse DDR3 memory →
              </Link>
              <Link href="/bulk-orders" className="text-sm bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors">
                Bulk order inquiry →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 5: Create `app/guides/oem-motherboards-explained/page.tsx`**

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://unitflow.jp'

export const metadata: Metadata = {
  title: 'OEM Motherboards Explained | Dell HP Lenovo Used Boards | UNITFLOW JAPAN',
  description: 'What OEM motherboards from Dell, HP, and Lenovo are, how they differ from retail boards, front panel connector differences, BIOS limitations, and when to buy one.',
  alternates: { canonical: `${SITE_URL}/guides/oem-motherboards-explained` },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'OEM Motherboards Explained',
  datePublished: '2026-05-15',
  author: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'UNITFLOW JAPAN', url: SITE_URL },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    { '@type': 'ListItem', position: 3, name: 'OEM Motherboards Explained', item: `${SITE_URL}/guides/oem-motherboards-explained` },
  ],
}

export default function GuideOEMMotherboards() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-8 font-mono flex gap-1">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-gray-300">Guides</Link>
          <span>/</span>
          <span className="text-gray-400">OEM Motherboards</span>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-4">OEM Motherboards Explained</h1>
        <p className="text-gray-500 text-sm mb-10 font-mono">UNITFLOW JAPAN · May 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-bold text-white mb-4">What Is an OEM Motherboard?</h2>
            <p className="text-gray-400 leading-relaxed">An OEM motherboard is designed by a PC manufacturer (Dell, HP, Lenovo, Fujitsu) for a specific desktop model, not sold separately at retail. It uses a standard Intel or AMD chipset but has a custom PCB layout, BIOS, and sometimes proprietary connectors optimized for their chassis.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">OEM vs Retail: Key Differences</h2>
            <div className="space-y-3">
              {[
                ['Form factor', 'OEM boards often use MicroATX or custom mini footprints designed for compact chassis.'],
                ['BIOS', 'OEM BIOS is locked to specific features. No overclock options, limited memory XMP support.'],
                ['Front panel', 'Front panel connector may be a single proprietary multi-pin header instead of standard individual pins.'],
                ['Price', 'Significantly cheaper than equivalent retail boards. Ideal for direct replacement in existing OEM chassis.'],
              ].map(([topic, desc]) => (
                <div key={topic} className="bg-bg-secondary border border-white/10 rounded p-4 text-sm">
                  <p className="text-white font-mono mb-1">{topic}</p>
                  <p className="text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Dell, HP, Lenovo: What to Expect</h2>
            <p className="text-gray-400 leading-relaxed mb-3">Each manufacturer has its own conventions:</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><span className="text-white font-mono">Dell</span> — Uses a proprietary front panel connector. Pinout is different from standard. Adapter cables exist but are not always included.</li>
              <li><span className="text-white font-mono">HP</span> — Front panel is often a single 10-pin block. Some models use standard 2-pin individual connectors. HP Compro and EliteDesk boards have good documentation online.</li>
              <li><span className="text-white font-mono">Lenovo</span> — ThinkCentre boards frequently have standard front panel pinouts. Good documentation available on Lenovo's support site.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">When to Buy OEM</h2>
            <p className="text-gray-400 leading-relaxed">OEM boards are the right choice when you need a direct replacement for an existing OEM system (same model), you are building in an OEM chassis and do not need overclocking, you are building a budget workstation or server where BIOS limitations do not matter, or you are a repair shop stocking replacement boards.</p>
            <p className="text-gray-400 leading-relaxed mt-3">Avoid OEM boards if you plan to overclock, use a custom chassis that requires standard front panel headers (without adapters), or need specific BIOS features not available in OEM firmware.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Link href="/categories/motherboard" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                Browse motherboards →
              </Link>
              <Link href="/categories/oem-parts" className="text-sm border border-white/20 text-gray-400 hover:text-white px-4 py-2 rounded transition-colors">
                All OEM parts →
              </Link>
              <Link href="/bulk-orders" className="text-sm bg-white text-gray-900 hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors">
                Bulk order inquiry →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 7: Commit**

```bash
git add app/guides/
git commit -m "feat: add guide index and 4 SEO guide articles"
```

---

## Task 14: Build 404 page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create `app/not-found.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: add 404 not-found page"
```

---

## Task 15: Final verification

- [ ] **Step 1: Run full test suite**

```bash
npx jest --no-coverage
```

Expected: all tests pass

- [ ] **Step 2: TypeScript full check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: build completes with no errors. Note any warnings about missing images (placeholders are fine).

- [ ] **Step 4: Verify key routes work in dev server**

Start the dev server (`npm run dev`) and manually check:
- `http://localhost:3000/products/intel-i5-3470-lga1155-cpu` — product page with H1, schema, Buy on eBay
- `http://localhost:3000/inventory/cpu-001` — redirects to the product slug URL
- `http://localhost:3000/categories/cpu` — category page with product grid
- `http://localhost:3000/socket/lga1155` — socket page
- `http://localhost:3000/memory/ddr3` — memory page
- `http://localhost:3000/guides/buying-used-pc-parts-from-japan` — guide article
- `http://localhost:3000/quality-policy` — quality policy
- `http://localhost:3000/quality` — redirects to /quality-policy
- `http://localhost:3000/sitemap.xml` — contains `/products/` URLs
- `http://localhost:3000/robots.txt` — disallows `/inventory/`
- `http://localhost:3000/not-found-page` — custom 404

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final SEO implementation verification pass"
```

---

## Completion Checklist

- [ ] `/products/[slug]` opens for all products with unique title/description
- [ ] Product schema (JSON-LD) present on all product pages
- [ ] `sitemap.xml` contains `/products/[slug]` URLs, not `/inventory/[id]`
- [ ] `robots.txt` disallows `/inventory/`
- [ ] `canonical` set on every page
- [ ] Internal links: Home → Inventory → Category → Product → Related
- [ ] No off-platform payment prompts anywhere
- [ ] "Buy on eBay" CTA on all product pages
- [ ] H1 present and SEO-targeted on every page
- [ ] All product images use `alt` with part name + "from Japan"
- [ ] FAQPage schema on `/faq`
- [ ] BreadcrumbList on product, category, socket, memory, guide pages
- [ ] Article schema on all guide pages
- [ ] Organization schema enriched with sameAs (eBay)
- [ ] `/quality-policy` canonical page, `/quality` redirects
- [ ] 404 page with "Browse Inventory" and "Visit eBay Store" links
- [ ] Footer uses `NEXT_PUBLIC_EBAY_STORE_URL` env var
- [ ] All tests pass
- [ ] TypeScript compiles clean
- [ ] `npm run build` succeeds
